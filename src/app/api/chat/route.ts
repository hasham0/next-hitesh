import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import { streamText, StreamData } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function GET(req: Request) {
  try {
    // const { messages } = await req.json();
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const data = new StreamData();
    data.append({ test: "value" });

    const result = await streamText({
      model: openai("gpt-3.5-turbo"),
      prompt,
      onFinish() {
        data.close();
      },
    });

    // const result = await streamText({
    //   model: openai("gpt-4-turbo"),
    //   prompt,
    //   onFinish() {
    //     data.close();
    //   },
    // });
    const resultData = result.toAIStreamResponse({ data });

    return NextResponse.json({
      data: resultData,
    });
  } catch (error) {
    return NextResponse.json({
      data: error,
    });
  }
}
