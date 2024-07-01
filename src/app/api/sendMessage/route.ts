import dbConnection from "@/database/dbConnect";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { MessageSchemaTS } from "@/types";

export async function POST(request: NextRequest) {
  await dbConnection();
  try {
    const { username, content } = await request.json();
    const isUserExist = await User.findOne({ username });
    if (!isUserExist) {
      throw new Error("user not found");
    }
    if (!isUserExist.isAcceptingMessage) {
      throw new Error("user is not accpeting messages");
    }
    const newMessage = {
      content: content,
      createdAt: new Date(),
    };
    isUserExist.message.push(newMessage as MessageSchemaTS);
    return NextResponse.json(
      {
        success: true,
        message: `message send successfully`,
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
        message: `${err} || send message error`,
      },
      {
        status: 500,
      }
    );
  }
}
