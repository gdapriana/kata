import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prismaClient } from "../database/db.js";

export const auth = betterAuth({
  trustedOrigins: ["http://localhost:3000", "https://kataclient.vercel.app"],
  database: prismaAdapter(prismaClient, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      partitioned: process.env.NODE_ENV === "production",
    },
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
});
