export class GeminiServiceError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "GeminiServiceError";
  }
}

type RetryOptions = {
  maxAttempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  sleep?: (ms: number) => Promise<void>;
};

function getStatus(error: unknown): number | undefined {
  if (!error || typeof error !== "object") return undefined;

  const value = error as {
    status?: unknown;
    code?: unknown;
  };

  const status = value.status ?? value.code;
  const numeric = Number(status);

  return Number.isInteger(numeric) ? numeric : undefined;
}
function isTimeoutError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const candidate = error as {
    name?: unknown;
    message?: unknown;
  };

  return candidate.name === "TimeoutError" || candidate.name === "AbortError";
}
function isRetryable(status: number | undefined): boolean {
  return (
    status === 408 ||
    status === 429 ||
    (status !== undefined && status >= 500 && status <= 599)
  );
}
export async function withGeminiRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const {
    maxAttempts = 3,
    baseDelayMs = 500,
    maxDelayMs = 2000,
    sleep = (ms) => new Promise<void>((resolve) => setTimeout(resolve, ms)),
  } = options;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      const status = getStatus(error);
      if (!isRetryable(status) && !isTimeoutError(error)) {
        throw error;
      }
      if (attempt === maxAttempts) {
        throw new GeminiServiceError(
          status === 429 ? 429 : 503,
          "Gemini is temporarily unavailable.",
        );
      }
      const exponentialDelay = Math.min(
        maxDelayMs,
        baseDelayMs * 2 ** (attempt - 1),
      );

      const jitter = Math.random() * exponentialDelay;

      await sleep(exponentialDelay + jitter);
    }
  }

  throw new Error("Unexpected retry state.");
}
