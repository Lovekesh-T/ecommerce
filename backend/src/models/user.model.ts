import mongoose from "mongoose";
import validator from "validator";

const Schema = mongoose.Schema;

interface IUser extends Document {
  _id: string;
  name: string;
  photo: string;
  role: "admin" | "user";
  gender: "male" | "female";
  dob: Date;
  email: string;
  createdAt:Date;
  updatedAt:Date;

  // virtul attribute
  age:number;
}
const userSchema = new Schema(
  {
    _id: {
      type: String,
      required: [true, "Please Enter Id"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    photo: {
      type: String,
      required: [true, "Please add Photo"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Please enter gender"],
    },
    dob: {
      type: Date,
      required: [true, "Please enter Date of birth"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
      validate: validator.default.isEmail,
    },
  },
  { timestamps: true }
);

userSchema.virtual("age").get(function () {
  const today = new Date();
  const dob = this.dob;
  let age = today.getFullYear() - dob.getFullYear();

  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  )
    age--;
  return age;
});

export const User = mongoose.model<IUser>("User", userSchema);
