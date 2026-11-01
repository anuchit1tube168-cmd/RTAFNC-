interface Fetcher {
  fetch(request: Request): Promise<Response>;
}

interface D1Result<T = Record<string, unknown>> {
  results?: T[];
  success?: boolean;
  meta?: Record<string, unknown>;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  run<T = Record<string, unknown>>(): Promise<D1Result<T>>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<T[]>;
}

interface ExportedHandler<Env = unknown> {
  fetch(request: Request, env: Env, ctx?: unknown): Response | Promise<Response>;
}
