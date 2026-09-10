import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { registerCourseValidationSchema } from "./enrollment.validation";
import { EnrollmentController } from "./enrollment.controller";

const router = Router();

router.post(
  "/",
  auth("STUDENT"),
  validateRequest(registerCourseValidationSchema),
  EnrollmentController.registerCourse,
);
router.patch("/:id/drop", auth("STUDENT"), EnrollmentController.dropCourse);
router.get(
  "/my-registrations",
  auth("STUDENT"),
  EnrollmentController.getMyRegistrations,
);
router.get(
  "/",
  auth("SUPER_ADMIN", "REGISTRAR", "DEPARTMENT_ADMIN"),
  EnrollmentController.getAllRegistrations,
);

export const EnrollmentRoutes = router;
