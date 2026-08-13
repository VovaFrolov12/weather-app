import { beforeEach, describe, expect, it } from "vitest";
import {
  addSearchHistoryItem,
  getLastLocation,
  getSearchHistory,
  getTemperatureUnit,
  removeSearchHistoryItem,
  saveLastLocation,
  saveTemperatureUnit,
} from "@/lib/storage";

describe("local storage helpers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saves and restores last location", () => {
    const location = {
      name: "Berlin",
      country: "DE",
      lat: 52.52,
      lon: 13.4,
    };

    saveLastLocation(location);
    expect(getLastLocation()).toEqual(location);
  });

  it("keeps unique search history with newest first", () => {
    const first = {
      name: "Paris",
      country: "FR",
      lat: 48.85,
      lon: 2.35,
    };
    const second = {
      name: "Lyon",
      country: "FR",
      lat: 45.76,
      lon: 4.84,
    };

    addSearchHistoryItem(first);
    addSearchHistoryItem(second);
    addSearchHistoryItem(first);

    const history = getSearchHistory();
    expect(history).toHaveLength(2);
    expect(history[0].name).toBe("Paris");
    expect(history[1].name).toBe("Lyon");
  });

  it("removes an item from search history", () => {
    const first = {
      name: "Paris",
      country: "FR",
      lat: 48.85,
      lon: 2.35,
    };
    const second = {
      name: "Lyon",
      country: "FR",
      lat: 45.76,
      lon: 4.84,
    };

    addSearchHistoryItem(first);
    addSearchHistoryItem(second);
    const next = removeSearchHistoryItem(first);

    expect(next).toHaveLength(1);
    expect(next[0].name).toBe("Lyon");
    expect(getSearchHistory()).toHaveLength(1);
  });

  it("clears last city when it is removed from history", () => {
    const city = {
      name: "Paris",
      country: "FR",
      lat: 48.85,
      lon: 2.35,
    };

    saveLastLocation(city);
    addSearchHistoryItem(city);
    removeSearchHistoryItem(city);

    expect(getSearchHistory()).toHaveLength(0);
    expect(getLastLocation()).toBeNull();
  });

  it("persists temperature unit preference", () => {
    expect(getTemperatureUnit()).toBe("metric");
    saveTemperatureUnit("imperial");
    expect(getTemperatureUnit()).toBe("imperial");
  });
});
