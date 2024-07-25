import express from "express";
import {
  register,
  login,
  logout,
  modifyAccess,
  deleteUser,
  viewAllUsers,
} from "../controllers/userControllers";

import { isSuperAdmin } from "../middleware/admin";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.put("/modify-access", isSuperAdmin, modifyAccess);
router.delete("/delete-user", isSuperAdmin, deleteUser);
router.get("/view-all-users", isSuperAdmin, viewAllUsers);

export default router;
