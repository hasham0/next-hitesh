import resend from "@/lib/resnd";
import VerificationEmail from "@/templates/verificationEmailTemp";
import { ApiResponceTS } from "@/types";

async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
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
    console.error("🚀 ~ send email error => ", error);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}

export default sendVerificationEmail;
