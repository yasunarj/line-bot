import dayjs from "dayjs";
import { getWeather } from "./getWeather";
import { cityMap } from "./cityMap";
import { getTomorrowWeather } from "./getTomorrowWeather";
import { getTomorrowMorningWeather } from "./getTomorrowMorningWeather";
import { getTomorrowAfternoonWeather } from "./getTomorrowAfternoonWeather";
import { getTomorrowEveningWeather } from "./getTomorrowEveningWeather";
import { getGoogleCalendarEvents } from "../google/goggle";
import { createGoogleCalendarEvent } from "../google/createCalendar";
import { getFreshAccessToken } from "../google/token";
import { deleteGoogleCalendarEvent } from "../google/deleteGoogleCalendarEvent";

const myAddress = process.env.NEXT_PUBLIC_MY_ADDRESS!;
const myPassword = process.env.NEXT_PUBLIC_MY_PASSWORD!;
const refreshToken = process.env.MY_GOOGLE_REFRESH_TOKEN!;

export const getReplyMessage = async (userText: string) => {
  const text = userText.toLowerCase();

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
  if (
    text.includes("明日の") &&
    text.includes("午前") &&
    text.includes("天気")
  ) {
    const match = userText.match(/明日の(.+?)の午前.*天気/);
    const cityName = match?.[1];

    if (cityName && cityMap[cityName]) {
      const message = await getTomorrowMorningWeather(cityMap[cityName]);
      return `明日の${cityName}の午前中の天気は以下の通りです${message}`;
    }
    const defaultMessage = await getTomorrowMorningWeather();
    return `ご指定の場所の午前中の天気が取得できませんでした。宇都宮の午前中の天気は${defaultMessage}`;
  }

  if (
    text.includes("明日の") &&
    text.includes("午後") &&
    text.includes("天気")
  ) {
    const match = userText.match(/明日の(.+?)の午後.*天気/);
    const cityName = match?.[1];

    if (cityName && cityMap[cityName]) {
      const message = await getTomorrowAfternoonWeather(cityMap[cityName]);
      return `明日の${cityName}の午後の天気は以下の通りです${message}`;
    }
    const defaultMessage = await getTomorrowAfternoonWeather();
    return `ご指定の場所の午後の天気が取得できませんでした。宇都宮の午後の天気は${defaultMessage}`;
  }

  if (
    text.includes("明日の") &&
    text.includes("夕方") &&
    text.includes("天気")
  ) {
    const match = userText.match(/明日の(.+?)の夕方.*天気/);
    const cityName = match?.[1];

    if (cityName && cityMap[cityName]) {
      const message = await getTomorrowEveningWeather(cityMap[cityName]);
      return `明日の${cityName}の夕方の天気は以下の通りです ${message}`;
    }
    const defaultMessage = getTomorrowEveningWeather();
    return `ご指定の場所の夕方の天気が取得できませんでした。宇都宮の夕方の天気は${defaultMessage}`;
  }

  if (text.includes("明日の") && text.includes("天気")) {
    const match = userText.match(/明日の(.+?)の天気/);
    const cityName = match?.[1];

    if (cityName && cityMap[cityName]) {
      const weatherMessage = await getTomorrowWeather(cityMap[cityName]);
      return `明日の${cityName}の天気は以下の通りです ${weatherMessage}`;
    }

    const defaultMessage = await getTomorrowWeather();
    return `ご指定の場所の明日の天気が取得できませんでした。宇都宮の天気は${defaultMessage}`;
  }

  if (text.includes("天気")) {
    const match = userText.match(/(.+?)の天気/);
    const cityName = match?.[1];

    if (cityName && cityMap[cityName]) {
      const weatherMessage = await getWeather(cityMap[cityName]);
      return `現在の${cityName}の天気は${weatherMessage}`;
    }

    const defaultMessage = await getWeather();
    return `ご指定の場所の天気が取得できませんでした。 宇都宮の天気は${defaultMessage}`;
  }

  if (text.startsWith("予定の登録")) {
    const match = text.match(
      /予定の登録\s+(\d+)月(\d+)日\s+(\d+):(\d+)\s+(.+)/
    );
    if (!match) {
      return "予定登録の形式が正しくありません。このように入力してください。\n予定の登録 7月30日 15:00 会議";
    }

    const [, month, day, hour, minute, summary] = match;
    const year = new Date().getFullYear();
    const startDate = new Date(
      year,
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute)
    );
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    const accessToken = await getFreshAccessToken();

    await createGoogleCalendarEvent(accessToken, summary, startDate, endDate);
    return `以下の予定を登録しました:\n📅 ${summary}\n🕒 ${month}月${day}日 ${hour}:${minute}`;
  }

  if (text.startsWith("予定の削除")) {
    const match = text.match(/予定の削除\s+(\d+)月(\d+)日\s+(.+)/);
    if (!match) {
      return "予定削除の形式が正しくありません。このように入力してください。\n予定の削除 7月30日 会議";
    }

    const [, month, day, summary] = match;
    const year = new Date().getFullYear();

    const timeMin = new Date(year, Number(month) - 1, Number(day), 0, 0, 0);
    const timeMax = new Date(year, Number(month) - 1, Number(day), 23, 59, 59);

    const accessToken = await getFreshAccessToken();
    const refreshToken = process.env.MY_GOOGLE_REFRESH_TOKEN!;
    const events = await getGoogleCalendarEvents(
      accessToken,
      refreshToken,
      timeMin,
      timeMax
    );

    const eventToDelete = events?.find(
      (event) =>
        event.summary === summary &&
        new Date(
          (event.start?.dateTime as string) || (event.start?.date as string)
        ).getDate() === Number(day)
    );

    if (!eventToDelete) {
      return `「${summary}という予定は${month}月${day}日に見つかりませんでした。」`;
    }

    await deleteGoogleCalendarEvent(accessToken, eventToDelete.id!);

    return `以下の予定を削除しました:\n📅 ${summary}\n🗓 ${month}月${day}日`;
  }

  if (text.includes("予定")) {
    const now = new Date();
    const future = new Date();
    future.setDate(now.getDate() + 30);

    let filterByWeekday: number | null = null;
    let timeMin = now;
    let timeMax = future;

    if (text.includes("明日")) {
      timeMin = dayjs().add(1, "day").startOf("day").toDate();
      timeMax = dayjs().add(1, "day").endOf("day").toDate();
    }
    if (text.includes("来週の予定")) {
      const today = dayjs();
      const startOfNextWeek = today.add(1, "week").startOf("week");
      const endOfNextWeek = startOfNextWeek.endOf("week");

      timeMin = startOfNextWeek.toDate();
      timeMax = endOfNextWeek.toDate();
    }

    if (text.includes("来月の予定")) {
      const startOfNextMonth = dayjs().add(1, "month").startOf("month");
      const endOfNextMonth = startOfNextMonth.endOf("month");

      timeMin = startOfNextMonth.toDate();
      timeMax = endOfNextMonth.toDate();
    }

    const weekdayMatch = text.match(/(日|月|火|水|金|土)曜日の予定/);
    if (weekdayMatch) {
      const weekdayMap: Record<
        "日" | "月" | "火" | "水" | "木" | "金" | "土",
        number
      > = { 日: 0, 月: 1, 火: 2, 水: 3, 木: 4, 金: 5, 土: 6 };
      const weekday = weekdayMatch[1] as keyof typeof weekdayMap;
      filterByWeekday = weekdayMap[weekday];
    }

    try {
      const accessToken = await getFreshAccessToken();
      const events = await getGoogleCalendarEvents(
        accessToken,
        refreshToken,
        timeMin,
        timeMax
      );

      const filteredEvents =
        filterByWeekday !== null
          ? events?.filter((e) => {
              const date = new Date(
                (e.start?.dateTime as string) || (e.start?.date as string)
              );
              return date.getDay() === filterByWeekday;
            })
          : events;

      if (filteredEvents?.length === 0) {
        return "予定は見つかりませんでした。";
      }

      const message = filteredEvents
        ?.map((e) => {
          const startRaw = e.start?.dateTime || e.start?.date;
          const endRaw = e.end?.dateTime || e.end?.date;
          const start = dayjs(startRaw).format("YYYY年MM月DD日 HH:mm");
          const end = dayjs(endRaw).format("YYYY年MM月DD日 HH:mm");

          return `📅 ${e.summary || " (無題) "}\n${start}時 〜 \n${end}時`;
        })
        .join("\n\n");

      return `ご指定された予定は以下の通りです\n\n${message}`;
    } catch (e) {
      console.error("予定の取得に失敗", e);
      return "予定の取得に失敗しました";
    }
  }
  return `申し訳ありませんが返答できる内容は以下のみになります\n\n私の住所\n私のパスワード\n(都道府県)の天気\n明日の(都道府県)の(時間帯)の天気\n明日の予定\n〇曜日の予定\n来週の予定\n来月の予定\n予定の登録`;
};
