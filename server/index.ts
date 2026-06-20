import { logger } from "./app/database/logging.ts";
import { app } from "./app/server.ts";

const port = process.env.PORT || 8000;
app.listen(port, () => {
  logger.info(`Listen on port ${port}`);
});
