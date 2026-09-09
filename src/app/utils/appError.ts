export class AppError extends Error {
  public statusCode: number;
  public errors: { field?: string; message: string }[];

  constructor(
    statusCode: number,
    message: string,
    errors: { field?: string; message: string }[] = [],
    stack = "",
  ) {
    super(message);

    this.statusCode = statusCode;
    this.errors = errors.length ? errors : [{ message }];

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// throw new AppError(404, "Course not found")
// throw new AppError(400, "Validation failed", [{ field: "email", message: "Invalid email" }])
