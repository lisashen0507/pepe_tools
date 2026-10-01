"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { CREAM, INK, LAVENDER, MINT, PINK } from "../_components/theme";

type Mode = "focus" | "short" | "long";

type Settings = {
  focus: number; // 分鐘
  short: number;
  long: number;
  longEvery: number; // 每幾個番茄後長休息
  autoStart: boolean;
  sound: boolean;
};

const MODES: Record<Mode, { label: string; color: string; hint: string }> = {
  focus: { label: "專注", color: PINK, hint: "專心做一件事，先別看手機！" },
  short: { label: "短休息", color: MINT, hint: "起來走走、喝口水吧" },
  long: { label: "長休息", color: LAVENDER, hint: "辛苦了！好好放鬆一下" },
};

const RING_R = 120;
const RING_C = 2 * Math.PI * RING_R;

function formatTime(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function playChime() {
  try {
    const ctx = new AudioContext();
    [0, 0.35, 0.7].forEach((offset, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = i === 2 ? 1046.5 : 784;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + offset + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + offset);
      osc.stop(ctx.currentTime + offset + 0.32);
    });
    setTimeout(() => ctx.close(), 1500);
  } catch {
    // 瀏覽器不支援音效就略過
  }
}

function notify(body: string) {
  if (typeof Notification !== "undefined" && Notification.permission === "granted") {
    new Notification("番茄專注鐘", { body });
  }
}

