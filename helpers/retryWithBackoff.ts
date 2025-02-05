export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    retries?: number;
    delay?: number;
    factor?: number;
  } = {},
): Promise<T> {
  const { retries = 5, delay = 1000, factor = 2 } = options;

  try {
    return await fn();
  } catch (error: unknown) {
    if (retries <= 0) throw error;

    const waitTime = delay * factor;
    console.warn(`Retrying in ${waitTime / 1000} seconds...`);

    await new Promise((resolve) => setTimeout(resolve, waitTime));

    return retryWithBackoff(fn, {
      retries: retries - 1,
      delay: waitTime,
      factor,
    });
  }
}
