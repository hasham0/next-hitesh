import bcryptjs from "bcryptjs";
import { MessageSchemaTS, UserDocumentTS } from "@/types";
import { Model, Schema, model, models } from "mongoose";

const MessageSchema = new Schema<MessageSchemaTS>(
  {
    content: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const UserSchema = new Schema<UserDocumentTS>(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      select: false,
    },
    verifyCode: {
      type: String,
      required: [true, "verify is required"],
    },
    verifyCodeExpiry: {
      type: Date,
    },
    isVerifired: {
      type: Boolean,
      default: false,
    },
    isAcceptingMessage: {
      type: Boolean,
      default: false,
    },
    message: [MessageSchema],
  },
  {
    timestamps: true,
  }
);

// encrypt password
UserSchema.pre("save", async function (next): Promise<void> {
  if (!this.isModified("password")) return next();
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

// compare password
UserSchema.methods.isPasswordCorrect = async function (
  password: string
): Promise<boolean> {
  return await bcryptjs.compare(password, this.password);
};

const User =
  (models?.["User"] as Model<UserDocumentTS>) ||
  model<UserDocumentTS>("User", UserSchema);

export default User;
