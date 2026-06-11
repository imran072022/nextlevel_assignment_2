import pg, { Pool } from "pg";
import { config } from "../config/index.js";

export const pool = new Pool({
  connectionString: config.connection_string,
});
pool.on("error", (err) => {
  console.error("Unexpected DB error ", err);
});

export const initDB = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(30) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'contributor',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS issues(
      id SERIAL PRIMARY KEY,
      title VARCHAR(150) NOT NULL, 
      description TEXT NOT NULL CHECK(LENGTH(description) >= 20),
      type VARCHAR(20) NOT NULL CHECK(type IN ('bug', 'feature_request')),
      status VARCHAR(20) DEFAULT 'open' CHECK(status IN ('open', 'in_progress', 'resolved')),
      reporter_id INT references users(id),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )
      `);
    console.log("DB connected successfully.");
  } catch (error) {
    console.log("DB failed to initialize because", error);
  }
};
