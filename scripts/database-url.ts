import "dotenv/config";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

export function getDatabaseUrl(useTestDatabase: boolean): string {
  const variable = useTestDatabase ? "TEST_DATABASE_URL" : "DATABASE_URL";
  const value = process.env[variable];

  if (!value) {
    throw new Error(
      `${variable} is required. Use .env.example as a reference.`,
    );
  }

  return value;
}

export function assertSafeResetTarget(connectionString: string): void {
  const url = new URL(connectionString);
  const databaseName = url.pathname.slice(1);

  if (!LOCAL_HOSTS.has(url.hostname) || !databaseName.startsWith("payflow")) {
    throw new Error(
      "Database reset is restricted to local databases whose name starts with payflow.",
    );
  }
}
