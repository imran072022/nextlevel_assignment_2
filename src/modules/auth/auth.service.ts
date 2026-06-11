import bcrypt from "bcryptjs";
import { pool } from "../../db/index.js";
import type { JwtUserPayload } from "../../types/auth.types.js";
import jwt from "jsonwebtoken";
import { config } from "../../config/index.js";

type SignupInfo = {
  name: string;
  email: string;
  password: string;
  role: string;
};
type loginInfo = {
  email: string;
  password: string;
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

const loginUser = async (payload: loginInfo) => {
  const { email, password } = payload;
  // check if the user exists
  const userData = await pool.query(
    `
  SELECT * FROM users WHERE email = $1
  `,
    [email],
  );
  if (userData.rowCount === 0) {
    throw new Error("This email is not registered!");
  }
  console.log(userData);
  const user = userData.rows[0];
  // check if password matches
  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new Error("Invalid password!");
  }
  const jwtPayload: JwtUserPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.name,
  };
  if (!config.access_secret) {
    throw new Error("Access secret is not defined.");
  }
  const accessToken = jwt.sign(jwtPayload, config.access_secret, {
    expiresIn: "1d",
  });
  return { accessToken, user };
};

export const authService = {
  signupUser,
  loginUser,
};
