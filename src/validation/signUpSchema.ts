import { z } from "zod";

const usernameValidation = z
  .string()
  .min(3, "Username must be atleast 3 character")
  .max(20, "Username can not be more than 20 character")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not containe special character");

const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalide email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 character" }),
});

export { usernameValidation, signUpSchema };
