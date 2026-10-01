"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { INK, YELLOW } from "./theme";
import ToolIcon from "./ToolIcon";
import { TOOLS } from "./tools";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky top-0 z-50 border-b-[3px] border-[#3b2a2f] bg-[#f8f4e3]"
      style={{ color: INK }}
      aria-label="主要導覽"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2.5">
        <Link href="/" className="flex items-center gap-2 text-xl font-black tracking-wide">
          <span
            className="flex size-9 items-center justify-center rounded-full border-[3px] border-[#3b2a2f] text-lg"
            style={{ backgroundColor: YELLOW }}
            aria-hidden
          >
            皮
          </span>
          皮皮小工具
        </Link>

        <ul className="flex flex-wrap items-center gap-2">
          {TOOLS.map((tool) => {
            const active = pathname === tool.href;
            return (
              <li key={tool.href}>
                <Link
                  href={tool.href}
                  aria-current={active ? "page" : undefined}
                  className="flex items-center gap-1.5 rounded-full border-[3px] border-[#3b2a2f] px-3 py-1 text-sm font-bold transition-transform hover:-translate-y-0.5"
                  style={{
                    backgroundColor: active ? tool.color : "white",
                    boxShadow: active ? `0 3px 0 ${INK}` : "none",
                  }}
                >
                  <ToolIcon icon={tool.icon} className="size-5" />
                  {tool.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
