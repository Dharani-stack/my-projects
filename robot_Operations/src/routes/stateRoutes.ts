import express from "express";
import {
  getSummary,
  createState,
  getState,
  updateState,
  deleteState,
  getAllStates,
} from "../controllers/stateControllers";
import { isAdmin, isUser } from "../middleware/admin";
const router = express.Router();

router.post("/createState", isAdmin, createState);
router.get("/getState/:name", getState);
router.put("/updateState/:name", isAdmin, updateState);
router.delete("/deleteState/:name", isAdmin, deleteState);
router.get("/summary", isUser, getSummary);
router.get("/getAll", isUser, getAllStates);

export default router;
