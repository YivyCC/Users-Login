import { Pool } from 'pg';
import env from 'dotenv';

env.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Use `pool.query` for all database queries
export const query = (text, params) => pool.query(text, params);

// import pg from "pg";
// import env from "dotenv";

// env.config();

// const db = new pg.Client({
//   user: process.env.DB_USER,
//   host:process.env.DB_HOST,
//   database:process.env.DB_DATABASE,
//   password: process.env.DB_PASSWORD,
//   port:process.env.DB_PORT,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// db.connect();

// db.on('error', (err) => {
//   console.error('Unexpected error on idle client', err);
//   process.exit(-1);
// });

// export const query = (text, params) => db.query(text, params);