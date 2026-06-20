import { logger } from "./app/database/logging.js";
import { app } from "./app/server.js";

const port = process.env.PORT || 8000;
app.listen(port, () => {
  logger.info(`Listen on port ${port}`);
});
