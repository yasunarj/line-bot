export const getTomorrowWeather = async (city: string = "Tochigi,jp") => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=ja&appid=${apiKey}`;

  try {
    const res = await fetch(url);
    if(!res.ok) {
      throw new Error("明日の天気予報が取得できませんでした");
    }
  
    const data = await res.json();
    const tomorrowData = data.list[8];
    const description = tomorrowData.weather?.[0]?.description ?? "不明";
    const temp = tomorrowData.main?.temp ?? "?";

    return `「${description}」、気温は${Math.round(temp)}℃の予報です。`;
  } catch(e) {
    console.error("明日の天気予報の取得に失敗", e);
  }
}