import VerifyCode from "@/components/shared/verify-form";
import { useToast } from "@/components/ui/use-toast";
import React from "react";

type Props = {
  params: { username: string };
};

export default function page({ params: { username } }: Props) {
  return (
    <div>
      <VerifyCode username={username} />
    </div>
  );
}
