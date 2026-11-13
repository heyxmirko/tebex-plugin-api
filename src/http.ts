import { TebexError } from "./errors";

export interface TebexClientOptions {
  secret?: string;
  baseUrl?: string;
  timeout?: number;
  fetch?: typeof fetch;
}

export interface RequestOptions {
  signal?: AbortSignal;
}

interface Init extends RequestOptions {
  query?: Record<string, string | number | undefined>;
  body?: unknown;
}

type Method = "GET" | "POST" | "PUT" | "DELETE";

export class Http {
  readonly #secret: string;
  readonly #baseUrl: string;
  readonly #timeout: number;
  readonly #fetch: typeof fetch;

  constructor(options: TebexClientOptions) {
    const secret =
      options.secret ?? (typeof process === "undefined" ? undefined : process.env.TEBEX_SECRET);
    if (!secret) {
      throw new TypeError(
        "Missing Tebex secret. Pass `secret` or set the TEBEX_SECRET environment variable.",
      );
    }
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      console.warn(
        "[tebex-plugin-api] Your secret is exposed in the browser. Use this server-side only.",
      );
    }

    this.#secret = secret;
    this.#baseUrl = (options.baseUrl ?? "https://plugin.tebex.io").replace(/\/+$/, "");
    this.#timeout = options.timeout ?? 10_000;
    this.#fetch = options.fetch ?? globalThis.fetch.bind(globalThis);
  }

  async request<T>(method: Method, path: string, init: Init = {}): Promise<T> {
    const url = new URL(this.#baseUrl + path);
    for (const [key, value] of Object.entries(init.query ?? {})) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }

    const signals = [init.signal, this.#timeout > 0 && AbortSignal.timeout(this.#timeout)].filter(
      (signal) => !!signal,
    );
    const hasBody = init.body !== undefined;

    const response = await this.#fetch(url, {
      method,
      headers: {
        Accept: "application/json",
        "X-Tebex-Secret": this.#secret,
        ...(hasBody && { "Content-Type": "application/json" }),
      },
      body: hasBody ? JSON.stringify(init.body) : null,
      signal: signals.length ? AbortSignal.any(signals) : null,
    });

    // Some endpoints reply 201/204 with no body.
    const text = await response.text();
    const data = text ? parseJson(text) : undefined;

    if (!response.ok) {
      const error =
        typeof data === "object" && data !== null ? (data as Record<string, unknown>) : {};
      throw new TebexError({
        message:
          typeof error.error_message === "string"
            ? error.error_message
            : response.statusText || `HTTP ${response.status}`,
        status: response.status,
        code: typeof error.error_code === "number" ? error.error_code : undefined,
        method,
        path,
        body: data,
      });
    }

    return data as T;
  }

  async requestData<T>(method: Method, path: string, init?: Init): Promise<T> {
    return (await this.request<{ data: T }>(method, path, init)).data;
  }
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const segment = (value: string | number): string => encodeURIComponent(String(value));
