import { describe, expect, it } from "vitest";
import { loadEnvironment } from "../src/config/env.js";

describe("environment", () => {
  it("requires a database URL", () => {
    expect(() => loadEnvironment({})).toThrow(
      "DATABASE_URL is required. Use .env.example as a reference.",
    );
  });
});
