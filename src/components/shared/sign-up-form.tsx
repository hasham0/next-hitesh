"use client";
import { ApiResponceTS } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
import * as z from "zod";
import axios, { AxiosError } from "axios";
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
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/validation/signUpSchema";

const SignUpForm = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [username, setUsername] = useState<string>("");
  const [usernameMessage, setUsernameMessage] = useState<string>("");
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const debounced = useDebounceCallback(setUsername, 300);

  /* <!-- form fields --> */
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  /* <!-- check username uniqueness --> */
  useEffect(() => {
    const checkUsernameUnique = async () => {
      setIsCheckingUsername(true);
      if (username) {
        setUsernameMessage(""); // Reset message
        try {
          const response = await axios.get<ApiResponceTS>(
            `/api/checkUserUnique?username=${username}`,
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponceTS>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username",
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
    return () => {};
  }, [username, toast]);

  /* <!-- submit form --> */
  const onSubmitSignUpForm: SubmitHandler<
    z.infer<typeof signUpSchema>
  > = async (data) => {
    try {
      setIsSubmitting(true);
      const responce = await axios.post<ApiResponceTS>("/api/sign-up", data);
      console.log(" ----------------------------------------------------");
      console.log("file: sign-up-form.tsx:78  >=  responce => ", responce);
      console.log(" ----------------------------------------------------");
      toast({
        title: "Success",
        description: responce.data?.message,
      });
      router.replace(`/verify/${username}`);
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
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Join True Feedback
            </h1>
            <p className="mb-4">Sign up to start your anonymous adventure</p>
          </div>
          <div className="text-center">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitSignUpForm)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="username"
                          {...field}
                          onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            field.onChange(event);
                            debounced(event.target.value);
                          }}
                        />
                      </FormControl>
                      <p
                        className={`text-sm ${
                          usernameMessage === "username is avaliable"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {usernameMessage ? (
                          <> test : {usernameMessage}</>
                        ) : null}
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email" {...field} />
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
                    "Sign-up"
                  )}
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-center">
              <p>
                Already member?&nbsp;
                <Link
                  href={"/sign-in"}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Sign-In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpForm;
