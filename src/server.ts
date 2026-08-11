import { createApp } from "./app.js";
import { loadEnvironment } from "./config/env.js";
import { createDatabasePool } from "./shared/database.js";

try {
  const env = loadEnvironment();
  const database = createDatabasePool(env.DATABASE_URL);
  const app = createApp({ env, database });

  const server = app.listen(env.PORT, () => {
    console.log(`PayFlow Gateway listening on port ${env.PORT}`);
  });

  const shutdown = (): void => {
    server.close(() => {
      void database.end().finally(() => process.exit(0));
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
} catch (error) {
  const message =
    error instanceof Error ? error.message : "Unknown startup error";
  console.error(message);
  process.exit(1);
}
