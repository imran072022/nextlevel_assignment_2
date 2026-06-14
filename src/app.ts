import express, { type Application } from "express";
import { authRoute } from "./modules/auth/auth.route.js";
import { issueRoute } from "./modules/issues/issues.route.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
export const app: Application = express();

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/issues", issueRoute);
app.use(globalErrorHandler);
