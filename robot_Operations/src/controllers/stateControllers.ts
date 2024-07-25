import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import State from "../models/State";


export const createState = async (req: Request, res: Response) => {
  try {
    const { name, description, status } = req.body;
    const createdBy = (req.user as IUser).name;

    if (!createdBy) {
      return res.status(400).json({ error: "User is not logged in" });
    }

    const newState = new State({
      name,
      description,
      status,
      createdBy,
    });

    const savedState = await newState.save();
    res.status(201).json(savedState);
  } catch (error) {
    console.error("Error creating state:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export async function getState(req: Request, res: Response) {
  try {
    const { name } = req.params;
    const state = await State.findOne({ name: name.trim() });
    if (!state) {
      return res.status(404).json({ error: "State not found" });
    }
    res.json(state);
  } catch (error) {
    console.error("Error fetching state:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


export const updateState = async (req:Request, res:Response) => {
    try {
      const { name } = req.params;
      const { status } = req.body;
  
      const state = await State.findOne({ name });
  
      if (!state) {
        return res.status(404).json({ error: "State not found" });
      }
  
      if (state.status !== status) {
        state.status = status;
        state.markModified("status"); // Ensure this triggers the middleware
  
        const updatedState = await state.save();
        res.json(updatedState);
      } else {
        res.json(state);
      }
    } catch (error) {
      console.error("Error updating state:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  


export async function deleteState(req: Request, res: Response) {
  try {
    const {name} = await req.params;
    const deletedState = await State.findOneAndDelete({name});
    if (!deletedState) {
      return res.status(404).json({ error: "State not found" });
    }
    res.json({ message: "State deleted successfully" });
  } catch (error) {
    console.error("Error deleting state:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const getAllStates = async (req: Request, res: Response) => {
  try {
    const states = await State.find();
    res.json(states);
  } catch (error) {
    console.error("Error fetching states:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSummary = async (req: Request, res: Response) => {
  const n = parseInt(req.query.n as string, 10) || 3;
  const interval = req.query.interval as "hourly" | "daily" | "monthly";

  try {
    // Aggregate status counts
    const statusCounts = await State.countStatuses();
    const totalCount = statusCounts.reduce(
      (total, status) => total + status.count,
      0
    );
    const completedStatus = statusCounts.find(
      (status) => status.status === "completed"
    );
    const successRate = completedStatus
      ? (completedStatus.count / totalCount) * 100
      : 0;
    const cancelledStatus = statusCounts.find(
      (status) => status.status === "cancelled"
    );
    const cancellationRate = cancelledStatus
      ? (cancelledStatus.count / totalCount) * 100
      : 0;
    const statusRates = statusCounts.map((status) => ({
      status: status.status,
      rate: (status.count / totalCount) * 100,
    }));

    // Aggregate request frequency
    const frequencyData = await State.calculateRequestFrequency("daily");

    // Aggregate top peak hours
    const topPeakHours = await State.getTopPeakHours(n);

    // Respond with combined data
    res.json({
      totalCount,
      successRate,
      cancellationRate,
      statusRates,
      frequencyData,
      topPeakHours,
    });
  } catch (error) {
    console.error("Error generating summary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
