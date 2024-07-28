import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    MONGODB_URI: z.string().url(),
    AUTH_SECRET: z.string().min(10),
  },
  client: {
    NEXT_PUBLIC_RESEND_API_KEY: z.string().min(5),
    NEXT_PUBLIC_AUTH_FACEBOOK_ID: z.string().min(5),
    NEXT_PUBLIC_AUTH_GITHUB_ID: z.string().min(5),
    NEXT_PUBLIC_AUTH_GOOGLE_ID: z.string().min(5),
    NEXT_PUBLIC_AUTH_FACEBOOK_SECRET: z.string().min(5),
    NEXT_PUBLIC_AUTH_GITHUB_SECRET: z.string().min(5),
    NEXT_PUBLIC_AUTH_GOOGLE_SECRET: z.string().min(5),
  },
  runtimeEnv: {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXT_PUBLIC_RESEND_API_KEY: process.env.NEXT_PUBLIC_RESEND_API_KEY,
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXT_PUBLIC_AUTH_FACEBOOK_ID: process.env.NEXT_PUBLIC_AUTH_FACEBOOK_ID,
    NEXT_PUBLIC_AUTH_GITHUB_ID: process.env.NEXT_PUBLIC_AUTH_GITHUB_ID,
    NEXT_PUBLIC_AUTH_GOOGLE_ID: process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID,

    NEXT_PUBLIC_AUTH_FACEBOOK_SECRET:
      process.env.NEXT_PUBLIC_AUTH_FACEBOOK_SECRET,
    NEXT_PUBLIC_AUTH_GITHUB_SECRET: process.env.NEXT_PUBLIC_AUTH_GITHUB_SECRET,
    NEXT_PUBLIC_AUTH_GOOGLE_SECRET: process.env.NEXT_PUBLIC_AUTH_GOOGLE_SECRET,
  },
});
