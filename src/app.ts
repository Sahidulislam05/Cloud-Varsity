import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import httpStatus from "http-status";
import config from "./app/config";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import { AuthRoutes } from "./app/module/auth/auth.route";
import { UserRoutes } from "./app/module/user/user.route";
import { UniversityRoutes } from "./app/module/university/university.route";
import { DepartmentRoutes } from "./app/module/department/department.route";
import { ProgramRoutes } from "./app/module/program/program.route";
import { CourseRoutes } from "./app/module/course/course.route";
import { SemesterRoutes } from "./app/module/semester/semester.route";
import { SectionRoutes } from "./app/module/section/section.route";
import { EnrollmentRoutes } from "./app/module/enrollment/enrollment.route";
import { AttendanceRoutes } from "./app/module/attendance/attendance.route";
import { FinanceRoutes } from "./app/module/finance/finance.route";
import { PaymentRoutes } from "./app/module/payment/payment.route";

const app: Application = express();

app.use(
  cors({
    origin: config.frontend_url,
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/universities", UniversityRoutes);
app.use("/api/v1/departments", DepartmentRoutes);
app.use("/api/v1/programs", ProgramRoutes);
app.use("/api/v1/courses", CourseRoutes);
app.use("/api/v1/semesters", SemesterRoutes);
app.use("/api/v1/sections", SectionRoutes);
app.use("/api/v1/enrollment", EnrollmentRoutes);
app.use("/api/v1/attendance", AttendanceRoutes);
app.use("/api/v1/fee-structures", FinanceRoutes);
app.use("/api/v1/payments", PaymentRoutes);

app.get("/", async (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "Welcome to CloudVarsity System.",
  });
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;
