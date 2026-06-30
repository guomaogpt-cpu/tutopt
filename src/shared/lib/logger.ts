import { getEnv } from "@/shared/config/env";

export type LogLevel = "debug" | "info" | "warn" | "error";

type LogMeta = Record<string, unknown>;

const LOG_LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function getMinLogLevel(): LogLevel {
  try {
    return getEnv().LOG_LEVEL;
  } catch {
    return "info";
  }
}

function shouldLog(level: LogLevel): boolean {
  const minLevel = getMinLogLevel();
  return LOG_LEVEL_ORDER[level] >= LOG_LEVEL_ORDER[minLevel];
}

function write(level: LogLevel, message: string, meta?: LogMeta): void {
  if (!shouldLog(level)) {
    return;
  }

  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(meta ? { meta } : {}),
  };

  const line = JSON.stringify(payload);

  switch (level) {
    case "debug":
    case "info":
      // eslint-disable-next-line no-console -- structured logger output
      console.log(line);
      break;
    case "warn":
      console.warn(line);
      break;
    case "error":
      console.error(line);
      break;
  }
}

export const logger = {
  debug(message: string, meta?: LogMeta): void {
    write("debug", message, meta);
  },
  info(message: string, meta?: LogMeta): void {
    write("info", message, meta);
  },
  warn(message: string, meta?: LogMeta): void {
    write("warn", message, meta);
  },
  error(message: string, meta?: LogMeta): void {
    write("error", message, meta);
  },
};
