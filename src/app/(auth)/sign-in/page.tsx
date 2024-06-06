import { signIn } from "@/lib/auth";
import React from "react";

type Props = {};

export default function SignIn({}: Props) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn();
      }}
    >
      <button type="submit">Sign in</button>
    </form>
  );
}
