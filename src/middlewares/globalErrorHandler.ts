import type { ErrorRequestHandler } from "express";
import { AppError } from "../errors/AppError.js";

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong!";

  if (error instanceof AppError) {
    ((statusCode = error.statusCode), (message = error.message));
  } else if (error instanceof Error) {
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};
export default globalErrorHandler;
