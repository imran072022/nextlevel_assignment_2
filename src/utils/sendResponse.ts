import type { Response } from "express";

type TResponse<T> = {
  statusCode: number;
  message: string;
  data?: T;
};

const sendResponse = <T>(
  res: Response,
  responseData: TResponse<T>,
): Response => {
  const { statusCode, message, data } = responseData;
  return res.status(statusCode).json({
    success: statusCode < 400,
    message,
    data,
  });
};

export default sendResponse;
