import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { SemesterService } from "./semester.service";

const createSemester = catchAsync(async (req: Request, res: Response) => {
  const result = await SemesterService.createSemester(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Semester created successfully",
    data: result,
  });
});

const getAllSemesters = catchAsync(async (req: Request, res: Response) => {
  const result = await SemesterService.getAllSemesters();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Semesters retrieved successfully",
    data: result,
  });
});

const updateSemesterStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await SemesterService.updateSemesterStatus(
    req.params.id as string,
    req.body.status,
    req.user!.userId,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Semester status updated successfully",
    data: result,
  });
});

export const SemesterController = {
  createSemester,
  getAllSemesters,
  updateSemesterStatus,
};
