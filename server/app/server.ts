import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import { auth } from "./lib/auth.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import blogRoute from "./routes/blog.route.js";

export const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://kataclient.vercel.app",
  "https://kataserver.vercel.app"
];

app.use(cookieParser())
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true, 
  })
);

app.all('/api/auth/{*any}', toNodeHandler(auth));
app.use(express.json());

app.get("/", (req, res, next) => {
  return res.json({ message: "hehe" });
});

app.use("/api/blogs", blogRoute);
app.use(errorMiddleware);

