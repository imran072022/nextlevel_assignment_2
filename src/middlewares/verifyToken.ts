import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import type { JwtUserPayload } from "../types/auth.types.js";
import { pool } from "../db/index.js";
import type { ROLES } from "../types/roles.types.js";

const verifyToken = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access: token missing.",
        });
      }
      if (!config.access_secret) {
        return res.status(401).json({
          success: false,
          message: "Server misconfiguration: No secret code found.",
        });
      }

      const decodedToken = jwt.verify(
        token,
        config.access_secret,
      ) as JwtUserPayload;

      const userData = await pool.query(
        `
        SELECT * FROM users WHERE email=$1
        `,
        [decodedToken.email],
      );

      const user = userData.rows[0];

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not exists",
        });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden access.",
        });
      }

      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default verifyToken;
