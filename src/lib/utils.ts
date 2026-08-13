import type {
  DailyForecast,
  ForecastItem,
  GeoLocation,
  TemperatureUnit,
} from "./types";

export function formatCity(location: {
  name: string;
  country: string;
  state?: string;
}): string {
  return [location.name, location.state, location.country]
    .filter(Boolean)
    .join(", ");
}

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function convertTemperature(
  value: number,
  unit: TemperatureUnit,
): number {
  return unit === "imperial" ? celsiusToFahrenheit(value) : value;
}

export function formatTemperature(
  value: number,
  unit: TemperatureUnit,
  digits = 0,
): string {
  const converted = convertTemperature(value, unit);
  const symbol = unit === "imperial" ? "°F" : "°C";
  return `${converted.toFixed(digits)}${symbol}`;
}

export function convertWindSpeed(
  metersPerSecond: number,
  unit: TemperatureUnit,
): number {
  return unit === "imperial" ? metersPerSecond * 2.23694 : metersPerSecond;
}

export function formatWindSpeed(
  metersPerSecond: number,
  unit: TemperatureUnit,
): string {
  const value = convertWindSpeed(metersPerSecond, unit);
  const label = unit === "imperial" ? "mph" : "м/с";
  return `${value.toFixed(1)} ${label}`;
}

/** OpenWeather gives city timezone as UTC offset in seconds. */
function cityLocalDate(unixSeconds: number, timezoneOffsetSeconds: number): Date {
  return new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
}

function dayKey(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function dayLabel(date: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(date);
}

function formatCityTime(date: Date): string {
  const h = String(date.getUTCHours()).padStart(2, "0");
  const m = String(date.getUTCMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

export function groupForecastByDay(
  items: ForecastItem[],
  days = 5,
  timezoneOffsetSeconds = 0,
): DailyForecast[] {
  const groups = new Map<
    string,
    {
      date: string;
      dayLabel: string;
      temps: number[];
      icons: string[];
      descriptions: string[];
    }
  >();

  for (const item of items) {
    const date = cityLocalDate(item.dt, timezoneOffsetSeconds);
    const key = dayKey(date);

    if (!groups.has(key)) {
      groups.set(key, {
        date: key,
        dayLabel: dayLabel(date),
        temps: [],
        icons: [],
        descriptions: [],
      });
    }

    const group = groups.get(key)!;
    group.temps.push(item.main.temp_min, item.main.temp_max);
    group.icons.push(item.weather[0]?.icon ?? "01d");
    group.descriptions.push(item.weather[0]?.description ?? "");
  }

  return Array.from(groups.values())
    .slice(0, days)
    .map((group) => {
      const mid = Math.min(
        Math.floor(group.icons.length / 2),
        group.icons.length - 1,
      );

      return {
        date: group.date,
        dayLabel: group.dayLabel,
        tempMin: Math.min(...group.temps),
        tempMax: Math.max(...group.temps),
        description: group.descriptions[mid] || group.descriptions[0],
        icon: group.icons[mid] || group.icons[0],
      };
    });
}

export function getHourlyForecast(
  items: ForecastItem[],
  hours = 8,
  timezoneOffsetSeconds = 0,
): Array<{
  time: string;
  temp: number;
  description: string;
  icon: string;
}> {
  return items.slice(0, hours).map((item) => {
    const date = cityLocalDate(item.dt, timezoneOffsetSeconds);
    return {
      time: formatCityTime(date),
      temp: item.main.temp,
      description: item.weather[0]?.description ?? "",
      icon: item.weather[0]?.icon ?? "01d",
    };
  });
}

export function toHistoryItem(location: GeoLocation) {
  return {
    name: location.name,
    country: location.country,
    state: location.state,
    lat: location.lat,
    lon: location.lon,
  };
}

export function cityKey(location: {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}): string {
  return [
    location.name,
    location.state ?? "",
    location.country,
    location.lat,
    location.lon,
  ].join("|");
}

export function uniqueCities(locations: GeoLocation[]): GeoLocation[] {
  const seen = new Set<string>();
  const result: GeoLocation[] = [];

  for (const location of locations) {
    const key = cityKey(location);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(location);
  }

  return result;
}
