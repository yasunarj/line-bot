export const getWeatherIcon = (main: string): string => {
  switch (main.toLowerCase()) {
    case "clear":
      return "☀️";
    case "clouds":
      return "☁️";
    case "rain":
      return "☔️";
    case "snow":
      return "❄️";
    case "thunderstorm":
      return "⛈️";
    case "drizzle":
      return "🌦️";
    case "mist":
    case "fog":
    case "haze":
      return "🌫️";
    default:
      return "?";
  }
};
