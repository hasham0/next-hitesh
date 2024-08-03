"use client";

import { ApiResponceTS } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { redirect, RedirectType, useRouter } from "next/navigation";
import signInSchema from "@/validation/signInSchema";

type Props = {
  userSignIn: (data: z.infer<typeof signInSchema>) => Promise<any>;
};

const SignInForm = ({ userSignIn }: Props) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  /* <!-- form fields --> */
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  /* <!-- submit form --> */
  const onSubmitSignInForm: SubmitHandler<
    z.infer<typeof signInSchema>
  > = async (data) => {
    const result = await userSignIn(data);
    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast({
          title: "Login Failed",
          description: "Incorrect username or password",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    }
    console.log(result);
    if (result) {
      router.replace("http://localhost:3000/dashboard");
    }
  };

  return (
    <>
      <section className="flex min-h-screen items-center justify-center bg-gray-100">
        <article className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
          <main className="text-center">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Join True Feedback
            </h1>
            <p className="mb-4">Sign up to start your anonymous adventure</p>
          </main>
          <div className="text-center">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitSignInForm)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="email"
                          {...field}
                          onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            field.onChange(event);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-2 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Sign-in"
                  )}
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-center">
              <p>
                {"Don't"} have an account? &nbsp;
                <Link
                  href={"/sign-up"}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Sign-Up
                </Link>
              </p>
            </div>
          </div>
        </article>
      </section>
    </>
  );
};

export default SignInForm;
