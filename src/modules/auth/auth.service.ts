import bcrypt from "bcryptjs";
import { pool } from "../../db/index.js";

type SignupInfo = {
  name: string;
  email: string;
  password: string;
  role: string;
};

const signupUser = async (payload: SignupInfo) => {
  const { name, email, password, role } = payload;
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `
        INSERT INTO users(name, email, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
    [name, email, hashedPassword, role],
  );
  return result.rows[0];
};

export const authService = {
  signupUser,
};
