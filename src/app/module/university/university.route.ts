import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { UniversityController } from "./university.controller";

const universityRouter = Router();
universityRouter.get("/", auth(), UniversityController.getAllUniversities);

export const UniversityRoutes = universityRouter;
