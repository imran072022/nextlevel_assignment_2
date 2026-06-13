import { pool } from "../../db/index.js";
import { AppError } from "../../errors/appError.js";
import type { JwtUserPayload } from "../../types/auth.types.js";

type SubmittedIssues = {
  title: string;
  description: string;
  type: string;
};
type Params = { id: string };
type UpdatedInfo = {
  title: string;
  description: string;
  type: string;
};
const createIssueToDB = async (
  payload: SubmittedIssues,
  userInfo: JwtUserPayload,
) => {
  const { title, description, type } = payload;
  const { id: reporter_id } = userInfo;
  const result = await pool.query(
    `
        INSERT INTO issues(title, description, type, reporter_id)
        VALUES($1, $2, $3, $4)
        RETURNING *
        `,
    [title, description, type, reporter_id],
  );
  return result.rows[0];
};

const getAllIssuesFromDB = async (query: any) => {
  // Get all issues by sorting and filtering
  const { sort = "newest", type, status } = query;
  let sql = `SELECT * FROM issues`;
  const values: any = [];

  // filtering
  if (type) {
    values.push(type);
    sql += ` WHERE type = $${values.length}`;
  }

  if (status) {
    values.push(status);

    if (values.length === 1) {
      sql += ` WHERE status = $${values.length}`;
    } else {
      sql += ` AND status = $${values.length}`;
    }
  }

  // sorting
  if (sort === "oldest") {
    sql += ` ORDER BY created_at ASC`;
  } else {
    sql += ` ORDER BY created_at DESC`;
  }

  const issuesResult = await pool.query(sql, values);

  // get the reporters' IDs and all reporters/users data by those
  const reporterIds = issuesResult.rows.map((issue) => issue.reporter_id);
  const allReporters = await pool.query(
    `
      SELECT * FROM users WHERE id=ANY($1)
      `,
    [reporterIds],
  );
  // get all the issues' with exact reporters' details and return the response
  const issuesWithReporters = issuesResult.rows.map((issue) => {
    const reporter = allReporters.rows.find((r) => r.id === issue.reporter_id);

    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      reporter: reporter
        ? {
            id: reporter.id,
            name: reporter.name,
            role: reporter.role,
          }
        : null,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    };
  });
  return issuesWithReporters;
};

const getSingleIssueFromDB = async (params: any) => {
  const { id } = params;
  const issueResult = await pool.query(
    `
  SELECT i.id, i.title, i.description, i.type, i.status, i.created_at, i.updated_at,
  u.id AS reporter_id, u.name AS reporter_name, u.role AS reporter_role
  FROM issues i INNER JOIN users u ON i.reporter_id = u.id WHERE i.id = $1
  `,
    [id],
  );
  if (issueResult.rowCount === 0) {
    throw new Error("Issue not found!");
  }

  const issue = issueResult.rows[0];

  return {
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
  };
};

const updateIssueInDB = async (
  id: string,
  payload: UpdatedInfo,
  user: JwtUserPayload,
) => {
  const { title, description, type } = payload;

  const issueResult = await pool.query(
    `
    SELECT * FROM issues WHERE id = $1
    `,
    [id],
  );

  if (issueResult.rowCount === 0) {
    throw new AppError(404, "Issue not found.");
  }
  const issue = issueResult.rows[0];
  const maintainer = user.role === "maintainer";
  const authorizedContributor =
    user.role === "contributor" &&
    user.id === issue.reporter_id &&
    issue.status === "open";

  if (!maintainer && !authorizedContributor) {
    throw new AppError(403, "Forbidden access.");
  }

  const updatedResult = await pool.query(
    `
  UPDATE issues SET
  title = COALESCE($2, title), description = COALESCE($3, description), type = COALESCE($4, type)
  WHERE id = $1
  RETURNING *
  `,
    [id, title, description, type],
  );
  const updatedIssue = updatedResult.rows[0];
  return updatedIssue;
};

export const issueService = {
  createIssueToDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueInDB,
};
