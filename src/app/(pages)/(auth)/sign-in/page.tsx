import SignInForm from "@/components/shared/sign-in-form";
import { signIn } from "@/lib/auth";
import signInSchema from "@/validation/signInSchema";
import React from "react";
import { z } from "zod";

type Props = {};

export default async function SignIn({}: Props) {
  const userSignIn = async (data: z.infer<typeof signInSchema>) => {
    "use server";
    const responce = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier.toString(),
      password: data.password,
    });
    return responce;
  };

  return <SignInForm userSignIn={userSignIn} />;
}
