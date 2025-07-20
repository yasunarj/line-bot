import {
  ForecastEntry,
  TempEntry,
  TomorrowWeatherData,
} from "@/app/types/typeScript";
import { getWeatherIcon } from "./getWeatherIcon";

export const getTomorrowWeather = async (city: string = "Tochigi,jp") => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=ja&appid=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("明日の天気予報が取得できませんでした");
    }

    const data = await res.json();
    const now = new Date();
    const tomorrowDate = new Date(now);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrowDateStr = tomorrowDate.toISOString().split("T")[0];
    const tomorrowAllData = data.list.filter((entry: ForecastEntry) => {
      return entry.dt_txt.startsWith(tomorrowDateStr);
    });
    // for(const data of tomorrowAllData) {
    //   console.log("確認用", data.weather[0].main);
    // }
    const temps = tomorrowAllData
      .map((entry: TempEntry) => entry.main?.temp)
      .filter((t: number | null): t is number => typeof t === "number");
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);
    const tempMessage =
      temps.length === 0
        ? `明日の気温情報を取得できませんでした` 
        :`-気温-\n最高気温: ${Math.round(maxTemp)}℃\n最低気温: ${Math.round(
            minTemp
          )}℃`
    const weatherDescriptionsData = tomorrowAllData.map(
      (data: TomorrowWeatherData) => {
        const description = data.weather?.[0].description ?? "不明";
        const main = data.weather?.[0].main;
        const icon = getWeatherIcon(main);
        return `${icon} ${description}`;
      }
    );

    const weatherPopsData = tomorrowAllData
      .map((data: TomorrowWeatherData) => {
        return data.pop;
      })
      .filter((p: number | null): p is number => typeof p === "number");
    const morningDescriptionSummary = weatherDescriptionsData[2] ?? "情報なし";
    const afternoonDescriptionSummary =
      weatherDescriptionsData[4] ?? "情報なし";
    const eveningDescriptionSummary = weatherDescriptionsData[6] ?? "情報なし";
    const morningPopSummary = weatherPopsData[2] ?? "情報なし";
    const afternoonPopSummary = weatherPopsData[4] ?? "情報なし";
    const eveningPopSummary = weatherPopsData[6] ?? "情報なし";

    const descriptionMessage = `-天候-\n午前中： ${morningDescriptionSummary}\n午後： ${afternoonDescriptionSummary}\n夕方： ${eveningDescriptionSummary}`;
    const popMessage = `-降水確率-\n午前中の降水確率: ${Math.round(
      morningPopSummary * 100
    )}%\n午後の降水確率: ${Math.round(
      afternoonPopSummary * 100
    )}%\n夕方の降水確率: ${Math.round(eveningPopSummary * 100)}%`;

    return `\n\n${descriptionMessage}\n\n${tempMessage}\n\n${popMessage}`;
  } catch (e) {
    console.error("明日の天気予報の取得に失敗", e);
    return "明日の天気予報を取得できませんでした";
  }
};
