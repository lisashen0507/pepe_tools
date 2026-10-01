import Link from "next/link";
import Banner from "./_components/Banner";
import Decorations from "./_components/Decorations";
import { CREAM, INK, SKY } from "./_components/theme";
import ToolIcon from "./_components/ToolIcon";
import { COMING_SOON_COLOR, TOOLS } from "./_components/tools";

export default function Home() {
  return (
    <div
      className="relative flex flex-1 flex-col items-center overflow-hidden px-4 pb-44 pt-8 font-sans"
      style={{ backgroundColor: SKY, color: INK }}
    >
      <Decorations />

      <main className="relative z-10 w-full max-w-5xl">
        <Banner title="皮皮小工具" subtitle="可愛又實用的小工具，打開就能用" />

        <p className="mx-auto mb-10 max-w-xl text-center text-lg font-bold">
          不用安裝、不用註冊，點一下就開始。
          <br className="hidden sm:block" />
          挑一個你現在需要的小幫手吧！
        </p>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <li key={tool.href}>
              <Link
                href={tool.href}
                className="group flex h-full flex-col rounded-2xl border-[3px] border-[#3b2a2f] bg-[#f8f4e3] p-5 shadow-[6px_6px_0_#3b2a2f] transition-transform hover:-translate-y-1 hover:shadow-[8px_10px_0_#3b2a2f]"
              >
                <div
                  className="mb-4 flex h-32 items-center justify-center rounded-xl border-[3px] border-[#3b2a2f]"
                  style={{ backgroundColor: tool.color }}
                >
                  <ToolIcon icon={tool.icon} className="size-20 transition-transform group-hover:rotate-12" />
                </div>
                <h2 className="mb-1 text-2xl font-black">{tool.name}</h2>
                <p className="mb-4 flex-1 font-medium opacity-80">{tool.description}</p>
                <span
                  className="self-start rounded-full border-[3px] border-[#3b2a2f] px-4 py-1 font-bold"
                  style={{ backgroundColor: tool.accent }}
                >
                  立即使用 →
                </span>
              </Link>
            </li>
          ))}

          <li
            className="flex flex-col items-center justify-center rounded-2xl border-[3px] border-dashed border-[#3b2a2f] p-5 text-center"
            style={{ backgroundColor: CREAM }}
          >
            <div
              className="mb-3 flex size-20 items-center justify-center rounded-full border-[3px] border-[#3b2a2f]"
              style={{ backgroundColor: COMING_SOON_COLOR }}
            >
              <ToolIcon icon="star" className="size-12" />
            </div>
            <h2 className="text-xl font-black">更多工具</h2>
            <p className="font-medium opacity-80">敬請期待</p>
          </li>
        </ul>
      </main>
    </div>
  );
}
