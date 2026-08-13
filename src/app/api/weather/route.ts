import { NextRequest, NextResponse } from "next/server";
import {
  getCurrentWeather,
  getForecast,
  reverseGeocode,
} from "@/lib/openweather";
import type { GeoLocation } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));
  const name = searchParams.get("name") ?? undefined;
  const country = searchParams.get("country") ?? undefined;
  const state = searchParams.get("state") ?? undefined;

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return NextResponse.json(
      { error: "Некорректные координаты" },
      { status: 400 },
    );
  }

  try {
    const [current, forecast, reverse] = await Promise.all([
      getCurrentWeather(lat, lon),
      getForecast(lat, lon),
      name && country
        ? Promise.resolve(null)
        : reverseGeocode(lat, lon),
    ]);

    const location: GeoLocation = {
      name: name || reverse?.name || current.name,
      country: country || reverse?.country || current.sys.country,
      state: state || reverse?.state,
      lat,
      lon,
    };

    return NextResponse.json({ location, current, forecast });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Ошибка получения погоды";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
