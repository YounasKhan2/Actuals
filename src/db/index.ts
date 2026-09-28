import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as publicationSchema from "./schema";
import * as authSchema from "./auth-schema";

const schema = { ...publicationSchema, ...authSchema };
import { getServerEnv } from "@/lib/env";

let client: ReturnType<typeof postgres> | undefined;
let database: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
  if (database) return database;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required to access the database");
  client = postgres(url, { max: 10, prepare: false });
  database = drizzle(client, { schema });
  return database;
}

export async function closeDb() {
  await client?.end();
  client = undefined;
  database = undefined;
}

export type ActualsDb = ReturnType<typeof getDb>;
