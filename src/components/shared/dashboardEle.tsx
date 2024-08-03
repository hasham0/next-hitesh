"use client";
import { Separator } from "@/components/ui/separator";
import { ApiResponceTS, MessageSchemaTS } from "@/types";
import React, { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import acceptMessageSchema from "@/validation/acceptMessageSchema";
import axios, { AxiosError } from "axios";
import { User } from "next-auth";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import MessageCard from "./message-card";
import { Loader2, RefreshCcw } from "lucide-react";

type Props = {};

const DashboardEle = ({}: Props) => {
  const [messages, setMessages] = useState<MessageSchemaTS[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const handleDeleteMessage = (mesgID: string) => {
    setMessages((pre) => pre.filter((msg) => msg._id !== mesgID));
  };
  const { data: session } = useSession();

  const { register, watch, setValue } = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMsg = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponceTS>("/api/acceptMessages");
      setValue("acceptMessages", response.data.isAccesptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponceTS>;
      toast({
        title: "error",
        description:
          axiosError.response?.data.message || "failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      //      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponceTS>("/api/getMessages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponceTS>;
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message ?? "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        //        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages, toast],
  );

  useEffect(() => {
    console.log(session);
    // if (!session || !session.user) return;

    fetchAcceptMsg();

    fetchMessages();
  }, [session, setValue, toast, fetchMessages, fetchAcceptMsg]);

  // Handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponceTS>("/api/acceptMessages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponceTS>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "Failed to update message settings",
        variant: "destructive",
      });
    }
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/you/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied!",
      description: "Profile URL has been copied to clipboard.",
    });
  };
  return (
    <>
      <div className="mx-4 my-8 w-full max-w-6xl rounded bg-white p-6 md:mx-8 lg:mx-auto">
        <h1 className="mb-4 text-4xl font-bold">User Dashboard</h1>

        <div className="mb-4">
          <h2 className="mb-2 text-lg font-semibold">Copy Your Unique Link</h2>{" "}
          <div className="flex items-center">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="input input-bordered mr-2 w-full p-2"
            />
            <Button onClick={copyToClipboard}>Copy</Button>
          </div>
        </div>

        <div className="mb-4">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="ml-2">
            Accept Messages: {acceptMessages ? "On" : "Off"}
          </span>
        </div>
        <Separator />

        <Button
          className="mt-4"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          {messages && messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageCard
                key={index}
                message={message}
                onMsgDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p>No messages to display.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardEle;
