import pg from "pg";
import env from "dotenv";

env.config();

const db = new pg.Client({
  user: process.env.DB_USER,
  host:process.env.DB_HOST,
  database:process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port:process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,  // Required for Render to work
  },
});

db.connect();

db.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const query = (text, params) => db.query(text, params);