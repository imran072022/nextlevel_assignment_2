import type { Request, Response } from "express";
import { issueService } from "./issues.service.js";
import type { IssueQuery } from "../../types/filtering.types.js";

// create an issue
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

// get all issues
const getAllIssues = async (req: Request, res: Response) => {
  try {
    const validSort = ["newest", "oldest"];
    const validType = ["bug", "feature_request"];
    const validStatus = ["open", "in_progress", "resolved"];
    const { sort, type, status } = req.query;

    if (sort && !validSort.includes(sort as string)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sort value",
      });
    }
    if (type && !validType.includes(type as string)) {
      return res.status(400).json({
        success: false,
        message: "Invalid type value",
      });
    }
    if (status && !validStatus.includes(status as string)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const responseData = await issueService.getAllIssuesFromDB(req.query);

    return res.status(200).json({
      success: true,
      message: "Issues retrieved successfully",
      data: responseData,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

// get single issue
const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const issue = await issueService.getSingleIssueFromDB(req.params);
    const {
      id,
      title,
      description,
      type,
      status,
      reporter: { id: reporterId, name: reporterName, role: reporterRole },
      created_at,
      updated_at,
    } = issue;
    console.log(issue);
    res.status(500).json({
      success: true,
      message: "Issue retrieved successfully",
      data: {
        id,
        title,
        description,
        type,
        status,
        reporter: {
          id: reporterId,
          name: reporterName,
          role: reporterRole,
        },
        created_at,
        updated_at,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
};
