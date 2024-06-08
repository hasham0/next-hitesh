import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/lib/dbConnect";
import User from "@/models/user.model";

export async function POST(request: NextRequest) {
  await dbConnection();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await User.findOne({
      username: decodedUsername,
    });
    if (!user) {
      throw new Error("user not found");
    }
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpire = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpire) {
      user.isVerifired = true;
      await user.save();
      return NextResponse.json(
        {
          success: true,
          message: `account verified successfully`,
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeNotExpire) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Verification code has expired. Please sign up again to get a new code.",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Incorrect verification code" },
        { status: 400 }
      );
    }
  } catch (error) {
    const err = (error as { message: string }).message;
    return NextResponse.json(
      {
        success: false,
        message: `${err} || verify code error`,
      },
      {
        status: 500,
      }
    );
  }
}
