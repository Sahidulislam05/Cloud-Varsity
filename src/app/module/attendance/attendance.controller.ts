import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import type { TAttendanceListQuery } from "./attendance.interface";
import { AttendanceService } from "./attendance.service";

const markAttendance = catchAsync(async (req: Request, res: Response) => {
  const result = await AttendanceService.markAttendance(req.body, req.user!);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Attendance marked successfully",
    data: result,
  });
});

const getAttendanceForSection = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AttendanceService.getAttendanceForSection(
      req.query as TAttendanceListQuery,
      req.user!,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Attendance retrieved successfully",
      data: result,
    });
  },
);

const getSectionSummary = catchAsync(async (req: Request, res: Response) => {
  const result = await AttendanceService.getSectionSummary(
    req.query.sectionId as string,
    req.user!,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Attendance summary retrieved successfully",
    data: result,
  });
});

const getMyAttendance = catchAsync(async (req: Request, res: Response) => {
  const result = await AttendanceService.getMyAttendance(
    req.user!.userId,
    req.query.sectionId as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Your attendance retrieved successfully",
    data: result,
  });
});

export const AttendanceController = {
  markAttendance,
  getAttendanceForSection,
  getSectionSummary,
  getMyAttendance,
};
