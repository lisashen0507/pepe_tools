import { CREAM, INK, MINT, PINK, YELLOW } from "./theme";

// 小工具的插畫圖示
export default function ToolIcon({ icon, className }: { icon: string; className?: string }) {
  if (icon === "wheel") {
    return (
      <svg viewBox="0 0 64 64" className={className} aria-hidden>
        <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
          <circle cx={32} cy={34} r={27} fill={PINK} />
          <path d="M32 34 L32 12 A22 22 0 0 1 51 23 Z" fill={YELLOW} />
          <path d="M32 34 L51 23 A22 22 0 0 1 51 45 Z" fill={CREAM} />
          <path d="M32 34 L51 45 A22 22 0 0 1 32 56 Z" fill={YELLOW} />
          <path d="M32 34 L32 56 A22 22 0 0 1 13 45 Z" fill={CREAM} />
          <path d="M32 34 L13 45 A22 22 0 0 1 13 23 Z" fill={YELLOW} />
          <path d="M32 34 L13 23 A22 22 0 0 1 32 12 Z" fill={CREAM} />
          <circle cx={32} cy={34} r={6} fill={PINK} />
          <path d="M32 14 L26 4 L38 4 Z" fill={PINK} />
        </g>
      </svg>
    );
  }
  if (icon === "tomato") {
    return (
      <svg viewBox="0 0 64 64" className={className} aria-hidden>
        <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
          <circle cx={32} cy={36} r={24} fill="#ef6b5b" />
          <path d="M32 14 L23 7 L28 16 L16 18 L29 20 L32 28 L35 20 L48 18 L36 16 L41 7 Z" fill={MINT} />
          <path d="M32 14 L33 6" fill="none" />
        </g>
        <ellipse cx={22} cy={30} rx={4} ry={7} fill="white" opacity={0.5} transform="rotate(30 22 30)" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
        <path d="M32 6 L39 24 L58 25 L43 37 L48 56 L32 45 L16 56 L21 37 L6 25 L25 24 Z" fill={CREAM} />
      </g>
    </svg>
  );
}
