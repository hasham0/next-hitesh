import dbConnection from "@/lib/dbConnect";
import User from "@/models/user.model";
import { z } from "zod";
import { usernameValidation } from "@/validation/signUpSchema";
import { NextRequest, NextResponse } from "next/server";

const UsenameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: NextRequest) {
  await dbConnection();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };
    const result = UsenameQuerySchema.safeParse(queryParams);
    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      console.log("🚀 ~ GET ~ usernameError:", usernameError);
      throw new Error("username valid error");
    }
    const { username } = result.data;
    const isUserExist = await User.findOne({
      username,
      isVerifired: true,
    });
    if (isUserExist) {
      console.log("🚀 ~ GET ~ isUserExist:", isUserExist);
      throw new Error("username is already taken");
    }

    return NextResponse.json(
      {
        status: true,
        messaege: "username is avaliable",
      },
      { status: 200 }
    );
  } catch (error) {
    const err = (error as { message: string }).message;
    return NextResponse.json(
      {
        success: false,
        message: `${err} || unique username error`,
      },
      {
        status: 500,
      }
    );
  }
}
