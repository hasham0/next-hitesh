"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react"; // Assuming you have an icon for messages
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/utils/messages.json";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
export default function Home() {
  return (
    <>
      {/* Main content */}
      <main className="flex flex-grow flex-col items-center justify-center bg-gray-800 px-4 py-12 text-white md:px-24">
        <section className="mb-8 text-center md:mb-12">
          <h1 className="text-3xl font-bold md:text-5xl">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 text-base md:mt-4 md:text-lg">
            True Feedback - Where your identity remains a secret.
          </p>
        </section>

        {/* Carousel for Messages */}
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-lg md:max-w-xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-start space-y-2 md:flex-row md:space-x-4 md:space-y-0">
                    <Mail className="flex-shrink-0" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 p-4 text-center text-white md:p-6">
        © 2023 True Feedback. All rights reserved.
      </footer>
    </>
  );
}
