import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Prisma } from "../../generated/prisma/client";
import config from "../config";
import { AppError } from "../utils/appError";

export const globalErrorHandler = async (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (config.node_env === "development") {
    console.log("Error from Global Error Handler", err);
  }

  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let errorMessage = err.message || "Internal Server Error";
  let errors: { field?: string; message: string }[] = [
    { message: errorMessage },
  ];
  // let errorDetails = err.stack
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorMessage = err.message;
    errors = err.errors;
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    errorMessage = "You have provided incorrect field type or missing fields";
    errors = [{ message: errorMessage }];
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = httpStatus.BAD_REQUEST;
      errorMessage = "Duplicate key error";
    } else if (err.code === "P2003") {
      statusCode = httpStatus.BAD_REQUEST;
      errorMessage = "Foreign key constraint failed";
    } else if (err.code === "P2025") {
      statusCode = httpStatus.BAD_REQUEST;
      errorMessage = "Required record was not found";
    }
    errors = [{ message: errorMessage }];
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = httpStatus.UNAUTHORIZED;
      errorMessage = "Authentication failed against database server";
    } else if (err.errorCode === "P1001") {
      statusCode = httpStatus.BAD_REQUEST;
      errorMessage = "Can't reach database server";
    }
    errors = [{ message: errorMessage }];
  } else if (err instanceof Error) {
    errorMessage = err.message;
    errors = [{ message: errorMessage }];
  }

  const isClientError = statusCode < 500;

  res.status(statusCode).json({
    success: false,
    statusCode,
    message:
      isClientError || config.node_env === "development"
        ? errorMessage
        : "Something went wrong",
    errors:
      isClientError || config.node_env === "development"
        ? errors
        : [{ message: "Something went wrong" }],
    stack: config.node_env === "development" ? err.stack : undefined,
  });
};
