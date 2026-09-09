import type { NextFunction, Request, Response } from "express";
import type { z } from "zod";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";

export const validateRequest = (zodSchema: z.ZodObject) => {
  return catchAsync((req: Request, res: Response, next: NextFunction) => {
    const payload = req.body ?? {};
    const result = zodSchema.safeParse(payload);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      throw new AppError(400, "Validation failed", errors);
    }

    req.body = result.data;
    next();
  });
};
