export function log(level: string, message: string, context?: Record<string, unknown>): void {
  console.log(
    JSON.stringify({
      level,
      message,
      timestamp: new Date().toISOString(),
      module: 'push-server',
      ...context,
    }),
  );
}