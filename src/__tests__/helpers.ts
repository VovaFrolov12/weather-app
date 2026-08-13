import type { GeoLocation, WeatherData } from "@/lib/types";

export const moscow: GeoLocation = {
  name: "Moscow",
  country: "RU",
  state: "Moscow",
  lat: 55.75,
  lon: 37.62,
};

export const parisFr: GeoLocation = {
  name: "Paris",
  country: "FR",
  state: "Ile-de-France",
  lat: 48.85,
  lon: 2.35,
};

export const parisTx: GeoLocation = {
  name: "Paris",
  country: "US",
  state: "Texas",
  lat: 33.66,
  lon: -95.55,
};

export function weatherPayload(location: GeoLocation): WeatherData {
  const now = Math.floor(Date.now() / 1000);

  return {
    location,
    current: {
      coord: { lat: location.lat, lon: location.lon },
      weather: [
        { id: 800, main: "Clear", description: "ясно", icon: "01d" },
      ],
      main: {
        temp: 20,
        feels_like: 19,
        temp_min: 18,
        temp_max: 22,
        pressure: 1013,
        humidity: 40,
      },
      wind: { speed: 2, deg: 90 },
      name: location.name,
      sys: { country: location.country },
      dt: now,
      timezone: 0,
    },
    forecast: {
      city: {
        name: location.name,
        country: location.country,
        timezone: 0,
      },
      list: Array.from({ length: 16 }, (_, i) => ({
        dt: now + i * 3 * 3600,
        dt_txt: new Date((now + i * 3 * 3600) * 1000).toISOString(),
        main: {
          temp: 18 + i,
          feels_like: 17,
          temp_min: 16,
          temp_max: 22,
          humidity: 40,
        },
        weather: [
          { id: 800, main: "Clear", description: "ясно", icon: "01d" },
        ],
        wind: { speed: 2 },
      })),
    },
  };
}

export function jsonResponse(data: unknown, ok = true, status = 200) {
  return Promise.resolve({
    ok,
    status,
    json: async () => data,
  } as Response);
}
