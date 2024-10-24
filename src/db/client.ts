import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const host = process.env.PG_HOST;
const port = process.env.PG_PORT;
const user = process.env.PG_USER;
const password = process.env.PG_PASSWORD;
const dbname = process.env.PG_DBNAME;

const pool = new Pool({
  host: host,
  port: Number(port),
  user: user,
  password: password,
  database: dbname,
});

export { pool };
