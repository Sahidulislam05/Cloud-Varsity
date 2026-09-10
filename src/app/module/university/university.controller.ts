
import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UniversityService } from "./university.service";

const getAllUniversities = catchAsync(async (req: Request, res: Response) => {
  const result = await UniversityService.getAllUniversities();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Universities retrieved successfully",
    data: result,
  });
});

export const UniversityController = { getAllUniversities };
