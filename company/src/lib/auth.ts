import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";

import { getDb } from "@/src/lib/db";

const trustedOrigins = Array.from(
  new Set(
    [
      process.env.BETTER_AUTH_URL,
      process.env.NEXT_PUBLIC_SITE_URL,
      "http://localhost:3000",
    ].filter(
      (value): value is string =>
        Boolean(value),
    ),
  ),
);

export const auth = betterAuth({
  appName: "TrustLens Admin",

  database: prismaAdapter(getDb(), {
    provider: "postgresql",
  }),

  trustedOrigins,

  emailAndPassword: {
    enabled: true,

    // Tidak ada registrasi publik.
    disableSignUp: true,

    minPasswordLength: 12,
    maxPasswordLength: 128,
  },

  plugins: [
    admin({
      defaultRole: "user",
    }),
  ],
});