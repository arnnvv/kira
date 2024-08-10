
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

export const getDB = (): string => {
  console.log(process.env.DATABASE_URL);
  const db: string | undefined = process.env.DATABASE_URL;
  console.log(db + "ayush")
  if (!db || db.length === 0) {
    console.log("karthik")
    throw new Error("Missing DATABASE_URL");
  }

  return db;
};

export const pool = new Pool({ connectionString: getDB() });
export const db = drizzle(pool, { schema });
