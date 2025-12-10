import fetch from "node-fetch";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const channelToken = process.env.LINE_CHANNEL_ACCESS_TOKEN!;
const userId = process.env.LINE_USER_ID!;

const createRichMenu = async () => {
  // ステップ1: リッチメニューの定義
  const richMenuBody = {
    size: { width: 2500, height: 1686 }, // LINE推奨サイズ: 2500x1686
    selected: true,
    name: "main-menu",
    chatBarText: "メニューを開く",
    areas: [
      {
        bounds: { x: 0, y: 200, width: 500, height: 1686 },
        action: { type: "message", text: "予定" },
      },
      {
        bounds: { x: 500, y: 200, width: 500, height: 1686 },
        action: { type: "message", text: "来週の予定" },
      },
      {
        bounds: { x: 1000, y: 200, width: 500, height: 1686 },
        action: { type: "message", text: "予定追加" },
      },
      {
        bounds: { x: 1500, y: 800, width: 800, height: 1686 },
        action: { type: "message", text: "明日のさくら市の天気" },
      },
      {
        bounds: { x: 1500, y: 200, width: 800, height: 1686 },
        action: { type: "message", text: "さくら市の天気" },
      },
    ],
  };

  // ステップ2: リッチメニュー作成
  const res = await fetch("https://api.line.me/v2/bot/richmenu", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${channelToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(richMenuBody),
  });

  if (!res.ok) {
    console.error("❌ リッチメニュー作成失敗");
    console.log("Status:", res.status);
    console.log("Body:", await res.text());
    return;
  }

  const result = await res.json();
  const richMenuId = result.richMenuId;
  console.log("✅ RichMenu 作成成功 ID:", richMenuId);

  // リッチメニューの詳細を取得して確認
  console.log("🔍 リッチメニュー詳細を取得中...");
  const getRichMenuRes = await fetch(
    `https://api.line.me/v2/bot/richmenu/${richMenuId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${channelToken}`,
      },
    }
  );

  if (getRichMenuRes.ok) {
    const richMenuDetail = await getRichMenuRes.json();
    console.log("📋 リッチメニュー詳細:", JSON.stringify(richMenuDetail, null, 2));
  } else {
    console.error("❌ リッチメニュー詳細取得失敗:", getRichMenuRes.status);
  }

  // ステップ3: 画像ファイルの読み込み
  const imagePath = path.join(process.cwd(), "public/images/richmenu2_compressed.png");
  if (!fs.existsSync(imagePath)) {
    console.error("❌ 画像ファイルが見つかりません:", imagePath);
    return;
  }

  const imageBuffer = fs.readFileSync(imagePath);

  // 画像サイズ制限チェック (1MB = 1024 * 1024 bytes)
  const maxSize = 1024 * 1024; // 1MB
  if (imageBuffer.length > maxSize) {
    console.error("❌ 画像サイズが制限を超えています");
    console.log("📏 現在のサイズ:", imageBuffer.length, "bytes");
    console.log("📏 制限サイズ:", maxSize, "bytes");
    return;
  }

  // ステップ4: 画像アップロード
  console.log("🔍 デバッグ情報:");
  console.log("📏 画像サイズ:", imageBuffer.length, "bytes");
  console.log("🖼️ 画像パス:", imagePath);
  
  // 複数のエンドポイントを試す
  const uploadEndpoints = [
    `https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content`,
    `https://api.line.me/v2/bot/richmenu/${richMenuId}/content`,
    `https://api.line.me/v2/bot/richmenu/${richMenuId}/content/`,
    `https://api.line.me/v2/bot/richmenu/${richMenuId}/image`,
  ];

  let uploadRes = null;

  for (const endpoint of uploadEndpoints) {
    console.log("🔗 試行中:", endpoint);
    
    uploadRes = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${channelToken}`,
        "Content-Type": "image/png",
        "Content-Length": imageBuffer.length.toString(),
      },
      body: imageBuffer,
    });

    if (uploadRes.ok) {
      console.log("✅ 成功したエンドポイント:", endpoint);
      break;
    } else {
      console.log(`❌ ${endpoint} 失敗:`, uploadRes.status);
      
      // 400エラーの場合は詳細を表示
      if (uploadRes.status === 400) {
        try {
          const errorBody = await uploadRes.text();
          console.log(`📄 ${endpoint} エラー詳細:`, errorBody);
        } catch {
          console.log(`📄 ${endpoint} エラー詳細: 読み取り失敗`);
        }
      }
    }
  }

  if (!uploadRes || !uploadRes.ok) {
    console.error("❌ 画像アップロード失敗");
  
    if (uploadRes) {
      console.log("📦 ステータスコード:", uploadRes.status);
      console.log("📨 ステータステキスト:", uploadRes.statusText);
    
      const contentType = uploadRes.headers.get("content-type");
      console.log("🧾 Content-Type:", contentType);
    
      // レスポンスボディの出力（JSONまたはテキスト）
      try {
        if (contentType?.includes("application/json")) {
          const json = await uploadRes.json();
          console.log("📘 レスポンス JSON:", JSON.stringify(json, null, 2));
        } else {
          const text = await uploadRes.text();
          console.log("📄 レスポンステキスト:", text || "(空)");
        }
      } catch (err) {
        console.error("⚠️ レスポンスパース時エラー:", err);
      }
    }
  
    // リクエスト内容の再確認
    console.log("🔐 使用トークン（先頭10文字）:", channelToken.slice(0, 10) + "...");
    console.log("🖼️ アップロード画像バッファ:", Buffer.isBuffer(imageBuffer), `(${imageBuffer.length} bytes)`);
  
    return;
  }
  

  console.log("✅ 画像アップロード成功");

  // ステップ5: ユーザーにリッチメニューをリンク
  const linkRes = await fetch(
    `https://api.line.me/v2/bot/user/${userId}/richmenu/${richMenuId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${channelToken}`,
      },
    }
  );

  if (!linkRes.ok) {
    console.error("❌ ユーザーリンク失敗");
    console.log("Status:", linkRes.status);
    console.log("Body:", await linkRes.text());
    return;
  }

  console.log("🔗 ユーザーにリッチメニューをリンクしました 🎉");
};

createRichMenu().catch(console.error);

// ターミナルコード
// npx tsc scripts/createRichMenu.ts && node scripts/createRichMenu.js

// 画像圧縮コード
// npx tsx scripts/compressImage.ts