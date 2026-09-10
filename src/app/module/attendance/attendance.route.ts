import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { AttendanceController } from "./attendance.controller";
import { markAttendanceValidationSchema } from "./attendance.validation";

const router = Router();

router.post(
  "/",
  auth("INSTRUCTOR", "SUPER_ADMIN"),
  validateRequest(markAttendanceValidationSchema),
  AttendanceController.markAttendance,
);
router.get(
  "/my-attendance",
  auth("STUDENT"),
  AttendanceController.getMyAttendance,
);
router.get(
  "/summary",
  auth("INSTRUCTOR", "SUPER_ADMIN", "DEPARTMENT_ADMIN", "REGISTRAR"),
  AttendanceController.getSectionSummary,
);
router.get(
  "/",
  auth("INSTRUCTOR", "SUPER_ADMIN", "DEPARTMENT_ADMIN", "REGISTRAR"),
  AttendanceController.getAttendanceForSection,
);

export const AttendanceRoutes = router;
