import { retryWithBackoff } from "./retryWithBackoff.ts";

export function safeApiCall<T>(fn: () => Promise<T>): Promise<T> {
  return retryWithBackoff(fn); // Retries 5 times with backoff
}
