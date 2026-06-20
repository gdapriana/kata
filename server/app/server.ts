import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

export const app = express();
app.use(express.json());

app.get("/", (req, res, next) => {
  return res.json({ message: "hehe" });
});
