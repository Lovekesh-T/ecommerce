import { NextFunction, Response, Request } from "express";
import { ApiErr } from "../types/type.js";

export const errorMiddleware = (
  error: ApiErr,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode || 500;
  if (error.name === "CastError") {
    error.message = "Invalid Id";
  }
  error.message = error.message || "something went wrong";

  return res.status(error.statusCode).json({
    statusCode: error.statusCode,
    message: error.message,
    success: false,
    data: null,
  });
};
