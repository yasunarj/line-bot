import fetch from "node-fetch";
import * as dotenv from "dotenv";

dotenv.config();

const channelToken = process.env.LINE_CHANNEL_ACCESS_TOKEN!;

const listRichMenus = async () => {
  const res = await fetch("https://api.line.me/v2/bot/richmenu/list", {
    headers: {
      Authorization: `Bearer ${channelToken}`,
    },
  });
  const result = await res.json();
  console.log("📋 現在のリッチメニュー一覧:");
  console.dir(result, { depth: null });
};

listRichMenus().catch(console.error);