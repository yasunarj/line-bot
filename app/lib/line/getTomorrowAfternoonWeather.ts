import type { ForecastEntry } from "@/app/types/typeScript";

export const getTomorrowAfternoonWeather = async (
  city: string = "Utsunomiya,jp"
) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=ja&appid=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("明日の午後の天気予報の取得に失敗しました");
    }
    const data = await res.json();
    const now = new Date();
    const tomorrowDate = new Date(now);
    tomorrowDate.setDate(now.getDate() + 1);

    const afternoonTimes = ["12:00:00", "15:00:00"];
    const afternoonForecasts = data.list.filter((entry: ForecastEntry) => {
      const dt_txt = entry.dt_txt;
      return (
        dt_txt.startsWith(tomorrowDate.toISOString().split("T")[0]) &&
        afternoonTimes.some((time) => dt_txt.endsWith(time))
      );
    });

    const afternoonSummary = afternoonForecasts.map((entry: ForecastEntry) => {
      const time = entry.dt_txt.split(" ")[1].slice(0, 5);
      const desc = entry.weather?.[0].description ?? "不明";
      const temp = entry.main?.temp ?? "?";
      return `${time} ${desc} ${Math.round(temp)}℃`;
    });
    return `\n${afternoonSummary.join("\n")}`;
  } catch (e) {
    console.error("getTomorrowAfternoonWeather error", e);
    return "明日の午後の天気予報が取得できませんでした";
  }
};