export default function PomodoroTimer() {
  const [settings, setSettings] = useState<Settings>({
    focus: 25,
    short: 5,
    long: 15,
    longEvery: 4,
    autoStart: false,
    sound: true,
  });
  const [mode, setMode] = useState<Mode>("focus");
  const [remaining, setRemaining] = useState(25 * 60 * 1000);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [task, setTask] = useState("");
  const endAtRef = useRef(0);

  const duration = settings[mode] * 60 * 1000;
  const progress = duration > 0 ? 1 - remaining / duration : 0;
  const cyclePos = completed % settings.longEvery;

  function switchMode(next: Mode, autoStart: boolean, s: Settings = settings) {
    const ms = s[next] * 60 * 1000;
    setMode(next);
    setRemaining(ms);
    if (autoStart) {
      endAtRef.current = Date.now() + ms;
      setRunning(true);
    } else {
      setRunning(false);
    }
  }

  function nextModeAfter(current: Mode, doneCount: number): Mode {
    if (current !== "focus") return "focus";
    return doneCount > 0 && doneCount % settings.longEvery === 0 ? "long" : "short";
  }

  const onFinish = useEffectEvent(() => {
    if (settings.sound) playChime();
    let doneCount = completed;
    if (mode === "focus") {
      doneCount = completed + 1;
      setCompleted(doneCount);
      notify("專注時間結束，休息一下吧！");
    } else {
      notify("休息結束，準備開始下一個番茄！");
    }
    switchMode(nextModeAfter(mode, doneCount), settings.autoStart);
  });

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const left = endAtRef.current - Date.now();
      if (left <= 0) {
        clearInterval(id);
        setRemaining(0);
        onFinish();
      } else {
        setRemaining(left);
      }
    }, 250);
    return () => clearInterval(id);
  }, [running]);

  // 分頁標題顯示倒數，切到別的分頁也看得到
  useEffect(() => {
    const original = document.title;
    if (running || remaining < duration) {
      document.title = `${formatTime(remaining)} ${MODES[mode].label} | 番茄專注鐘`;
    }
    return () => {
      document.title = original;
    };
  }, [running, remaining, duration, mode]);

  function start() {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }
    endAtRef.current = Date.now() + remaining;
    setRunning(true);
  }

  function pause() {
    setRemaining(Math.max(0, endAtRef.current - Date.now()));
    setRunning(false);
  }

  function reset() {
    setRunning(false);
    setRemaining(duration);
  }

  function skip() {
    switchMode(nextModeAfter(mode, completed), false);
  }

  function updateSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
    const next = { ...settings, [key]: value };
    setSettings(next);
    // 沒在計時時，時間設定立刻套用到目前的模式
    if (!running && key === mode) {
      setRemaining((value as number) * 60 * 1000);
    }
  }

  const color = MODES[mode].color;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <section className="flex flex-col items-center gap-6">
        {/* 模式切換 */}
        <div className="flex gap-2" role="tablist" aria-label="計時模式">
          {(Object.keys(MODES) as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => switchMode(m, false)}
              className="rounded-full border-[3px] border-[#3b2a2f] px-4 py-1.5 font-bold transition-transform hover:-translate-y-0.5"
              style={{
                backgroundColor: mode === m ? MODES[m].color : CREAM,
                boxShadow: mode === m ? `0 4px 0 ${INK}` : "none",
              }}
            >
              {MODES[m].label}
            </button>
          ))}
        </div>

        {/* 計時圓環 */}
        <div className="relative w-full max-w-[340px]">
          <svg viewBox="0 0 300 300" className="h-auto w-full" role="img" aria-label="剩餘時間">
            <circle cx={150} cy={150} r={146} fill={CREAM} stroke={INK} strokeWidth={4} />
            <circle cx={150} cy={150} r={RING_R} fill="none" stroke={INK} strokeOpacity={0.12} strokeWidth={22} />
            <circle
              cx={150}
              cy={150}
              r={RING_R}
              fill="none"
              stroke={color}
              strokeWidth={22}
              strokeLinecap="round"
              strokeDasharray={RING_C}
              strokeDashoffset={RING_C * (1 - progress)}
              transform="rotate(-90 150 150)"
              style={{ transition: "stroke-dashoffset 0.25s linear, stroke 0.3s" }}
            />
            <circle cx={150} cy={150} r={RING_R - 13} fill="none" stroke={INK} strokeWidth={3} />
            <circle cx={150} cy={150} r={RING_R + 13} fill="none" stroke={INK} strokeWidth={3} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center" aria-live="polite">
            <span className="text-lg font-bold">{MODES[mode].label}中</span>
            <span className="text-6xl font-black tabular-nums tracking-tight sm:text-7xl">
              {formatTime(remaining)}
            </span>
            <span className="mt-1 max-w-[60%] text-center text-sm font-bold opacity-70">
              {MODES[mode].hint}
            </span>
          </div>
        </div>

        {task.trim() && mode === "focus" && (
          <p className="max-w-full truncate rounded-full border-[3px] border-[#3b2a2f] bg-[#f8f4e3] px-5 py-1.5 font-bold">
            🎯 {task.trim()}
          </p>
        )}

        {/* 控制按鈕 */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="h-12 rounded-full border-[3px] border-[#3b2a2f] bg-[#f8f4e3] px-5 font-bold hover:bg-white"
          >
            重設
          </button>
          <button
            type="button"
            onClick={running ? pause : start}
            className="h-14 min-w-36 rounded-full border-[3px] border-[#3b2a2f] px-8 text-2xl font-black text-white shadow-[0_5px_0_#3b2a2f] transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
            style={{
              backgroundColor: color,
              textShadow: `-1.5px -1.5px 0 ${INK}, 1.5px -1.5px 0 ${INK}, -1.5px 1.5px 0 ${INK}, 1.5px 1.5px 0 ${INK}`,
            }}
          >
            {running ? "暫停" : remaining < duration ? "繼續" : "開始"}
          </button>
          <button
            type="button"
            onClick={skip}
            className="h-12 rounded-full border-[3px] border-[#3b2a2f] bg-[#f8f4e3] px-5 font-bold hover:bg-white"
          >
            跳過
          </button>
        </div>

        {/* 本輪進度 */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2" aria-label={`本輪已完成 ${cyclePos} / ${settings.longEvery} 個番茄`}>
            {Array.from({ length: settings.longEvery }, (_, i) => (
              <svg key={i} viewBox="0 0 40 40" className="size-9" aria-hidden>
                <g stroke={INK} strokeWidth={2.5} strokeLinejoin="round">
                  <circle cx={20} cy={23} r={14} fill={i < cyclePos ? "#ef6b5b" : CREAM} />
                  <path d="M20 10 L14 6 L18 12 L11 13 L19 14 L20 19 L21 14 L29 13 L22 12 L26 6 Z" fill={MINT} />
                </g>
              </svg>
            ))}
          </div>
          <p className="font-bold">已完成 {completed} 個番茄</p>
        </div>
      </section>

      <aside className="flex flex-col gap-5 self-start rounded-2xl border-[3px] border-[#3b2a2f] bg-[#f8f4e3] p-5 shadow-[6px_6px_0_#3b2a2f]">
        <div>
          <label htmlFor="task" className="mb-2 block font-bold">
            這個番茄要專心做什麼？
          </label>
          <input
            id="task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="例如：寫完報告第一段"
            className="w-full rounded-lg border-[3px] border-[#3b2a2f] bg-white px-3 py-2 outline-none focus:ring-4 focus:ring-[#e886ad]/50"
          />
        </div>

        <div className="border-t-[3px] border-dashed border-[#3b2a2f]/40 pt-4">
          <h2 className="mb-3 font-bold">時間設定（分鐘）</h2>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(MODES) as Mode[]).map((m) => (
              <label key={m} className="flex flex-col gap-1 text-sm font-bold">
                {MODES[m].label}
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={settings[m]}
                  onChange={(e) => {
                    const v = Math.min(120, Math.max(1, Number(e.target.value) || 1));
                    updateSetting(m, v);
                  }}
                  className="w-full rounded-lg border-[3px] border-[#3b2a2f] bg-white px-2 py-1.5 text-base outline-none focus:ring-4 focus:ring-[#e886ad]/50"
                />
              </label>
            ))}
          </div>
          <label className="mt-3 flex items-center justify-between gap-2 text-sm font-bold">
            每幾個番茄後長休息
            <input
              type="number"
              min={2}
              max={10}
              value={settings.longEvery}
              onChange={(e) =>
                updateSetting("longEvery", Math.min(10, Math.max(2, Number(e.target.value) || 2)))
              }
              className="w-20 rounded-lg border-[3px] border-[#3b2a2f] bg-white px-2 py-1.5 text-base outline-none focus:ring-4 focus:ring-[#e886ad]/50"
            />
          </label>
        </div>

        <div className="flex flex-col gap-2 border-t-[3px] border-dashed border-[#3b2a2f]/40 pt-4 text-sm font-bold">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.autoStart}
              onChange={(e) => updateSetting("autoStart", e.target.checked)}
              className="size-4 accent-[#e886ad]"
            />
            時間到自動開始下一段
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.sound}
              onChange={(e) => updateSetting("sound", e.target.checked)}
              className="size-4 accent-[#e886ad]"
            />
            時間到播放提示音
          </label>
          <p className="text-xs font-normal opacity-70">
            第一次按「開始」時瀏覽器會詢問是否允許通知，允許後切到其他分頁也能收到提醒。
          </p>
        </div>
      </aside>
    </div>
  );
}
