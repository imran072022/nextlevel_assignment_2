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

router.get("/", issueController.getAllIssues);
router.get("/:id", issueController.getSingleIssue);
router.patch(
  "/:id",
  verifyToken("maintainer", "contributor"),
  issueController.updateIssue,
);
export const issueRoute = router;
