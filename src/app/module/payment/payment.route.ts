import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { PaymentController } from "./payment.controller";

const paymentRouter = Router();
paymentRouter.post(
  "/initiate/:invoiceId",
  auth("STUDENT"),
  PaymentController.initiatePayment,
);
paymentRouter.post("/success", PaymentController.paymentSuccess);
paymentRouter.post("/fail", PaymentController.paymentFail);
paymentRouter.post("/cancel", PaymentController.paymentCancel);
paymentRouter.post("/ipn", PaymentController.paymentIpn);
paymentRouter.get(
  "/my-invoices",
  auth("STUDENT"),
  PaymentController.getMyInvoices,
);
paymentRouter.get(
  "/invoices",
  auth("FINANCE_ADMIN", "SUPER_ADMIN"),
  PaymentController.getAllInvoices,
);

export const PaymentRoutes = paymentRouter;
