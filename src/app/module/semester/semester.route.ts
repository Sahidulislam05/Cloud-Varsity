import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import {
  createSemesterValidationSchema,
  updateSemesterStatusValidationSchema,
} from "../academics/academics.validation";
import { SemesterController } from "./semester.controller";

const semesterRouter = Router();
semesterRouter.post(
  "/",
  auth("SUPER_ADMIN", "REGISTRAR"),
  validateRequest(createSemesterValidationSchema),
  SemesterController.createSemester,
);
semesterRouter.get("/", auth(), SemesterController.getAllSemesters);
semesterRouter.patch(
  "/:id/status",
  auth("SUPER_ADMIN", "REGISTRAR"),
  validateRequest(updateSemesterStatusValidationSchema),
  SemesterController.updateSemesterStatus,
);


export const SemesterRoutes = semesterRouter 