import e, { NextFunction, Request, Response } from "express";
import { ControllerType } from "../types/type.js";

export const asyncError = (fn: ControllerType) => {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
