import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { ReportController } from "./report.controller";

const router = Router();

router.get(
  "/enrollment",
  auth("SUPER_ADMIN", "REGISTRAR", "DEPARTMENT_ADMIN"),
  ReportController.getEnrollmentReport,
);
router.get(
  "/attendance",
  auth("SUPER_ADMIN", "REGISTRAR", "DEPARTMENT_ADMIN"),
  ReportController.getAttendanceReport,
);
router.get(
  "/results",
  auth("SUPER_ADMIN", "REGISTRAR"),
  ReportController.getResultReport,
);
router.get(
  "/finance",
  auth("SUPER_ADMIN", "FINANCE_ADMIN"),
  ReportController.getFinanceReport,
);

export const ReportRoutes = router;
