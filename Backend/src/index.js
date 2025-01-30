import express from "express";
import cors from "cors";
import router from "./routes/userRoutes.js"

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.originalUrl}`);
  next();
});

// app.use(cors({
//   origin: 'https://users-login-1.onrender.com',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true,
// }));

app.use(express.json());

app.use('/api', router);

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});