import { Request, Response, NextFunction } from "express";
import { MethodNotAllowedException } from "../shared/exceptions";

export const methodNotAllowedMiddleware = (req: Request, res: Response, next: NextFunction) => {
  next(new MethodNotAllowedException())
}