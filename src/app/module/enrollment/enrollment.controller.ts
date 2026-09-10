import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import type { TRegistrationListQuery } from "./enrollment.interface";
import { EnrollmentService } from "./enrollment.service";

const registerCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await EnrollmentService.registerCourse(
    req.user!.userId,
    req.body.sectionId,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Registered for the course successfully",
    data: result,
  });
});

const dropCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await EnrollmentService.dropCourse(
    req.user!.userId,
    req.params.id as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Course dropped successfully",
    data: result,
  });
});

const getMyRegistrations = catchAsync(async (req: Request, res: Response) => {
  const result = await EnrollmentService.getMyRegistrations(req.user!.userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Registrations retrieved successfully",
    data: result,
  });
});

const getAllRegistrations = catchAsync(async (req: Request, res: Response) => {
  const result = await EnrollmentService.getAllRegistrations(
    req.query as TRegistrationListQuery,
    req.user!,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Registrations retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const EnrollmentController = {
  registerCourse,
  dropCourse,
  getMyRegistrations,
  getAllRegistrations,
};
