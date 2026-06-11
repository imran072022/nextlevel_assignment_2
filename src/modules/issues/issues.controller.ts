import type { Request, Response } from "express";
import { issueService } from "./issues.service.js";

const createIssue = async (req: Request, res: Response) => {
  try {
    const createdIssue = await issueService.createIssueToDB(req.body, req.user);

    return res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: {
        id: createdIssue.id,
        title: createdIssue.title,
        description: createdIssue.description,
        type: createdIssue.type,
        status: createdIssue.status,
        reporter_id: req.user.id,
        created_at: createdIssue.created_at,
        updated_at: createdIssue.updated_at,
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
export const issueController = {
  createIssue,
};
