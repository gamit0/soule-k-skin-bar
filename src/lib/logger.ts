// Logger mínimo y estructurado. En producción conviene enviar esto a un
// servicio real (Axiom, Datadog, Sentry) — ver DOC-PENDIENTES.md.
type Level = "info" | "warn" | "error";

function log(level: Level, message: string, context?: Record<string, unknown>) {
  const entry = {
    level,
    message,
    ...context,
    timestamp: new Date().toISOString(),
  };
  const method = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
  method(JSON.stringify(entry));
}

export const logger = {
  info: (message: string, context?: Record<string, unknown>) => log("info", message, context),
  warn: (message: string, context?: Record<string, unknown>) => log("warn", message, context),
  error: (message: string, context?: Record<string, unknown>) => log("error", message, context),
};
