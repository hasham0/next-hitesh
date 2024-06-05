import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    MONGODB_URI: z.string().url(),
  },
  client: {
    NEXT_PUBLIC_RESEND_API_KEY: z.string().min(1),
  },
  runtimeEnv: {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXT_PUBLIC_RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
});
