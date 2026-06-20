import { logger } from "./app/database/logging";
import { app } from "./app/server";

const port = process.env.PORT || 8000;
app.listen(port, () => {
  logger.info(`Listen on port ${port}`);
});
