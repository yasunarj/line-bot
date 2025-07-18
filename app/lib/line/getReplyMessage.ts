import { getWeather } from "./getWeather";
import { cityMap } from "./cityMap";
import { getTomorrowWeather } from "./getTomorrowWeather";


export const getReplyMessage = async (userText: string) => {
  const text = userText.toLowerCase();

  const myAddress = process.env.NEXT_PUBLIC_MY_ADDRESS!;
  const myPassword = process.env.NEXT_PUBLIC_MY_PASSWORD!;

  const greetingMorning = [
    "おはようございます",
    "おはよう",
    "おはよー",
    "おっはー",
    "オハヨウ",
    "おはー",
  ];
  if (greetingMorning.some((word) => text.includes(word))) {
    return "おはようございます！今日も素敵な1日になりますね✨";
  }

  const greetingEvenings = [
    "こんにちは",
    "こんにちわ",
    "こんちゃ",
    "こんちは",
    "コンニチワ",
  ];
  if (greetingEvenings.some((word) => text.includes(word))) {
    return "こんにちは！今日もいい日ですね☀️";
  }

  const greetingAfternoon = [
    "こんばんは",
    "こんばんわ",
    "こんばんはー",
    "こんばんわー",
  ];
  if (greetingAfternoon.some((word) => text.includes(word))) {
    return "こんばんは!今日もいい夜ですね🌙";
  }

  if (text.includes("私の住所")) return myAddress;
  if (text.includes("私のパスワード")) return myPassword;
  if (text.includes("明日の") && text.includes("天気")) {
    const match = userText.match(/明日の(.+?)の天気/);
    const cityName = match?.[1]

    if(cityName && cityMap[cityName]) {
      const weatherMessage = await getTomorrowWeather(cityMap[cityName]);
      return `明日の${cityName}の天気は ${weatherMessage}`
    }
  }

  if (text.includes("天気")) {
    const match = userText.match(/(.+?)の天気/);
    const cityName = match?.[1];

    if(cityName && cityMap[cityName]) {
      const weatherMessage = await getWeather(cityMap[cityName])
      return `現在の${cityName}の天気は${weatherMessage}`;
    }

    const defaultMessage = await getWeather();
    return `ご指定の場所の天気が取得できませんでした。 宇都宮の天気は${defaultMessage}`;
  }
  // if (text.includes("")) return "";
  // if (text.includes("")) return "";

  return `あなたのメッセージ: ${userText}`;
};
