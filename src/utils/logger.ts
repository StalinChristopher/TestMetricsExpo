type LogLevel = "debug" | "info" | "warn" | "error";

const PREFIX: Record<LogLevel, string> = {
  debug: "[DEBUG]",
  info: "[INFO]",
  warn: "[WARN]",
  error: "[ERROR]",
};

/**
 * Structured logger with log levels.
 * `debug` and `info` are stripped in production builds (`__DEV__ === false`).
 * `warn` and `error` always emit — they surface actionable signals in production.
 */
export const logger = {
  debug: (...args: unknown[]): void => {
    if (__DEV__) {
      console.log(PREFIX.debug, ...args);
    }
  },
  info: (...args: unknown[]): void => {
    if (__DEV__) {
      console.info(PREFIX.info, ...args);
    }
  },
  warn: (...args: unknown[]): void => {
    console.warn(PREFIX.warn, ...args);
  },
  error: (...args: unknown[]): void => {
    console.error(PREFIX.error, ...args);
  },
};
