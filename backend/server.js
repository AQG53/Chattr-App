import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser"
import cors from "cors";

import authRoutes from "./src/routes/auth.route.js"
import userRoutes from "./src/routes/user.route.js"
import chatRoutes from "./src/routes/chat.route.js"

import { connectDB } from "./src/lib/db.js";
const app = express();
const PORT = process.env.PORT;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true //to allow cookies to be sent to frontend
}))
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth/", authRoutes)
app.use("/api/users/", userRoutes)
app.use("/api/chat", chatRoutes)

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });

}

app.listen(PORT, ()=> {
    console.log("server is running on port", PORT);
    connectDB();
})