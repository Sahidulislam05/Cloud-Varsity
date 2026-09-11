import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ResultService } from "./result.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const publishSectionResults = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ResultService.publishSectionResults(
      req.params.sectionId as string,
      req.user!.userId,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Result published successfully",
      data: result,
    });
  },
);

export const ResultController = {
  publishSectionResults,
};
