import { User as authUser } from "next-auth";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Credentials from "next-auth/providers/credentials";
import dbConnection from "@/database/dbConnect";
import User from "@/models/user.model";
import { env } from "@/lib/env";

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: env.NODE_ENV !== "production",
  providers: [
    GitHub({
      clientId: env.NEXT_PUBLIC_AUTH_GITHUB_ID,
      clientSecret: env.NEXT_PUBLIC_AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: env.NEXT_PUBLIC_AUTH_GOOGLE_ID,
      clientSecret: env.NEXT_PUBLIC_AUTH_GOOGLE_SECRET,
    }),
    Facebook({
      clientId: env.NEXT_PUBLIC_AUTH_FACEBOOK_ID,
      clientSecret: env.NEXT_PUBLIC_AUTH_FACEBOOK_SECRET,
    }),
    Credentials({
      name: "credentials",
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
      async authorize(credentials: any): Promise<authUser> {
        await dbConnection();
        try {
          const user = await User.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          }).select("+password");

          if (!user) {
            throw new Error("no user found with this email or username");
          }
          if (!user.isVerified) {
            throw new Error("please verify account before login");
          }
          const isPasswordMatch = await user.isPasswordCorrect(
            credentials.password,
          );
          if (!isPasswordMatch) {
            throw new Error("incorrect password");
          }
          return user as authUser;
        } catch (error) {
          console.log(" --------------------------------------------");
          console.log("file: auth.ts:62  authorize  error => ", error);
          console.log(" --------------------------------------------");

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
