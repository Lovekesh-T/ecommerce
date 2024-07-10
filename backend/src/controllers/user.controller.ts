import { Request, Response } from "express";
import { User } from "../models/user.model.js";
import { NewUserRequestBody } from "../types/type.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncError } from "../utils/asyncError.js";

export const userRegister = asyncError(
  async (req: Request<{}, {}, NewUserRequestBody>, res: Response) => {
    const { name, email, gender, photo, _id, dob } = req.body;

    const userExist = await User.findOne({ $or: [{ _id }, { email }] });

    if (userExist) {
      console.log(userExist);
      return res
        .status(200)
        .json(new ApiResponse(200, `Welcome back ${userExist.name}`));
    }
    if ([name, email, gender, photo, _id, dob].some((field) => !field)) {
      throw new ApiError(400, "All fields are required");
    }
    const user = await User.create({
      name,
      email,
      gender,
      photo,
      _id,
      dob: new Date(dob),
    });

    return res
      .status(201)
      .json(new ApiResponse(201, "User registered successfully", user));
  }
);

export const getAllUsers = asyncError(async (req, res) => {
  const users = await User.find({});
  // if (!users) throw new ApiError(500, "Database error");
  return res
    .status(200)
    .json(new ApiResponse(200, "Users fetched successfully", users));
});

export const getUser = asyncError(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "Invalid Id");

  return res
    .status(200)
    .json(new ApiResponse(200, "User fetched successfully", user));
});
export const deleteUser = asyncError(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, "Invalid Id");

  return res
    .status(200)
    .json(new ApiResponse(200, "User Deleted successfully"));
});
