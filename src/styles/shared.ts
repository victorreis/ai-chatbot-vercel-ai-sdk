/**
 * Global shared Tailwind class combinations
 */

export const glassStyles = {
  light:
    "backdrop-blur-lg backdrop-saturate-150 bg-white/5 border border-white/10",
  medium:
    "backdrop-blur-md backdrop-saturate-150 bg-white/10 border border-white/20",
  dark: "backdrop-blur-lg backdrop-saturate-150 bg-black/5 border border-white/10",
} as const;

export const layoutStyles = {
  sidebar: "flex h-full w-64 flex-col overflow-hidden border-r",
  header: "flex h-[73px] items-center justify-between border-b px-6",
  main: "flex flex-1 flex-col overflow-hidden",
  footer: "border-t p-4",
} as const;
