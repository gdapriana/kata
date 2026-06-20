import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import { auth } from "./lib/auth.js";

export const app = express();
app.all('/api/auth/{*any}', toNodeHandler(auth));
app.use(express.json());

app.get("/", (req, res, next) => {
  return res.json({ message: "hehe" });
});
