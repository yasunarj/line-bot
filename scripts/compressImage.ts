// scripts/compressImage.ts
import sharp from "sharp";
import fs from "fs";
import path from "path";

const inputPath = path.resolve("public/images/richmenu2.png");
const outputPath = path.resolve("public/images/richmenu2_compressed.png");

async function compressImage() {
  try {
    const data = await sharp(inputPath)
      .resize({ width: 2500, height: 1686 }) // サイズ維持
      .png({ quality: 60, compressionLevel: 9 }) // 品質調整
      .toBuffer();

    fs.writeFileSync(outputPath, data);
    console.log("✅ 圧縮成功:", outputPath, `${data.length} bytes`);
  } catch (err) {
    console.error("❌ 圧縮失敗:", err);
  }
}

compressImage();
