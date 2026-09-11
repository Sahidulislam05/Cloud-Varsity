import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { NotificationController } from "./notification.controller";

const router = Router();

router.get(
  "/my-notifications",
  auth(),
  NotificationController.getMyNotifications,
);
router.patch("/:id/read", auth(), NotificationController.markAsRead);
router.patch("/mark-all-read", auth(), NotificationController.markAllAsRead);

export const NotificationRoutes = router;
