"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { ApiResponceTS, MessageSchemaTS } from "@/types";
import { useToast } from "../ui/use-toast";
import axios from "axios";

type Props = {
  message: MessageSchemaTS;
  onMsgDelete: (msgID: string) => void;
};

const MessageCard = ({ message, onMsgDelete }: Props) => {
  const { toast } = useToast();
  const hanldeDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponceTS>(
      `/api/deleteMessage/${message._id}`,
    );
    toast({
      title: response.data.message,
    });
    onMsgDelete(message?._id as string);
  };
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <X className="h-5 w-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={hanldeDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </>
  );
};

export default MessageCard;
