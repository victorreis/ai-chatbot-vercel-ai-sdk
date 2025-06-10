export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export function devLog(...args: unknown[]): void {
  if (!isProduction()) {
    // eslint-disable-next-line no-console
    console.log("[DEV]", ...args);
  }
}

export function devError(...args: unknown[]): void {
  if (!isProduction()) {
    console.error("[DEV ERROR]", ...args);
  }
}

export function devWarn(...args: unknown[]): void {
  if (!isProduction()) {
    console.warn("[DEV WARN]", ...args);
  }
}
