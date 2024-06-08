import { z } from "zod";

const messageSchema = z.object({
  content: z
    .string()
    .min(10, "Content must be atleat 10 character")
    .max(300, "Content must be no longer than 300 character"),
});

export default messageSchema;
