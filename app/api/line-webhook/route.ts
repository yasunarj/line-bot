import { NextRequest } from "next/server";
import crypto from "crypto";

const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET!;
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN!;

const POST = async (req: NextRequest) => {
  const body = await req.text();
  const signature = req.headers.get("x-line-signature") || "";

  const hash = crypto
    .createHmac("SHA256", LINE_CHANNEL_SECRET)
    .update(body)
    .digest("base64");

  if (hash !== signature) {
    return new Response("Invalid signature", { status: 401 });
  }

  const events = JSON.parse(body).events;

  for (const event of events) {
    if (event.type === "message" && event.message.type === "text") {
      const replyMessage = {
        type: "text",
        text: `あなたのメッセージ: ${event.message.text}`,
      };

      await fetch("https://api.line.me/v2/bot/message/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          body: JSON.stringify({
            replyToken: event.replyToken,
            message: [replyMessage],
          }),
        }),
      });
    }
  }

  return new Response("OK", {status: 200});
};

export { POST };
