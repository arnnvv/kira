import type { Config } from "drizzle-kit";
import { getDB } from "@/lib/db";

export default {
  schema: "./src/lib/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: getDB(),
  },
  tablesFilter: ["kira_"],
  out: "./src/lib/db/migrations",
} satisfies Config;
