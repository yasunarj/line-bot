export const getReplyMessage = (userText: string) => {
  const text = userText.toLowerCase();

  const myAddress = process.env.NEXT_PUBLIC_MY_ADDRESS;
  const myPassword = process.env.NEXT_PUBLIC_MY_PASSWORD;

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
  // if (text.includes("")) return "";
  // if (text.includes("")) return "";
  // if (text.includes("")) return "";
  // if (text.includes("")) return "";

  return `あなたのメッセージ: ${userText}`;
};
