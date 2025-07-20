export type ForecastEntry = {
  dt_txt: string;
  weather?: { description: string }[];
  main: { temp: number };
};

export type TempEntry = {
  main?: {
    temp: number;
  };
};

export type TomorrowWeatherData = {
  weather: { description: string, main: string }[];
  pop: number
}
