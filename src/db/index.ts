import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { getServerEnv } from "@/lib/env";
import * as publicationSchema from "./schema";
import * as authSchema from "./auth-schema";

const schema = { ...publicationSchema, ...authSchema };

let client: ReturnType<typeof postgres> | undefined;
let database: ReturnType<typeof drizzle> | undefined;

export function getDb() {
  if (database) return database;
  const { DATABASE_URL } = getServerEnv();
  client = postgres(DATABASE_URL, { max: 10, prepare: false });
  database = drizzle(client, { schema });
  return database;
}

export async function closeDb() {
  await client?.end();
  client = undefined;
  database = undefined;
}

export type ActualsDb = ReturnType<typeof getDb>;
