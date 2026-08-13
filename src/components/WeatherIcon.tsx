interface WeatherIconProps {
  icon: string;
  description: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: {
    wrap: "h-12 w-12",
    img: "h-10 w-10",
    px: 40,
  },
  md: {
    wrap: "h-14 w-14",
    img: "h-12 w-12",
    px: 48,
  },
  lg: {
    wrap: "h-20 w-20 sm:h-24 sm:w-24",
    img: "h-16 w-16 sm:h-20 sm:w-20",
    px: 80,
  },
} as const;

export function WeatherIcon({
  icon,
  description,
  size = "md",
}: WeatherIconProps) {
  const s = sizes[size];

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-sky-200 ring-1 ring-sky-900/10 ${s.wrap}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={description}
        width={s.px}
        height={s.px}
        className={s.img}
      />
    </span>
  );
}
