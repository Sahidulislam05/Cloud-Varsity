// src/app/module/user/user.service.ts
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import type { TUpdateProfilePayload, TUserListQuery } from "./user.interface";

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      gender: true,
      phone: true,
      avatar: true,
      isActive: true,
      createdAt: true,
      studentProfile: true,
      instructorProfile: true,
    },
  });

  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
  return user;
};

const updateMe = async (userId: string, payload: TUpdateProfilePayload) => {
  return prisma.user.update({
    where: { id: userId },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      gender: true,
      phone: true,
      avatar: true,
    },
  });
};

const getAllUsers = async (query: TUserListQuery) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
    ...(query.role && { role: query.role }),
    ...(query.search && {
      OR: [
        { name: { contains: query.search, mode: "insensitive" as const } },
        { email: { contains: query.search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    data: users,
  };
};

const updateUserStatus = async (userId: string, isActive: boolean) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.deletedAt)
    throw new AppError(httpStatus.NOT_FOUND, "User not found");

  if (user.role === "SUPER_ADMIN") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Super admin account cannot be deactivated",
    );
  }

  return prisma.user.update({
    where: { id: userId },
    data: { isActive },
    select: { id: true, name: true, email: true, isActive: true },
  });
};

export const UserService = { getMe, updateMe, getAllUsers, updateUserStatus };
