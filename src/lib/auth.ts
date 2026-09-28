import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import * as authSchema from "@/db/auth-schema";

export const auth = betterAuth({
  appName: "Actuals Studio",
  database: drizzleAdapter(getDb(), { provider: "pg", schema: authSchema }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
  },
  user: {
    additionalFields: {
      role: {
        type: ["owner", "editor", "researcher"],
        required: false,
        defaultValue: "researcher",
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (candidate) => {
          const ownerEmail = process.env.STUDIO_OWNER_EMAIL?.trim().toLowerCase();
          if (!ownerEmail || candidate.email.toLowerCase() !== ownerEmail) {
            throw new APIError("FORBIDDEN", { message: "Studio signup is restricted" });
          }
          return { data: { ...candidate, role: "owner" } };
        },
      },
    },
  },
  advanced: {
    database: {
      generateId: "uuid",
    },
  },
});
