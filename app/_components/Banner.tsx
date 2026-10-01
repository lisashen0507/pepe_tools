import { INK, LAVENDER, PINK, YELLOW } from "./theme";

// 插畫風標題：粉紅緞帶 + 黃色描邊大字 + 淡紫副標
export default function Banner({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="mb-8 flex flex-col items-center">
      <div className="relative w-full max-w-xl">
        <svg viewBox="0 0 600 120" className="absolute inset-x-0 top-1/2 -translate-y-1/2" aria-hidden>
          <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
            <path d="M10 40 L90 30 L80 60 L95 92 L15 100 L30 70 Z" fill={LAVENDER} />
            <path d="M590 40 L510 30 L520 60 L505 92 L585 100 L570 70 Z" fill={LAVENDER} />
            <path d="M70 30 Q300 -10 530 30 L530 90 Q300 50 70 90 Z" fill={PINK} />
          </g>
        </svg>
        <h1
          className="relative py-6 text-center text-5xl font-black tracking-widest sm:text-6xl"
          style={{
            color: YELLOW,
            WebkitTextStroke: `8px ${INK}`,
            paintOrder: "stroke fill",
            textShadow: `0 6px 0 ${INK}`,
          }}
        >
          {title}
        </h1>
      </div>
      <p
        className="-mt-1 rounded-sm border-[3px] px-6 py-1.5 text-lg font-bold sm:text-xl"
        style={{ backgroundColor: LAVENDER, borderColor: INK }}
      >
        {subtitle}
      </p>
    </header>
  );
}
