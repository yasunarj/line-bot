// app/api/line-webhook/route.ts
import { NextRequest } from "next/server";
import crypto from "crypto";
import { getReplyMessage } from "@/app/lib/line/getReplyMessage";

const CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET!;
const ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-line-signature") || "";

  const hash = crypto
    .createHmac("SHA256", CHANNEL_SECRET)
    .update(body)
    .digest("base64");

  if (hash !== signature) {
    return new Response("Invalid signature", { status: 401 });
  }

  const events = JSON.parse(body).events;

  for (const event of events) {
    if (event.type === "message" && event.message.type === "text") {
      const replyMessage = await getReplyMessage(event.message.text);
      const replyFetchMessage = {
        type: "text",
        text: replyMessage,
      };

      await fetch("https://api.line.me/v2/bot/message/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          replyToken: event.replyToken,
          messages: [replyFetchMessage],
        }),
      });
    }
  }

  return new Response("OK", { status: 200 });
}

