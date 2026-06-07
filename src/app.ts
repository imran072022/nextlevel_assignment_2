import express, { type Application } from "express";
import { authRoute } from "./modules/auth/auth.route.js";
export const app: Application = express();

app.use(express.json());

app.use("/api/auth", authRoute);
