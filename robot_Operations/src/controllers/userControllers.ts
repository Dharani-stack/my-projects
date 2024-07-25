import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/User";
import bcrypt from "bcryptjs";
import passport from "passport";

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = await req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      email,
      password: hashedPassword,
      access: "user",
      name,
    });
    await newUser.save();
    res
      .status(201)
      .json({ message: `User - ${newUser.name} registered successfully` });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = (req: Request, res: Response, next: Function) => {
  passport.authenticate(
    "local",
    (err: any, user: Express.User, info: { message: "" }) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).json({ message: info.message });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.status(200).json({ message: "Logged in successfully" });
      });
    }
  )(req, res, next);
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
};

export const modifyAccess = async (req: Request, res: Response) => {
  const { email, access } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { access },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User access modified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await User.findOneAndDelete({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message: "Server error", error: errorMessage });
  }
};

export const viewAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message: "Server error", error: errorMessage });
  }
};
