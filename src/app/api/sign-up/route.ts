import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/database/dbConnect";
import sendVerificationEmail from "@/utils/sendVerifcationEmail";
import User from "@/models/user.model";

export async function POST(request: NextRequest | Request) {
  await dbConnection();
  try {
    const { username, email, password } = await request.json();
    const isUsernameExistAndVerified = await User.findOne({
      username,
      isVerifired: true,
    });

    if (isUsernameExistAndVerified) {
      throw new Error("username is already in use");
    }

    const isUserEmailExist = await User.findOne({
      email,
    });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const exipryDate = new Date();
    exipryDate.setHours(exipryDate.getHours() + 1);

    // if (isUserEmailExist) {
    //   if (isUserEmailExist.verifyCode) {
    //     await isUserEmailExist.save({ validateBeforeSave: false });
    //     throw new Error("User already exists with this email");
    //   } else {
    //     isUserEmailExist.verifyCode = verifyCode;
    //     isUserEmailExist.verifyCodeExpiry = new Date(Date.now() + 3600000);
    //     await isUserEmailExist.save({ validateBeforeSave: true });
    //   }
    // } else {
    //   const newUser = new User({
    //     username,
    //     email,
    //     password,
    //     verifyCode,
    //     verifyCodeExpiry: exipryDate,
    //     isVerifired: false,
    //     isAcceptingMessage: true,
    //     message: [],
    //   });
    //   await newUser.save();
    // }

    // const emailResponce = await sendVerificationEmail(
    //   email,
    //   username,
    //   verifyCode
    // );
    // if (!emailResponce.success) {
    //   throw new Error(emailResponce.message);
    // }

    // return NextResponse.json(
    //   {
    //     success: true,
    //     message: "User registered successfully. Please verify your account.",
    //   },
    //   {
    //     status: 200,
    //   }
    // );

    //  if user not exist in database
    if (!isUserEmailExist) {
      const newUser = new User({
        username,
        email,
        password,
        verifyCode,
        verifyCodeExpiry: exipryDate,
        isVerifired: false,
        isAcceptingMessage: true,
        message: [],
      });
      await newUser.save();
    }
    // if user exist in database but not verified
    else if (!isUserEmailExist.verifyCode) {
      isUserEmailExist.verifyCode = verifyCode;
      isUserEmailExist.verifyCodeExpiry = new Date(Date.now() + 3600000);
      await isUserEmailExist.save({ validateBeforeSave: false });

      const emailResponce = await sendVerificationEmail(
        email,
        username,
        verifyCode,
      );

      console.log(" --------------------------------------------");
      console.log("route.ts:113  emailResponce => ", emailResponce);
      console.log(" --------------------------------------------");

      if (!emailResponce.success) {
        throw new Error(emailResponce.message);
      }
    }
    // if user exist in database and also verified
    else {
      await isUserEmailExist.save({ validateBeforeSave: false });
      throw new Error("User already exists with this email");
    }

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully. Please verify your account.",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    const err = (error as { message: string }).message;
    console.log(err);
    return NextResponse.json(
      {
        success: false,
        message: `${err} || Failed to sign up`,
      },
      {
        status: 500,
      },
    );
  }
}
