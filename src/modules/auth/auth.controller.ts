import type { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service.js";
import sendResponse from "../../utils/sendResponse.js";

const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

export const authController = {
  signup,
  login,
};
