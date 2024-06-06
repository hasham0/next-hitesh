import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    MONGODB_URI: z.string().url(),
    AUTH_SECRET: z.string().min(10),
  },
  client: {
    NEXT_PUBLIC_RESEND_API_KEY: z.string(),
  },
  runtimeEnv: {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXT_PUBLIC_RESEND_API_KEY: process.env.NEXT_PUBLIC_RESEND_API_KEY,
    AUTH_SECRET: process.env.AUTH_SECRET,
  },
});
