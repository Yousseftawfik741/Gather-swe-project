
import type { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req,
  res,
  next,
) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const err = error as {
    status?: unknown;
    statusCode?: unknown;
    message?: unknown;
  };

  const candidateStatus = [err.statusCode, err.status].find(
    (value) =>
      typeof value === "number" &&
      Number.isInteger(value) &&
      value >= 400 &&
      value <= 599,
  );

  const statusCode =
    typeof candidateStatus === "number" ? candidateStatus : 500;

  const message =
    statusCode >= 500
      ? "Internal server error"
      : typeof err.message === "string"
        ? err.message
        : "Request failed";

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;
