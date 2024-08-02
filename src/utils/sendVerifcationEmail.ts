import resend from "@/lib/resend";
import VerificationEmail from "@/templates/verificationEmailTemp";
import { ApiResponceTS } from "@/types";

async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponceTS> {
  try {
    await resend.emails.send({
      from: "hashamsaleem75@gmail.com",
      to: email,
      subject: "Mystery Message | Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return {
      success: true,
      message: "Verification email send successfully",
    };
  } catch (error) {
    console.log(" -------------------------------------------------");
    console.log("file: sendVerifcationEmail.ts:22  error => ", error);
    console.log(" -------------------------------------------------");

    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}

export default sendVerificationEmail;
