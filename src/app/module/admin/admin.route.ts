import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { AdminController } from "./admin.controller";

const router = Router();

router.get(
  "/dashboard-stats",
  auth("SUPER_ADMIN"),
  AdminController.getDashboardStats,
);
router.get("/audit-logs", auth("SUPER_ADMIN"), AdminController.getAuditLogs);

export const AdminRoutes = router;
