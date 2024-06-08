import { z } from "zod";

const signInSchema = z.object({
  indentifier: z.string(),
  password: z.string(),
});

export default signInSchema;
