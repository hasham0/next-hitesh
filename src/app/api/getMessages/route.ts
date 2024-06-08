import { auth } from "@/lib/auth";
import dbConnection from "@/lib/dbConnect";
import User from "@/models/user.model";
import mongoose from "mongoose";
import { User as authUser } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnection();
  try {
    const session = await auth();
    if (!session || !session.user) {
      throw new Error("not authenticated");
    }
    const user: authUser = session?.user;
    const userID = new mongoose.Types.ObjectId(user?._id);
    const userMessages = await User.aggregate([
      {
        $match: { id: userID },
      },
      { $unwind: "$messages" },
      {
        $sort: {
          "message.createdAt": -1,
        },
      },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!userMessages || userMessages.length === 0) {
      throw new Error("user not found in messgaes");
    }

    return NextResponse.json(
      {
        success: true,
        messages: userMessages[0].messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    const err = (error as { message: string }).message;
    return NextResponse.json(
      {
        success: false,
        message: `${err} || failed to get message`,
      },
      {
        status: 500,
      }
    );
  }
}
