import type { NextFunction, Request, Response } from "express";
import { issueService } from "./issues.service.js";
import sendResponse from "../../utils/sendResponse.js";
import catchAsync from "../../middlewares/catchAsync.js";

// create an issue
const createIssue = catchAsync(async (req: Request, res: Response) => {
  const createdIssue = await issueService.createIssueToDB(req.body, req.user);
  return sendResponse(res, {
    statusCode: 201,
    message: "Issue created successfully",
    data: {
      id: createdIssue.id,
      title: createdIssue.title,
      description: createdIssue.description,
      type: createdIssue.type,
      status: createdIssue.status,
      reporter_id: createdIssue.reporter_id,
      created_at: createdIssue.created_at,
      updated_at: createdIssue.updated_at,
    },
  });
});

// get all issues
const getAllIssues = catchAsync(async (req: Request, res: Response) => {
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
  const message =
    responseData.length > 0
      ? "Issues retrieved successfully"
      : "No issues found matching the provided filters";
  return sendResponse(res, {
    statusCode: 200,
    message,
    data: responseData,
  });
});

// get single issue
const getSingleIssue = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(404).json({
      success: false,
      message: "Invalid ID",
    });
  }

  const issue = await issueService.getSingleIssueFromDB(id);
  return sendResponse(res, {
    statusCode: 200,
    message: "Issue retrieved successfully",
    data: {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      reporter: {
        id: issue.reporter_id,
        name: issue.reporter_name,
        role: issue.reporter_role,
      },
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    },
  });
});

// update an issue
const updateIssue = async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(404).json({
      success: false,
      message: "Invalid ID",
    });
  }
  try {
    const updatedIssue = await issueService.updateIssueInDB(
      id,
      req.body,
      req.user,
    );

    return sendResponse(res, {
      statusCode: 200,
      message: "Issue updated successfully",
      data: updatedIssue,
    });
  } catch (error) {
    next(error);
  }
};

// delete an issue
const deleteIssue = async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(404).json({
      success: false,
      message: "Invalid ID",
    });
  }
  try {
    await issueService.deleteIssueFromDB(id);
    return sendResponse(res, {
      statusCode: 200,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
