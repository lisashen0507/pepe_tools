"use client";

import { useMemo, useState } from "react";
import { CREAM, INK, LIGHT_PINK, PINK, PINK_DARK, YELLOW } from "../_components/theme";

const SPIN_DURATION_MS = 5000;
const VIEW_W = 400;
const VIEW_H = 450;
const CX = 200;
const CY = 215;
const RIM_OUTER = 182;
const RADIUS = 158; // 扇形區半徑
const HUB_RADIUS = 38;
const LIGHT_COUNT = 36;
const PIN_Y = CY - RIM_OUTER - 8; // 指針圓頭中心

// 角度以「從正上方順時針」計算，對應指針在正上方
function pointAt(angleDeg: number, r: number) {
  const rad = (angleDeg * Math.PI) / 180;
  // 四捨五入，避免伺服器與瀏覽器的浮點誤差造成 hydration 不一致
  const round = (n: number) => Math.round(n * 100) / 100;
  return { x: round(CX + r * Math.sin(rad)), y: round(CY - r * Math.cos(rad)) };
}

function slicePath(start: number, end: number) {
  const a = pointAt(start, RADIUS);
  const b = pointAt(end, RADIUS);
  const largeArc = end - start > 180 ? 1 : 0;
  return `M ${CX} ${CY} L ${a.x} ${a.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${b.x} ${b.y} Z`;
}

// 黃、米白交錯；奇數格時最後一格改用淺粉，避免和第一格同色相鄰
function sliceColor(i: number, total: number) {
  if (total % 2 === 1 && i === total - 1 && total > 1) return LIGHT_PINK;
  return i % 2 === 0 ? YELLOW : CREAM;
}

