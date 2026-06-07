import type { Request, Response } from "express";
import { authService } from "./auth.service.js";

const signup = async (req: Request, res: Response) => {
  try {
    const result = await authService.signupUser(req.body);
    console.log(result);
    return res.status(201).json({
      success: true,
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
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const authController = {
  signup,
};
