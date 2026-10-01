import { LAVENDER, MINT, PINK, YELLOW } from "./theme";

// 所有小工具的清單：導覽列和首頁都從這裡讀，新增工具時加在這裡
export const TOOLS = [
  {
    href: "/lottery",
    name: "抽獎轉轉樂",
    description: "輸入名單、轉動轉盤，公平又有趣地抽出幸運兒。",
    color: YELLOW,
    accent: PINK,
    icon: "wheel",
  },
  {
    href: "/pomodoro",
    name: "番茄專注鐘",
    description: "專注 25 分鐘、休息 5 分鐘，用番茄工作法幫你專心做事。",
    color: PINK,
    accent: MINT,
    icon: "tomato",
  },
] as const;

export const COMING_SOON_COLOR = LAVENDER;
