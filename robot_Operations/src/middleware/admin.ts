import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/User";

//checking access of user is 'admin' and 'SuperAdmin'
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "No user is logged in" });
  }

  if ((req.user as IUser).access === "SuperAdmin" || "admin") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Admin only can modify" });
  }
};

//checking access of user is 'SuperAdmin'
export const isSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ message: "No user is logged in" });
  }

  if ((req.user as IUser).access === "SuperAdmin") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Super Admin only can modify" });
  }
};

//checking the user is any one of access 'user' | 'admin' | 'SuperAdmin'
export const isUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "No user is logged in" });
  }

  if ((req.user as IUser).access === "SuperAdmin" || "user" || "admin") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden:  no acess" });
  }
};
