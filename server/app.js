import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js"
import cookieParser from "cookie-parser";
import expenseRoutes from "./routes/expense.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:[
        "http://localhost:5173",
        "https://fin-track-abc-f83d.vercel.app",
        /^https:\/\/fin-track-[a-z0-9]+-abc-f83d\.vercel\.app$/
    ],
    credentials: true
})); 
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);


const port = process.env.PORT || 3000;
console.log("NODE_ENV:", process.env.NODE_ENV);





app.listen(port, () => {
    console.log(`server working on port ${port}`);
});