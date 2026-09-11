
import type { Request, Response } from "express";
import httpStatus from "http-status";
import { AuditService } from "../audit/audit.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AdminService } from "./admin.service";

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getDashboardStats();
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Dashboard stats retrieved successfully", data: result });
});

const getAuditLogs = catchAsync(async (req: Request, res: Response) => {
  const result = await AuditService.getAuditLogs(req.query);
  sendResponse(res, { success: true, statusCode: httpStatus.OK, message: "Audit logs retrieved successfully", data: result.data, meta: result.meta });
});

export const AdminController = { getDashboardStats, getAuditLogs };