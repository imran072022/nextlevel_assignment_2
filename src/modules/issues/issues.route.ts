import { Router } from "express";
import { issueController } from "./issues.controller.js";
import verifyToken from "../../middlewares/verifyToken.js";
import { USER_ROLES } from "../../types/roles.types.js";

const router = Router();

router.post(
  "/",
  verifyToken(USER_ROLES.contributor, USER_ROLES.maintainer),
  issueController.createIssue,
);

export const issueRoute = router;
