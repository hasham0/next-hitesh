import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Credentials from "next-auth/providers/credentials";
import dbConnection from "@/database/dbConnect";
import User from "@/models/user.model";
import { env } from "@/lib/env";

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,
  providers: [
    GitHub,
    Google,
    Facebook,
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials: any): Promise<any> {
        console.table("🚀 ~ authorize ~ credentials:", credentials);
        await dbConnection();
        try {
          const user = await User.findOne({
            $or: [
              { email: credentials.identifer.email },
              { username: credentials.identifer.username },
            ],
          }).select("+password");
          if (!user) {
            throw new Error("no user found with this email or username");
          }
          if (!user.isVerifired) {
            throw new Error("please verify account before login");
          }
          const isPasswordMatch = await user.isPasswordCorrect(
            credentials.password
          );
          if (!isPasswordMatch) {
            throw new Error("incorrect password");
          }
          return user;
        } catch (error) {
          console.error("🚀 ~ authorize ~ error:", error);
          const err = (error as { message: string }).message;
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerfied = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: env.AUTH_SECRET,
});
