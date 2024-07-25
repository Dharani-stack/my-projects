import express from "express";
import session from "express-session";
import passport from "passport";
import bodyParser from "body-parser";
import { connectDB } from "./database/db";
import "./config/passport";
import userRoutes from "./routes/userRoutes";
import stateRouter from "./routes/stateRoutes";

const app = express();

const PORT = process.env.PORT;

connectDB();

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport configuration

app.use(passport.initialize());
app.use(passport.session());

//router
app.use("/user", userRoutes);
app.use("/state", stateRouter);

stateRouter;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
