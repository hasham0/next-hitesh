import { Document } from "mongoose";

interface MessageSchemaTS extends Document {
  content: string;
  createdAt: Date;
}

interface UserSchemaTS extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerifired: boolean;
  isAcceptingMessage: boolean;
  message: Array<MessageSchemaTS>;
}

type ConnectionObject = {
  isConnected?: number;
};

interface ApiResponceTS {
  success: boolean;
  message: string;
  isAccesptingMessages?: boolean;
  messages?: Array<MessageSchemaTS>;
}

export type { MessageSchemaTS, UserSchemaTS, ConnectionObject, ApiResponceTS };
