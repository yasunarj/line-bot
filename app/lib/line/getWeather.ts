export const getWeather = async (city: string = "Utsunomiya,jp") => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ja&appid=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("天気予報の取得に失敗しました");
    }
    const data = await res.json();
    const { weather, main } = data;

    const description = weather[0]?.description ?? "不明";
    const temp = main?.temp ?? "?";

    return `現在の${city}の天気は「${description}」、気温は${temp}です。`;
  } catch (e) {
    console.error("getWeather error", e);
    return "天気予報の取得に失敗しました。";
  }
};
