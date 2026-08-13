import { NextRequest, NextResponse } from "next/server";
import { reverseGeocode, searchLocations } from "@/lib/openweather";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q")?.trim();
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  try {
    if (lat && lon) {
      const location = await reverseGeocode(Number(lat), Number(lon));
      if (!location) {
        return NextResponse.json(
          { error: "Не удалось определить местоположение" },
          { status: 404 },
        );
      }
      return NextResponse.json({ locations: [location] });
    }

    if (!query) {
      return NextResponse.json(
        { error: "Пустой поисковый запрос" },
        { status: 400 },
      );
    }

    const locations = await searchLocations(query);
    return NextResponse.json({ locations });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Ошибка геокодинга";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
