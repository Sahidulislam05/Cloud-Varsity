// src/app/module/finance/feeStructure.controller.ts
import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { FeeStructureService } from "./feeStructure.service";

const createFeeStructure = catchAsync(async (req: Request, res: Response) => {
  const result = await FeeStructureService.createFeeStructure(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Fee structure created successfully",
    data: result,
  });
});

const getAllFeeStructures = catchAsync(async (req: Request, res: Response) => {
  const result = await FeeStructureService.getAllFeeStructures();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Fee structures retrieved successfully",
    data: result,
  });
});

const generateInvoices = catchAsync(async (req: Request, res: Response) => {
  const result = await FeeStructureService.generateInvoices(
    req.params.id as string,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Invoices generated successfully",
    data: result,
  });
});

export const FeeStructureController = {
  createFeeStructure,
  getAllFeeStructures,
  generateInvoices,
};
