// import pg from "pg";
import express from "express";
import cors from "cors";
import router from "./routes/userRoutes.js"
import dotenv from "dotenv";

// const {Pool} = pg;
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', router);

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});

// dotenv.config();

// export const pool = new Pool({
//     user:process.env.DB_USER,
//     password:process.env.DB_PASSWORD,
//     host:process.env.DB_HOST,
//     port:Number(process.env.DB_PORT),
//     database:process.env.DB_DATABASE
// });

// pool.connect((error)=>{
//     if(error){
//         console.error("Error when trying to connect with database",error)
//     }else{
//         console.log("Database connection succesfully");
//     }
// });