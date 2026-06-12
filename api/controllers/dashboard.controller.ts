import type { NextFunction, Request, Response } from "express";
import { getDashboardStats } from "../services/dashboard.service";

export async function getDashboardController(_req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await getDashboardStats();
    return res.status(200).json(stats);
  } catch (error) {
    return next(error);
  }
}
