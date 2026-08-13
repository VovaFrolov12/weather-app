"use client";

interface LocationButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function LocationButton({ onClick, disabled }: LocationButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-sky-900/15 bg-white/60 px-4 py-3 text-sm font-medium text-ink transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span aria-hidden className="text-accent">
        ◎
      </span>
      Использовать моё местоположение
    </button>
  );
}
