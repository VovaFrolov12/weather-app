export type TemperatureUnit = "metric" | "imperial";

export interface GeoLocation {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeatherResponse {
  coord: { lon: number; lat: number };
  weather: WeatherCondition[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  name: string;
  sys: {
    country: string;
  };
  dt: number;
  timezone: number;
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: WeatherCondition[];
  wind: {
    speed: number;
  };
  dt_txt: string;
}

export interface ForecastResponse {
  list: ForecastItem[];
  city: {
    name: string;
    country: string;
    timezone: number;
  };
}

export interface DailyForecast {
  date: string;
  dayLabel: string;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
}

export interface WeatherData {
  location: GeoLocation;
  current: CurrentWeatherResponse;
  forecast: ForecastResponse;
}

export interface SearchHistoryItem {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export type AppStatus =
  | "idle"
  | "loading"
  | "ready"
  | "error"
  | "not_found"
  | "geo_denied"
  | "geo_unsupported";
