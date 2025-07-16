export const getReplyMessage = (userText: string) => {
  const text = userText.toLowerCase();

  const greetingMorning = [
    "おはようございます",
    "おはよう",
    "おはよー",
    "おっはー",
    "オハヨウ",
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

  return `あなたのメッセージ: ${text}`

  // if (text.includes("")) return "";
  // if (text.includes("")) return "";
  // if (text.includes("")) return "";
  // if (text.includes("")) return "";
  // if (text.includes("")) return "";
  // if (text.includes("")) return "";
};
