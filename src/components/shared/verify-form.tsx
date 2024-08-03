"use client";
import React from "react";
import { useToast } from "../ui/use-toast";

import verifySchema from "@/validation/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { ApiResponceTS } from "@/types";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";

type Props = { username: string };

const VerifyCode = ({ username }: Props) => {
  const { toast } = useToast();
  const router = useRouter();
  /* <!-- form fields --> */
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  /* <!-- submit form --> */
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const responce = await axios.post("/api/verifyCode", {
        username: username,
        code: data.code,
      });
      toast({
        variant: "success",
        description: responce.data.message,
      });
      router.replace("/sign-in");
    } catch (error) {
      console.error(" ----------------------------------------------");
      console.error("file: sign-up-form.tsx:87  >=  error => ", error);
      console.error(" ----------------------------------------------");
      const axiosError = error as AxiosError<ApiResponceTS>;
      let errorMsg = axiosError.response?.data.message;
      toast({
        variant: "destructive",
        title: "Sign-up Fail",
        description: errorMsg,
      });
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Verify Your Account
            </h1>
            <p className="mb-4">
              Enter the verification code sent to your email
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Verify</Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default VerifyCode;
