import { describe, expect, it } from "vitest";
import {
  celsiusToFahrenheit,
  convertTemperature,
  formatCity,
  formatTemperature,
  formatWindSpeed,
  getHourlyForecast,
  groupForecastByDay,
  uniqueCities,
} from "@/lib/utils";
import type { ForecastItem, GeoLocation } from "@/lib/types";

function makeItem(
  dt: number,
  tempMin: number,
  tempMax: number,
  icon = "01d",
  description = "ясно",
): ForecastItem {
  return {
    dt,
    dt_txt: new Date(dt * 1000).toISOString(),
    main: {
      temp: (tempMin + tempMax) / 2,
      feels_like: tempMin,
      temp_min: tempMin,
      temp_max: tempMax,
      humidity: 50,
    },
    weather: [{ id: 800, main: "Clear", description, icon }],
    wind: { speed: 3 },
  };
}

describe("temp", () => {
  it("c to f", () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
    expect(celsiusToFahrenheit(100)).toBe(212);
  });

  it("format", () => {
    expect(formatTemperature(20, "metric")).toBe("20°C");
    expect(formatTemperature(20, "imperial")).toBe("68°F");
    expect(convertTemperature(10, "imperial")).toBe(50);
  });

  it("wind", () => {
    expect(formatWindSpeed(1, "metric")).toBe("1.0 м/с");
    expect(formatWindSpeed(1, "imperial")).toBe("2.2 mph");
  });
});

describe("city label", () => {
  it("joins parts", () => {
    expect(
      formatCity({
        name: "Moscow",
        state: "Moscow Oblast",
        country: "RU",
      }),
    ).toBe("Moscow, Moscow Oblast, RU");
  });
});

describe("uniqueCities", () => {
  it("drops duplicates", () => {
    const paris: GeoLocation = {
      name: "Paris",
      country: "FR",
      lat: 48.8588897,
      lon: 2.320041,
    };

    expect(uniqueCities([paris, { ...paris }, paris])).toHaveLength(1);
  });
});

describe("forecast", () => {
  it("groups by day", () => {
    const day1 = Math.floor(Date.UTC(2026, 7, 10, 9) / 1000);
    const day2 = Math.floor(Date.UTC(2026, 7, 11, 9) / 1000);
    const day3 = Math.floor(Date.UTC(2026, 7, 12, 9) / 1000);
    const day4 = Math.floor(Date.UTC(2026, 7, 13, 9) / 1000);

    const items = [
      makeItem(day1, 10, 18),
      makeItem(day1 + 3 * 3600, 12, 20),
      makeItem(day2, 8, 15),
      makeItem(day3, 5, 11),
      makeItem(day4, 3, 9),
    ];

    const days = groupForecastByDay(items, 5);
    expect(days.length).toBeGreaterThanOrEqual(3);
    expect(days[0].tempMin).toBe(10);
    expect(days[0].tempMax).toBe(20);
  });

  it("hourly slice", () => {
    const base = Math.floor(Date.UTC(2026, 7, 10, 12) / 1000);
    const items = Array.from({ length: 10 }, (_, i) =>
      makeItem(base + i * 3 * 3600, 10 + i, 12 + i),
    );

    const hourly = getHourlyForecast(items, 8, 0);
    expect(hourly).toHaveLength(8);
    expect(hourly[0].temp).toBe(11);
    expect(hourly[0].time).toBe("12:00");
  });

  it("formats hourly time in city timezone", () => {
    const utcNoon = Math.floor(Date.UTC(2026, 7, 10, 12) / 1000);
    const nyOffset = -4 * 3600;
    const hourly = getHourlyForecast([makeItem(utcNoon, 20, 22)], 1, nyOffset);

    expect(hourly[0].time).toBe("08:00");
  });
});
