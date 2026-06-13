import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../api/db/db.js";

const clientUrl = process.env.CLIENT_URL ?? "http://localhost:3001";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  baseURL: process.env.BETTER_AUTH_URL ?? clientUrl,
  trustedOrigins: [clientUrl, process.env.BETTER_AUTH_URL].filter(
    (origin): origin is string => Boolean(origin),
  ),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
