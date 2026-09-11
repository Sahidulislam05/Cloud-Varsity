// src/app/module/finance/payment.controller.ts
import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";
import { TInvoiceListQuery } from "../finance/finance.interface";

const initiatePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.initiatePayment(
    req.user!.userId,
    req.params.invoiceId as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment session created",
    data: result,
  });
});

const paymentSuccess = catchAsync(async (req: Request, res: Response) => {
  const { tran_id, val_id } = req.body;
  await PaymentService.completePayment(tran_id, val_id);
  res
    .status(httpStatus.OK)
    .send(`<h2>Payment Successful</h2><p>Transaction ID: ${tran_id}</p>`);
});

const paymentFail = catchAsync(async (req: Request, res: Response) => {
  await PaymentService.markPaymentFailed(req.body.tran_id);
  res.status(httpStatus.OK).send(`<h2>Payment Failed</h2>`);
});

const paymentCancel = catchAsync(async (req: Request, res: Response) => {
  await PaymentService.markPaymentCancelled(req.body.tran_id);
  res.status(httpStatus.OK).send(`<h2>Payment Cancelled</h2>`);
});

const paymentIpn = catchAsync(async (req: Request, res: Response) => {
  const { tran_id, val_id } = req.body;
  try {
    await PaymentService.completePayment(tran_id, val_id);
  } catch {}
  res.status(httpStatus.OK).send("IPN received");
});

const getMyInvoices = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getMyInvoices(req.user!.userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Invoices retrieved successfully",
    data: result,
  });
});

const getAllInvoices = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getAllInvoices(
    req.query as TInvoiceListQuery,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Invoices retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const PaymentController = {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIpn,
  getMyInvoices,
  getAllInvoices,
};
