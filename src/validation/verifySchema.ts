import { z } from "zod";

const verifySchema = z.object({
  code: z.string().length(6, "Verification code with 6 character"),
});

export default verifySchema;
