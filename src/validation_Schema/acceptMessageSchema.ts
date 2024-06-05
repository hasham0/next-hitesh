import { z } from "zod";

const acceptMessageSchema = z.object({
  acceptMessages: z.boolean(),
});

export default acceptMessageSchema;
