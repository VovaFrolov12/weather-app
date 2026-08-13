# Weather App

Тестовое задание: погода по городу и геолокации.

Репозиторий: https://github.com/VovaFrolov12/weather-app

## Стек

Next.js, TypeScript, Tailwind CSS, OpenWeather API  
(Current Weather, 5 Day / 3 Hour Forecast, Geocoding).

## Запуск

1. Ключ API: https://openweathermap.org/api
2. `npm install`
3. Скопировать `.env.example` в `.env.local` и вписать ключ:

```
OPENWEATHER_API_KEY=...
```

4. `npm run dev` → http://localhost:3000

## Скрипты

- `npm run dev` — разработка
- `npm run build` / `npm start` — прод
- `npm test` — тесты
- `npm run lint` — линтер