import type { Metadata } from "next";
import Banner from "../_components/Banner";
import Decorations from "../_components/Decorations";
import { INK, SKY } from "../_components/theme";
import PomodoroTimer from "./PomodoroTimer";

export const metadata: Metadata = {
  title: "番茄專注鐘",
  description: "番茄工作法計時器：專注 25 分鐘、休息 5 分鐘",
};

export default function PomodoroPage() {
  return (
    <div
      className="relative flex flex-1 flex-col items-center overflow-hidden px-4 pb-40 pt-8 font-sans"
      style={{ backgroundColor: SKY, color: INK }}
    >
      <Decorations />

      <main className="relative z-10 w-full max-w-5xl">
        <Banner title="番茄專注鐘" subtitle="專心工作，適時休息" />
        <PomodoroTimer />
      </main>
    </div>
  );
}
