import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useWeather } from "@/hooks/useWeather";
import type { GeoLocation } from "@/lib/types";
import {
  jsonResponse,
  moscow,
  parisFr,
  parisTx,
  weatherPayload,
} from "./helpers";

function mockApi(locations: GeoLocation[]) {
  vi.mocked(fetch).mockImplementation((input: RequestInfo | URL) => {
    const url = String(input);

    if (url.includes("/api/geocode")) {
      return jsonResponse({ locations });
    }

    if (url.includes("/api/weather")) {
      const location =
        locations.find((item) => url.includes(String(item.lat))) ??
        locations[0] ??
        moscow;
      return jsonResponse(weatherPayload(location));
    }

    return jsonResponse({ error: "unknown" }, false, 404);
  });
}

describe("useWeather", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("loads weather for a single search result", async () => {
    mockApi([moscow]);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.searchCity("Moscow");
    });

    await waitFor(() => {
      expect(result.current.status).toBe("ready");
    });

    expect(result.current.weather?.location.name).toBe("Moscow");
    expect(result.current.history[0]?.name).toBe("Moscow");
    expect(result.current.weather?.current.main.temp).toBe(20);
  });

  it("shows suggestions when several cities match", async () => {
    mockApi([parisFr, parisTx]);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.searchCity("Paris");
    });

    await waitFor(() => {
      expect(result.current.suggestions).toHaveLength(2);
    });

    expect(result.current.status).toBe("idle");
    expect(result.current.weather).toBeNull();
  });

  it("sets not_found when geocode returns nothing", async () => {
    mockApi([]);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.searchCity("asdfgh");
    });

    await waitFor(() => {
      expect(result.current.status).toBe("not_found");
    });
  });

  it("loads weather after choosing a suggestion", async () => {
    mockApi([parisFr, parisTx]);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.searchCity("Paris");
    });

    await act(async () => {
      await result.current.selectLocation({
        name: parisTx.name,
        country: parisTx.country,
        state: parisTx.state,
        lat: parisTx.lat,
        lon: parisTx.lon,
      });
    });

    await waitFor(() => {
      expect(result.current.status).toBe("ready");
    });

    expect(result.current.weather?.location.state).toBe("Texas");
  });

  it("switches temperature unit", async () => {
    const { result } = renderHook(() => useWeather());

    act(() => {
      result.current.changeUnit("imperial");
    });

    expect(result.current.unit).toBe("imperial");
    expect(localStorage.getItem("unit")).toBe("imperial");
  });

  it("handles geolocation permission denied", async () => {
    vi.stubGlobal("navigator", {
      ...navigator,
      geolocation: {
        getCurrentPosition: (
          _ok: PositionCallback,
          err: PositionErrorCallback,
        ) => {
          err({
            code: 1,
            PERMISSION_DENIED: 1,
            POSITION_UNAVAILABLE: 2,
            TIMEOUT: 3,
            message: "denied",
          } as GeolocationPositionError);
        },
      },
    });

    const { result } = renderHook(() => useWeather());

    act(() => {
      result.current.useMyLocation();
    });

    await waitFor(() => {
      expect(result.current.status).toBe("geo_denied");
    });
  });

  it("handles missing geolocation API", async () => {
    vi.stubGlobal("navigator", {
      ...navigator,
      geolocation: undefined,
    });

    const { result } = renderHook(() => useWeather());

    act(() => {
      result.current.useMyLocation();
    });

    expect(result.current.status).toBe("geo_unsupported");
  });
});
