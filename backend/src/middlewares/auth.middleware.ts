import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncError } from "../utils/asyncError.js";

export const isAdmin = asyncError(async (req, res, next) => {
  const { id } = req.query;
  if (!id) throw new ApiError(401, "login required");

  const user = await User.findById(id);
  if (!user) throw new ApiError(401, "Inavlid Id");

  if (!(user.role === "admin")) throw new ApiError(403, "Unauthorized access");

  next();
});
