import type {
  CurrentWeatherResponse,
  ForecastResponse,
  GeoLocation,
} from "./types";

const API = "https://api.openweathermap.org";

function apiKey(): string {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) throw new Error("Нет OPENWEATHER_API_KEY");
  return key;
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 300 } });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Ошибка API: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export async function searchLocations(
  query: string,
  limit = 5,
): Promise<GeoLocation[]> {
  const key = apiKey();
  return getJson(
    `${API}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${key}`,
  );
}

export async function reverseGeocode(
  lat: number,
  lon: number,
): Promise<GeoLocation | null> {
  const key = apiKey();
  const results = await getJson<GeoLocation[]>(
    `${API}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${key}`,
  );
  return results[0] ?? null;
}

export async function getCurrentWeather(
  lat: number,
  lon: number,
): Promise<CurrentWeatherResponse> {
  const key = apiKey();
  return getJson(
    `${API}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${key}`,
  );
}

export async function getForecast(
  lat: number,
  lon: number,
): Promise<ForecastResponse> {
  const key = apiKey();
  return getJson(
    `${API}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${key}`,
  );
}
