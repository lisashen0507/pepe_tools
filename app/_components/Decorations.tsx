import { CREAM, GRASS, INK, LAVENDER, LIGHT_PINK, MINT, PINK, YELLOW } from "./theme";

// 彩帶碎片：固定位置（不用亂數，避免伺服器與瀏覽器渲染不一致）
const CONFETTI = [
  { x: 8, y: 22, r: 20, c: YELLOW },
  { x: 18, y: 48, r: -35, c: MINT },
  { x: 4, y: 66, r: 60, c: PINK },
  { x: 27, y: 12, r: -15, c: PINK },
  { x: 33, y: 70, r: 40, c: YELLOW },
  { x: 62, y: 9, r: 25, c: MINT },
  { x: 71, y: 30, r: -50, c: YELLOW },
  { x: 88, y: 18, r: 15, c: PINK },
  { x: 93, y: 44, r: -25, c: YELLOW },
  { x: 80, y: 62, r: 55, c: MINT },
  { x: 96, y: 74, r: -10, c: PINK },
  { x: 52, y: 80, r: 30, c: YELLOW },
];

function Cloud({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 200 100" className={className} aria-hidden>
      <path
        d="M30 85 C5 85 5 55 30 55 C30 30 65 25 75 42 C85 15 135 15 140 45 C170 38 190 60 175 85 Z"
        fill={CREAM}
        stroke={INK}
        strokeWidth={3}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Balloon({ color, className }: { color: string; className: string }) {
  return (
    <svg viewBox="0 0 60 130" className={className} aria-hidden>
      <path d="M30 72 C24 90 36 100 28 128" fill="none" stroke={INK} strokeWidth={2} />
      <ellipse cx={30} cy={36} rx={26} ry={32} fill={color} stroke={INK} strokeWidth={3} />
      <path d="M26 68 L34 68 L30 75 Z" fill={color} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <ellipse cx={20} cy={24} rx={5} ry={9} fill="white" opacity={0.6} transform="rotate(25 20 24)" />
    </svg>
  );
}

function Gift({ box, ribbon, className }: { box: string; ribbon: string; className: string }) {
  return (
    <svg viewBox="0 0 120 110" className={className} aria-hidden>
      <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
        <path d="M60 30 C40 5 20 15 35 30 Z" fill={ribbon} />
        <path d="M60 30 C80 5 100 15 85 30 Z" fill={ribbon} />
        <rect x={10} y={46} width={100} height={60} fill={box} />
        <rect x={4} y={30} width={112} height={18} fill={box} />
        <rect x={52} y={30} width={16} height={76} fill={ribbon} />
      </g>
    </svg>
  );
}

export default function Decorations() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <Cloud className="absolute -left-10 top-6 w-48 sm:w-64" />
      <Cloud className="absolute -right-12 top-2 w-52 sm:w-72" />
      <Cloud className="absolute right-[18%] top-[38%] hidden w-40 opacity-90 lg:block" />

      {CONFETTI.map((p, i) => (
        <span
          key={i}
          className="absolute h-3 w-6 rounded-[3px] border-2"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            transform: `rotate(${p.r}deg)`,
            backgroundColor: p.c,
            borderColor: INK,
          }}
        />
      ))}

      <Balloon color={PINK} className="absolute left-[2%] top-[30%] hidden w-14 md:block" />
      <Balloon color={MINT} className="absolute left-[7%] top-[38%] hidden w-12 md:block" />
      <Balloon color={PINK} className="absolute right-[3%] top-[26%] hidden w-14 md:block" />
      <Balloon color={YELLOW} className="absolute right-[8%] top-[34%] hidden w-12 md:block" />

      {/* 草地 */}
      <svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-28 w-full sm:h-36"
      >
        <path
          d="M0 60 C240 10 480 90 720 50 C960 10 1200 80 1440 40 L1440 160 L0 160 Z"
          fill={GRASS}
          stroke={INK}
          strokeWidth={3}
        />
      </svg>

      <Gift box={LAVENDER} ribbon={PINK} className="absolute bottom-4 left-[2%] w-24 sm:w-32" />
      <Gift box={YELLOW} ribbon={MINT} className="absolute bottom-2 left-[12%] hidden w-20 sm:block" />
      <Gift box={LIGHT_PINK} ribbon={YELLOW} className="absolute bottom-3 right-[3%] w-24 sm:w-32" />
      <Gift box={MINT} ribbon={LAVENDER} className="absolute bottom-2 right-[14%] hidden w-20 sm:block" />
    </div>
  );
}
