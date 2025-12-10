"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_fetch_1 = require("node-fetch");
var fs = require("fs");
var path = require("path");
var dotenv = require("dotenv");
dotenv.config();
var channelToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
var userId = process.env.LINE_USER_ID;
var createRichMenu = function () { return __awaiter(void 0, void 0, void 0, function () {
    var richMenuBody, res, _a, _b, _c, result, richMenuId, getRichMenuRes, richMenuDetail, imagePath, imageBuffer, maxSize, uploadEndpoints, uploadRes, _i, uploadEndpoints_1, endpoint, errorBody, _d, contentType, json, text, err_1, linkRes, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                richMenuBody = {
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
                return [4 /*yield*/, (0, node_fetch_1.default)("https://api.line.me/v2/bot/richmenu", {
                        method: "POST",
                        headers: {
                            Authorization: "Bearer ".concat(channelToken),
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(richMenuBody),
                    })];
            case 1:
                res = _h.sent();
                if (!!res.ok) return [3 /*break*/, 3];
                console.error("❌ リッチメニュー作成失敗");
                console.log("Status:", res.status);
                _b = (_a = console).log;
                _c = ["Body:"];
                return [4 /*yield*/, res.text()];
            case 2:
                _b.apply(_a, _c.concat([_h.sent()]));
                return [2 /*return*/];
            case 3: return [4 /*yield*/, res.json()];
            case 4:
                result = _h.sent();
                richMenuId = result.richMenuId;
                console.log("✅ RichMenu 作成成功 ID:", richMenuId);
                // リッチメニューの詳細を取得して確認
                console.log("🔍 リッチメニュー詳細を取得中...");
                return [4 /*yield*/, (0, node_fetch_1.default)("https://api.line.me/v2/bot/richmenu/".concat(richMenuId), {
                        method: "GET",
                        headers: {
                            Authorization: "Bearer ".concat(channelToken),
                        },
                    })];
            case 5:
                getRichMenuRes = _h.sent();
                if (!getRichMenuRes.ok) return [3 /*break*/, 7];
                return [4 /*yield*/, getRichMenuRes.json()];
            case 6:
                richMenuDetail = _h.sent();
                console.log("📋 リッチメニュー詳細:", JSON.stringify(richMenuDetail, null, 2));
                return [3 /*break*/, 8];
            case 7:
                console.error("❌ リッチメニュー詳細取得失敗:", getRichMenuRes.status);
                _h.label = 8;
            case 8:
                imagePath = path.join(process.cwd(), "public/images/richmenu2_compressed.png");
                if (!fs.existsSync(imagePath)) {
                    console.error("❌ 画像ファイルが見つかりません:", imagePath);
                    return [2 /*return*/];
                }
                imageBuffer = fs.readFileSync(imagePath);
                maxSize = 1024 * 1024;
                if (imageBuffer.length > maxSize) {
                    console.error("❌ 画像サイズが制限を超えています");
                    console.log("📏 現在のサイズ:", imageBuffer.length, "bytes");
                    console.log("📏 制限サイズ:", maxSize, "bytes");
                    return [2 /*return*/];
                }
                // ステップ4: 画像アップロード
                console.log("🔍 デバッグ情報:");
                console.log("📏 画像サイズ:", imageBuffer.length, "bytes");
                console.log("🖼️ 画像パス:", imagePath);
                uploadEndpoints = [
                    "https://api-data.line.me/v2/bot/richmenu/".concat(richMenuId, "/content"),
                    "https://api.line.me/v2/bot/richmenu/".concat(richMenuId, "/content"),
                    "https://api.line.me/v2/bot/richmenu/".concat(richMenuId, "/content/"),
                    "https://api.line.me/v2/bot/richmenu/".concat(richMenuId, "/image"),
                ];
                uploadRes = null;
                _i = 0, uploadEndpoints_1 = uploadEndpoints;
                _h.label = 9;
            case 9:
                if (!(_i < uploadEndpoints_1.length)) return [3 /*break*/, 16];
                endpoint = uploadEndpoints_1[_i];
                console.log("🔗 試行中:", endpoint);
                return [4 /*yield*/, (0, node_fetch_1.default)(endpoint, {
                        method: "POST",
                        headers: {
                            Authorization: "Bearer ".concat(channelToken),
                            "Content-Type": "image/png",
                            "Content-Length": imageBuffer.length.toString(),
                        },
                        body: imageBuffer,
                    })];
            case 10:
                uploadRes = _h.sent();
                if (!uploadRes.ok) return [3 /*break*/, 11];
                console.log("✅ 成功したエンドポイント:", endpoint);
                return [3 /*break*/, 16];
            case 11:
                console.log("\u274C ".concat(endpoint, " \u5931\u6557:"), uploadRes.status);
                if (!(uploadRes.status === 400)) return [3 /*break*/, 15];
                _h.label = 12;
            case 12:
                _h.trys.push([12, 14, , 15]);
                return [4 /*yield*/, uploadRes.text()];
            case 13:
                errorBody = _h.sent();
                console.log("\uD83D\uDCC4 ".concat(endpoint, " \u30A8\u30E9\u30FC\u8A73\u7D30:"), errorBody);
                return [3 /*break*/, 15];
            case 14:
                _d = _h.sent();
                console.log("\uD83D\uDCC4 ".concat(endpoint, " \u30A8\u30E9\u30FC\u8A73\u7D30: \u8AAD\u307F\u53D6\u308A\u5931\u6557"));
                return [3 /*break*/, 15];
            case 15:
                _i++;
                return [3 /*break*/, 9];
            case 16:
                if (!(!uploadRes || !uploadRes.ok)) return [3 /*break*/, 24];
                console.error("❌ 画像アップロード失敗");
                if (!uploadRes) return [3 /*break*/, 23];
                console.log("📦 ステータスコード:", uploadRes.status);
                console.log("📨 ステータステキスト:", uploadRes.statusText);
                contentType = uploadRes.headers.get("content-type");
                console.log("🧾 Content-Type:", contentType);
                _h.label = 17;
            case 17:
                _h.trys.push([17, 22, , 23]);
                if (!(contentType === null || contentType === void 0 ? void 0 : contentType.includes("application/json"))) return [3 /*break*/, 19];
                return [4 /*yield*/, uploadRes.json()];
            case 18:
                json = _h.sent();
                console.log("📘 レスポンス JSON:", JSON.stringify(json, null, 2));
                return [3 /*break*/, 21];
            case 19: return [4 /*yield*/, uploadRes.text()];
            case 20:
                text = _h.sent();
                console.log("📄 レスポンステキスト:", text || "(空)");
                _h.label = 21;
            case 21: return [3 /*break*/, 23];
            case 22:
                err_1 = _h.sent();
                console.error("⚠️ レスポンスパース時エラー:", err_1);
                return [3 /*break*/, 23];
            case 23:
                // リクエスト内容の再確認
                console.log("🔐 使用トークン（先頭10文字）:", channelToken.slice(0, 10) + "...");
                console.log("🖼️ アップロード画像バッファ:", Buffer.isBuffer(imageBuffer), "(".concat(imageBuffer.length, " bytes)"));
                return [2 /*return*/];
            case 24:
                console.log("✅ 画像アップロード成功");
                return [4 /*yield*/, (0, node_fetch_1.default)("https://api.line.me/v2/bot/user/".concat(userId, "/richmenu/").concat(richMenuId), {
                        method: "POST",
                        headers: {
                            Authorization: "Bearer ".concat(channelToken),
                        },
                    })];
            case 25:
                linkRes = _h.sent();
                if (!!linkRes.ok) return [3 /*break*/, 27];
                console.error("❌ ユーザーリンク失敗");
                console.log("Status:", linkRes.status);
                _f = (_e = console).log;
                _g = ["Body:"];
                return [4 /*yield*/, linkRes.text()];
            case 26:
                _f.apply(_e, _g.concat([_h.sent()]));
                return [2 /*return*/];
            case 27:
                console.log("🔗 ユーザーにリッチメニューをリンクしました 🎉");
                return [2 /*return*/];
        }
    });
}); };
createRichMenu().catch(console.error);
// ターミナルコード
// npx tsc scripts/createRichMenu.ts && node scripts/createRichMenu.js
// 画像圧縮コード
// npx tsx scripts/compressImage.ts
