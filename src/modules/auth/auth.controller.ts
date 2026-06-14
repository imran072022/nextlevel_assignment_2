import type { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service.js";
import sendResponse from "../../utils/sendResponse.js";
import catchAsync from "../../middlewares/catchAsync.js";

const signup = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.signupUser(req.body);
  return sendResponse(res, {
    statusCode: 201,
    message: "User registered successfully",
    data: {
      id: result.id,
      name: result.name,
      email: result.email,
      role: result.role,
      created_at: result.created_at,
      updated_at: result.updated_at,
    },
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);
  const { accessToken, user } = result;
  return sendResponse(res, {
    statusCode: 200,
    message: "Login successful",
    data: {
      token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    },
  });
});

export const authController = {
  signup,
  login,
};
