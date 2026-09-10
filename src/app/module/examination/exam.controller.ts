import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ExamService } from "./exam.service";

const createExam = catchAsync(async (req: Request, res: Response) => {
  const result = await ExamService.createExam(req.body, req.user!);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Exam created successfully",
    data: result,
  });
});

const getExamsForSection = catchAsync(async (req: Request, res: Response) => {
  const result = await ExamService.getExamsForSection(
    req.query.sectionId as string,
    req.user!,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Exams retrieved successfully",
    data: result,
  });
});

const getMyUpcomingExams = catchAsync(async (req: Request, res: Response) => {
  const result = await ExamService.getMyUpcomingExams(req.user!.userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Upcoming exams retrieved successfully",
    data: result,
  });
});

export const ExamController = {
  createExam,
  getExamsForSection,
  getMyUpcomingExams,
};
