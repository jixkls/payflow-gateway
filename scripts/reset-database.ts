import { Client } from "pg";
import { assertSafeResetTarget, getDatabaseUrl } from "./database-url.js";

const useTestDatabase = process.argv.includes("--test");
const connectionString = getDatabaseUrl(useTestDatabase);
assertSafeResetTarget(connectionString);

const client = new Client({ connectionString });

async function resetDatabase(): Promise<void> {
  await client.connect();
  await client.query("DROP SCHEMA public CASCADE");
  await client.query("CREATE SCHEMA public");
  console.log(
    `Reset local database: ${new URL(connectionString).pathname.slice(1)}`,
  );
}

resetDatabase()
  .catch((error: unknown) => {
    const message =
      error instanceof Error ? error.message : "Database reset failed";
    console.error(message);
    process.exitCode = 1;
  })
  .finally(() => client.end());
