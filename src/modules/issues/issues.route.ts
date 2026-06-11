import { Router } from "express";
import { issueController } from "./issues.controller.js";
import verifyToken from "../../middlewares/verifyToken.js";

const router = Router();

router.post("/", verifyToken(), issueController.createIssue);

export const issueRoute = router;
