import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WeatherApp } from "@/components/WeatherApp";
import type { GeoLocation } from "@/lib/types";
import {
  jsonResponse,
  moscow,
  parisFr,
  parisTx,
  weatherPayload,
} from "./helpers";

vi.mock("next/image", () => ({
  default: (props: { alt: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={props.alt} />;
  },
}));

function mockApi(locations: GeoLocation[]) {
  vi.mocked(fetch).mockImplementation((input: RequestInfo | URL) => {
    const url = String(input);

    if (url.includes("/api/geocode")) {
      return jsonResponse({ locations });
    }

    if (url.includes("/api/weather")) {
      const location = locations[0] ?? moscow;
      const byCoords =
        locations.find((item) => url.includes(String(item.lat))) ?? location;
      return jsonResponse(weatherPayload(byCoords));
    }

    return jsonResponse({ error: "unknown" }, false, 404);
  });
}

describe("WeatherApp scenarios", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("searches a city and shows current weather", async () => {
    const user = userEvent.setup();
    mockApi([moscow]);

    render(<WeatherApp />);

    await user.type(screen.getByLabelText("Поиск города"), "Moscow");
    await user.click(screen.getByRole("button", { name: "Найти" }));

    expect(
      await screen.findByRole("heading", { name: "Moscow, Moscow, RU" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("20°C").length).toBeGreaterThan(0);
    expect(screen.getByText("Почасовой прогноз")).toBeInTheDocument();
    expect(screen.getByText("Дневной прогноз")).toBeInTheDocument();
  });

  it("lets user pick a city when there are several matches", async () => {
    const user = userEvent.setup();
    mockApi([parisFr, parisTx]);

    render(<WeatherApp />);

    await user.type(screen.getByLabelText("Поиск города"), "Paris");
    await user.click(screen.getByRole("button", { name: "Найти" }));

    expect(await screen.findByText("Выберите город")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /Paris, Texas, US/i }),
    );

    expect(
      await screen.findByRole("heading", { name: "Paris, Texas, US" }),
    ).toBeInTheDocument();
  });

  it("shows not found message", async () => {
    const user = userEvent.setup();
    mockApi([]);

    render(<WeatherApp />);

    await user.type(screen.getByLabelText("Поиск города"), "zzzzz");
    await user.click(screen.getByRole("button", { name: "Найти" }));

    expect(await screen.findByText("Ничего не найдено.")).toBeInTheDocument();
  });

  it("toggles units from C to F", async () => {
    const user = userEvent.setup();
    mockApi([moscow]);

    render(<WeatherApp />);

    await user.type(screen.getByLabelText("Поиск города"), "Moscow");
    await user.click(screen.getByRole("button", { name: "Найти" }));
    await screen.findByRole("heading", { name: "Moscow, Moscow, RU" });
    expect(screen.getAllByText("20°C").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "°F" }));

    expect(screen.getAllByText("68°F").length).toBeGreaterThan(0);
  });

  it("removes a city from history", async () => {
    const user = userEvent.setup();
    mockApi([moscow]);

    render(<WeatherApp />);

    await user.type(screen.getByLabelText("Поиск города"), "Moscow");
    await user.click(screen.getByRole("button", { name: "Найти" }));
    await screen.findByText("История");

    const history = screen.getByLabelText("История поиска");
    expect(
      within(history).getByRole("button", { name: "Moscow, Moscow, RU" }),
    ).toBeInTheDocument();

    await user.click(
      within(history).getByRole("button", {
        name: "Удалить Moscow, Moscow, RU",
      }),
    );

    await waitFor(() => {
      expect(screen.queryByText("История")).not.toBeInTheDocument();
    });
  });

  it("shows message when geolocation is denied", async () => {
    const user = userEvent.setup();

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

    render(<WeatherApp />);

    await user.click(
      screen.getByRole("button", { name: "Использовать моё местоположение" }),
    );

    expect(
      await screen.findByText("Нет доступа к геолокации."),
    ).toBeInTheDocument();
  });
});
