import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import type { Role } from "../../generated/prisma/enums";
import config from "../config";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";
import { verifyToken } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        name: string;
        userId: string;
        role: Role;
      };
    }
  }
}

export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized to access this resource",
      );
    }

    const token = authHeader.split(" ")[1];

    let decoded: { userId: string; name: string; email: string; role: Role };
    try {
      decoded = verifyToken(token, config.jwt_access_secret);
    } catch {
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired token");
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true, isActive: true, deletedAt: true },
    });

    if (!user || user.deletedAt) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "This account no longer exists",
      );
    }

    if (!user.isActive) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Your account has been deactivated",
      );
    }

    if (requiredRoles.length && !requiredRoles.includes(user.role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You do not have permission to perform this action",
      );
    }

    req.user = {
      userId: user.id,
      name: decoded.name,
      email: decoded.email,
      role: user.role,
    };
    next();
  });
};
