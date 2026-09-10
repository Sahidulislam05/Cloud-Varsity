import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { ExamController } from "./exam.controller";
import { createExamValidationSchema } from "./exam.validation";

const router = Router();

router.post(
  "/",
  auth("INSTRUCTOR"),
  validateRequest(createExamValidationSchema),
  ExamController.createExam,
);
router.get("/my-upcoming", auth("STUDENT"), ExamController.getMyUpcomingExams);
router.get(
  "/",
  auth("INSTRUCTOR", "SUPER_ADMIN", "DEPARTMENT_ADMIN", "REGISTRAR"),
  ExamController.getExamsForSection,
);

export const ExamRoutes = router;
