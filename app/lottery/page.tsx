import type { Metadata } from "next";
import Banner from "../_components/Banner";
import Decorations from "../_components/Decorations";
import { INK, SKY } from "../_components/theme";
import LotteryWheel from "./LotteryWheel";

export const metadata: Metadata = {
  title: "抽獎轉轉樂",
  description: "輸入名單，轉動轉盤抽出幸運兒",
};

export default function LotteryPage() {
  return (
    <div
      className="relative flex flex-1 flex-col items-center overflow-hidden px-4 pb-40 pt-8 font-sans"
      style={{ backgroundColor: SKY, color: INK }}
    >
      <Decorations />

      <main className="relative z-10 w-full max-w-5xl">
        <Banner title="抽獎轉轉樂" subtitle="幸運轉盤，驚喜等你拿" />
        <LotteryWheel />
      </main>
    </div>
  );
}
