import { Resend } from "resend";
import { env } from "./env";

const resend = new Resend(env.NEXT_PUBLIC_RESEND_API_KEY);

export default resend;