function randomInt(max: number) {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

function parseNames(text: string) {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function LotteryWheel() {
  const [input, setInput] = useState("小明\n小華\n小美\n阿強\n大雄\n靜香");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [removeWinner, setRemoveWinner] = useState(false);

  const names = useMemo(() => parseNames(input), [input]);
  const segment = names.length > 0 ? 360 / names.length : 360;

  function spin() {
    if (spinning || names.length < 2) return;

    const index = randomInt(names.length);
    // 在該區塊內隨機偏移，避免每次都停在正中間
    const jitter = (Math.random() - 0.5) * segment * 0.7;
    const targetAngle = index * segment + segment / 2 + jitter;
    const desired = (360 - targetAngle) % 360;
    const current = ((rotation % 360) + 360) % 360;
    const delta = (desired - current + 360) % 360;

    setWinner(null);
    setPendingIndex(index);
    setSpinning(true);
    setRotation(rotation + 360 * 6 + delta);
  }

  function handleSpinEnd() {
    if (!spinning || pendingIndex === null) return;
    const name = names[pendingIndex];
    setSpinning(false);
    setPendingIndex(null);
    setWinner(name);
    setHistory((h) => [name, ...h]);
    if (removeWinner) {
      const rest = [...names];
      rest.splice(pendingIndex, 1);
      setInput(rest.join("\n"));
    }
  }

  // 名字沿半徑由外往內直排，字的頂端朝外
  function renderLabel(name: string, i: number) {
    const chars = Array.from(name).slice(0, 8);
    const mid = i * segment + segment / 2;
    const rStart = RADIUS - 14;
    const rEnd = HUB_RADIUS + 12;
    const span = rStart - rEnd;
    const arcWidth = (2 * Math.PI * ((rStart + rEnd) / 2) * segment) / 360;
    const fs = Math.max(9, Math.min(28, span / chars.length, arcWidth * 0.75));

    return (
      <g key={`t-${i}`} transform={`rotate(${mid} ${CX} ${CY})`}>
        {chars.map((ch, j) => (
          <text
            key={j}
            x={CX}
            y={CY - (rStart - fs / 2 - j * fs)}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={fs}
            fontWeight={900}
            fill={INK}
          >
            {ch}
          </text>
        ))}
      </g>
    );
  }

  const lights = Array.from({ length: LIGHT_COUNT }, (_, i) => {
    const p = pointAt((360 / LIGHT_COUNT) * i, (RIM_OUTER + RADIUS) / 2);
    return (
      <circle
        key={i}
        cx={p.x}
        cy={p.y}
        r={3.6}
        fill="white"
        stroke={INK}
        strokeWidth={1}
        className={spinning && i % 2 === 0 ? "animate-pulse" : undefined}
      />
    );
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <section className="flex flex-col items-center gap-6">
        <div className="relative w-full max-w-[420px]">
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="h-auto w-full"
            role="img"
            aria-label="抽獎轉盤"
          >
            {/* 底座 */}
            <rect x={CX - 18} y={CY + RIM_OUTER - 10} width={36} height={30} fill={PINK} stroke={INK} strokeWidth={3} />
            <path
              d={`M ${CX - 95} ${VIEW_H - 8} L ${CX - 70} ${CY + RIM_OUTER + 16} L ${CX + 70} ${CY + RIM_OUTER + 16} L ${CX + 95} ${VIEW_H - 8} Z`}
              fill={PINK}
              stroke={INK}
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <rect x={CX - 105} y={VIEW_H - 14} width={210} height={10} rx={3} fill={PINK_DARK} stroke={INK} strokeWidth={3} />

            {/* 外框燈圈 */}
            <circle cx={CX} cy={CY} r={RIM_OUTER} fill={PINK} stroke={INK} strokeWidth={4} />
            {lights}

            {/* 可旋轉的扇形區 */}
            <g
              style={{
                transform: `rotate(${rotation}deg)`,
                transformOrigin: `${CX}px ${CY}px`,
                transition: spinning
                  ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`
                  : "none",
              }}
              onTransitionEnd={handleSpinEnd}
            >
              {names.length <= 1 && (
                <circle cx={CX} cy={CY} r={RADIUS} fill={names.length ? YELLOW : CREAM} />
              )}
              {names.length > 1 &&
                names.map((_, i) => (
                  <path
                    key={i}
                    d={slicePath(i * segment, (i + 1) * segment)}
                    fill={sliceColor(i, names.length)}
                    stroke={INK}
                    strokeWidth={3}
                    strokeLinejoin="round"
                  />
                ))}
              {names.map(renderLabel)}
            </g>
            <circle cx={CX} cy={CY} r={RADIUS} fill="none" stroke={INK} strokeWidth={4} />

            {/* 指針（定位針造型） */}
            <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
              <path
                d={`M ${CX} ${CY - RADIUS + 20} C ${CX - 8} ${PIN_Y + 26}, ${CX - 22} ${PIN_Y + 14}, ${CX - 22} ${PIN_Y} A 22 22 0 1 1 ${CX + 22} ${PIN_Y} C ${CX + 22} ${PIN_Y + 14}, ${CX + 8} ${PIN_Y + 26}, ${CX} ${CY - RADIUS + 20} Z`}
                fill={PINK}
              />
              <circle cx={CX} cy={PIN_Y} r={10} fill="white" strokeWidth={2.5} />
              <circle cx={CX} cy={PIN_Y} r={4} fill={PINK} strokeWidth={0} />
            </g>
          </svg>

          {/* 中心「開始」按鈕 */}
          <button
            type="button"
            onClick={spin}
            disabled={spinning || names.length < 2}
            aria-label="開始抽獎"
            className="absolute aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] text-xl font-black tracking-wider text-white shadow-[inset_0_0_0_4px_white] transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100 sm:text-2xl"
            style={{
              left: `${(CX / VIEW_W) * 100}%`,
              top: `${(CY / VIEW_H) * 100}%`,
              width: `${((HUB_RADIUS * 2) / VIEW_W) * 100}%`,
              backgroundColor: PINK,
              borderColor: INK,
              textShadow: `-1.5px -1.5px 0 ${INK}, 1.5px -1.5px 0 ${INK}, -1.5px 1.5px 0 ${INK}, 1.5px 1.5px 0 ${INK}`,
            }}
          >
            {spinning ? "…" : "開始"}
          </button>
        </div>

        <div className="flex min-h-16 items-center justify-center text-center" aria-live="polite">
          {winner && (
            <p className="rounded-full border-[3px] border-[#3b2a2f] bg-[#f8f4e3] px-6 py-2 text-2xl font-black shadow-[0_5px_0_#3b2a2f]">
              🎉 恭喜 <span className="text-[#d46d96]">{winner}</span>！
            </p>
          )}
          {!winner && names.length < 2 && (
            <p className="font-bold">請至少輸入 2 個名字</p>
          )}
          {!winner && names.length >= 2 && !spinning && (
            <p className="font-bold">按下轉盤中間的「開始」抽獎</p>
          )}
        </div>
      </section>

      <aside className="flex flex-col gap-5 self-start rounded-2xl border-[3px] border-[#3b2a2f] bg-[#f8f4e3] p-5 shadow-[6px_6px_0_#3b2a2f]">
        <div>
          <label htmlFor="names" className="mb-2 flex items-center justify-between font-bold">
            <span>抽獎名單（一行一個）</span>
            <span className="rounded-full border-2 border-[#3b2a2f] bg-[#e9cf55] px-2.5 text-sm">
              共 {names.length} 人
            </span>
          </label>
          <textarea
            id="names"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={spinning}
            rows={10}
            className="w-full resize-y rounded-lg border-[3px] border-[#3b2a2f] bg-white p-3 text-[#3b2a2f] outline-none focus:ring-4 focus:ring-[#e886ad]/50 disabled:opacity-60"
          />
          <label className="mt-2 flex items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              checked={removeWinner}
              onChange={(e) => setRemoveWinner(e.target.checked)}
              disabled={spinning}
              className="size-4 accent-[#e886ad]"
            />
            抽中後從名單移除
          </label>
        </div>

        <div className="border-t-[3px] border-dashed border-[#3b2a2f]/40 pt-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-bold">抽獎紀錄</h2>
            {history.length > 0 && (
              <button
                type="button"
                onClick={() => setHistory([])}
                className="rounded-full border-2 border-[#3b2a2f] bg-white px-3 text-xs font-bold hover:bg-[#f6c9da]"
              >
                清除
              </button>
            )}
          </div>
          {history.length === 0 ? (
            <p className="text-sm opacity-70">尚無紀錄</p>
          ) : (
            <ol className="space-y-1.5 text-sm">
              {history.map((name, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="rounded-full bg-[#e886ad] px-2 text-xs font-bold text-white">
                    第 {history.length - i} 次
                  </span>
                  <span className="font-bold">{name}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </aside>
    </div>
  );
}
