import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  access: "user" | "admin" | "SuperAdmin";
}

const userEmailRegx = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    match: [
      userEmailRegx,
      "Invalid User mail Id or not a proper e-mail formate",
    ],
    unique: true,
  },
  name: {
    type: String,
    unique: true,
    required: [true, "Name is required"],
  },
  password: {
    type: String,
    unique: true,
    required: [true, "Password is required"],
    minlength: [4, "Minimum 4 character should be password"],
  },
  access: {
    type: String,
    enum: ["user", "admin", "SuperAdmin"],
    default: "user",
  },
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
