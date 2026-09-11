import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import {
  createFeeStructureValidationSchema,
  generateInvoicesValidationSchema,
} from "./finance.validation";
import { FeeStructureController } from "./feeStructure.controller";

const feeStructureRouter = Router();
feeStructureRouter.post(
  "/",
  auth("FINANCE_ADMIN", "SUPER_ADMIN"),
  validateRequest(createFeeStructureValidationSchema),
  FeeStructureController.createFeeStructure,
);
feeStructureRouter.get("/", auth(), FeeStructureController.getAllFeeStructures);
feeStructureRouter.post(
  "/:id/generate-invoices",
  auth("FINANCE_ADMIN", "SUPER_ADMIN"),
  validateRequest(generateInvoicesValidationSchema),
  FeeStructureController.generateInvoices,
);

export const FinanceRoutes = feeStructureRouter;
