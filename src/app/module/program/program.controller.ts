import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ProgramService } from "./program.service";

const createProgram = catchAsync(async (req: Request, res: Response) => {
  const result = await ProgramService.createProgram(req.body, req.user!);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Program created successfully",
    data: result,
  });
});

const getAllPrograms = catchAsync(async (req: Request, res: Response) => {
  const result = await ProgramService.getAllPrograms(
    req.query.departmentId as string | undefined,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Programs retrieved successfully",
    data: result,
  });
});

const updateProgram = catchAsync(async (req: Request, res: Response) => {
  const result = await ProgramService.updateProgram(
    req.params.id as string,
    req.body,
    req.user!,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Program updated successfully",
    data: result,
  });
});

export const ProgramController = {
  createProgram,
  getAllPrograms,
  updateProgram,
};
