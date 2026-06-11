import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

export const config = {
  port: process.env.PORT,
  connection_string: process.env.CONNECTION_STRING,
  access_secret: process.env.ACCESS_SECRET,
};
