import dbConnection from "@/database/dbConnect";
import { auth } from "@/lib/auth";
import User from "@/models/user.model";
import { User as authUser } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type params = {
  id: { params: { id: string } };
};

export async function DELETE(request: NextRequest, params: params) {
  await dbConnection();
  try {
    const msgID = params.id;
    const session = await auth();
    const user = session?.user as authUser;

    if (!session || !session.user) {
      throw new Error("not authenticated");
    }

    const updatedresult = await User.updateOne(
      {
        _id: user._id,
      },
      {
        $pull: {
          messages: {
            _id: msgID,
          },
        },
      },
    );

    if (updatedresult.modifiedCount === 0) {
      throw new Error("message not found or already deleted");
    }

    return NextResponse.json({
      suscess: true,
      message: "message deleted",
      status: 200,
    });
  } catch (error) {
    const err = (error as { message: string }).message;
    return NextResponse.json(
      {
        success: false,
        message: `${err} || failed to delete messages`,
      },
      {
        status: 500,
      },
    );
  }
}
