import { auth } from "@/lib/auth";
import dbConnection from "@/database/dbConnect";
import User from "@/models/user.model";
import { User as authUser } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnection();
  try {
    const session = await auth();
    if (!session || !session.user) {
      throw new Error("not authenticated");
    }
    const user: authUser = session?.user;
    const userID = user?._id;
    const { acceptMessages } = await request.json();
    const updateUser = await User.findByIdAndUpdate(
      { _id: userID },
      {
        $set: { isAcceptingMessage: acceptMessages },
      },
      { new: true },
    );
    if (!updateUser) {
      throw new Error("user cannot update");
    }
    return NextResponse.json(
      {
        success: true,
        message: `Messages updated successfully`,
        data: updateUser,
      },
      {
        status: 500,
      },
    );
  } catch (error) {
    const err = (error as { message: string }).message;
    return NextResponse.json(
      {
        success: false,
        message: `${err} || failed to accept message`,
      },
      {
        status: 500,
      },
    );
  }
}
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      throw new Error("not authenticated");
    }
    const user: authUser = session?.user;
    const userID = user?._id;
    const isUserFound = await User.findById({ _id: userID });
    if (!isUserFound) {
      throw new Error("user not found");
    }
    return NextResponse.json(
      { success: true, isAcceptingMesssages: isUserFound?.isAcceptingMessage },
      {
        status: 200,
      },
    );
  } catch (error) {
    const err = (error as { message: string }).message;
    return NextResponse.json(
      {
        success: false,
        message: `${err} || failed to get messages`,
      },
      {
        status: 500,
      },
    );
  }
}
