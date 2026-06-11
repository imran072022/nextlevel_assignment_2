import { pool } from "../../db/index.js";
import type { JwtUserPayload } from "../../types/auth.types.js";

type SubmittedIssues = {
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

export const issueService = {
  createIssueToDB,
};
