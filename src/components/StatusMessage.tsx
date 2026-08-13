"use client";

import type { AppStatus } from "@/lib/types";

interface StatusMessageProps {
  status: AppStatus;
  message?: string | null;
}

const texts: Partial<Record<AppStatus, string>> = {
  idle: "Введите город или нажмите кнопку геолокации.",
  loading: "Загрузка...",
  not_found: "Ничего не найдено.",
  geo_denied: "Нет доступа к геолокации.",
  geo_unsupported: "Геолокация в браузере недоступна.",
  error: "Ошибка загрузки.",
};

export function StatusMessage({ status, message }: StatusMessageProps) {
  if (status === "ready") return null;

  const text =
    status === "error" && message ? message : texts[status] || message;

  if (!text) return null;

  const isError = ["error", "not_found", "geo_denied", "geo_unsupported"].includes(
    status,
  );

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`fade-in rounded-2xl px-4 py-3 text-sm ${
        isError
          ? "border border-rose-300 bg-rose-50 text-rose-900"
          : "border border-sky-900/10 bg-white/70 text-ink/80"
      }`}
    >
      {status === "loading" ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
          {text}
        </span>
      ) : (
        text
      )}
    </div>
  );
}
