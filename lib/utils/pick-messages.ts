/** Picks top-level namespaces so only what client components need is sent to the browser. */
export function pickMessages<T extends Record<string, unknown>, K extends keyof T>(
  messages: T,
  namespaces: readonly K[],
): Pick<T, K> {
  return Object.fromEntries(namespaces.map((ns) => [ns, messages[ns]])) as Pick<T, K>;
}
