import { toNodeHandler } from "better-auth/node";
import express, { type Request, type Response } from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "yaml";
import { auth } from "../lib/auth";
import cors from "cors";
import blogRouter from "./routes/blog.routes";
import categoryRouter from "./routes/category.routes";
import tagRouter from "./routes/tag.routes";
import imageRouter from "./routes/image.routes";
import dashboardRouter from "./routes/dashboard.routes";

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL ?? "http://localhost:3001",
  process.env.BETTER_AUTH_URL ?? "http://localhost:3001",
  "http://localhost:3000",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.all("/api/auth/*", toNodeHandler(auth));
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OPENAPI_PATH = path.resolve(__dirname, "../openapi/openapi.yaml");

function loadOpenApi() {
  const raw = fs.readFileSync(OPENAPI_PATH, "utf-8");
  return yaml.parse(raw);
}

const openApiDocument = loadOpenApi();

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Hello from kata server" });
});

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.get("/api", (_req: Request, res: Response) => {
  res.json(openApiDocument);
});

app.get("/api/openapi.yaml", (_req: Request, res: Response) => {
  res.type("application/yaml").send(fs.readFileSync(OPENAPI_PATH, "utf-8"));
});

app.use("/api/blogs", blogRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/tags", tagRouter);
app.use("/api/images", imageRouter);
app.use("/api/dashboard", dashboardRouter);

app.get("/api/docs", (_req: Request, res: Response) => {
  const specUrl = "/api";
  res.type("html").send(`<!doctype html>
<html>
  <head>
    <title>${openApiDocument.info?.title ?? "API"} – Docs</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js" crossorigin></script>
    <script>
      window.onload = () => {
        window.ui = SwaggerUIBundle({ url: "${specUrl}", dom_id: "#swagger-ui" });
      };
    </script>
  </body>
</html>`);
});

app.use((error: unknown, _req: Request, res: Response, _next: express.NextFunction) => {
  console.error(error);
  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Unexpected server error",
    },
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
