/**
 * Delays execution for a specified number of milliseconds,
 * but only when running in a development environment.
 *
 * Useful for simulating network latency or testing loading states
 * without affecting production performance.
 *
 * @example
 * ```ts
 * await delayIfDev(2000);
 * console.log("Done (with 2s delay in dev only)");
 * ```
 *
 * @param {number} ms - The number of milliseconds to delay execution.
 * @returns {Promise<void>} A promise that resolves after the specified delay (only in development).
 */
export async function delayIfDev(ms: number): Promise<void> {
  if (process.env.NODE_ENV !== "development") return;

  console.log(`⏳ Simulating ${ms}ms delay (dev only)...`);
  await new Promise((resolve) => setTimeout(resolve, ms));
}
