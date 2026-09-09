import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const registerUser = catchAsync(async (req: Request, res: Response) => {});

const loginUser = catchAsync(async (req: Request, res: Response) => {});

export const AuthController = {
  registerUser,
  loginUser,
};
