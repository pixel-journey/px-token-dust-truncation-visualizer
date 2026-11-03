/**
 * Integer dust under basis-point tax and pro-rata reward math.
 * Real executable rules for education — not a deployed token contract.
 */

export const MAX_BPS = 10_000;
/** Antelope asset amounts are int64; stay well below 2^62-1 in examples. */
export const MAX_AMOUNT = 4_611_686_018_427_387_903n; // 2^62 - 1

export function assertAmount(amount: bigint): bigint {
  if (typeof amount !== "bigint") throw new Error("amount must be bigint");
  if (amount < 0n) throw new Error("amount must not be negative");
  if (amount > MAX_AMOUNT) throw new Error("amount exceeds MAX_AMOUNT");
  return amount;
}

export function assertBps(bps: number): number {
  if (!Number.isInteger(bps) || bps < 0 || bps > MAX_BPS) {
    throw new Error("bps must be an integer from 0 to 10000");
  }
  return bps;
}

/**
 * Floor tax in basis points: floor(amount * bps / 10000).
 * Returns { tax, net } so callers see when tax is zero while amount > 0.
 */
export function taxBps(amount: bigint, bps: number): { tax: bigint; net: bigint } {
  assertAmount(amount);
  assertBps(bps);
  const tax = (amount * BigInt(bps)) / 10_000n;
  const net = amount - tax;
  if (net < 0n) throw new Error("internal: net negative");
  return { tax, net };
}

/**
 * Smallest amount that produces tax >= 1 at this bps.
 * For bps === 0 every amount is dust (returns null).
 */
export function minAmountForNonDustTax(bps: number): bigint | null {
  assertBps(bps);
  if (bps === 0) return null;
  // ceil(10000 / bps)
  return (10_000n + BigInt(bps) - 1n) / BigInt(bps);
}

/**
 * Floor pro-rata reward: floor(pool * shares / totalShares).
 * When shares are tiny relative to totalShares, reward is 0.
 */
export function rewardShare(
  pool: bigint,
  shares: bigint,
  totalShares: bigint
): bigint {
  assertAmount(pool);
  assertAmount(shares);
  assertAmount(totalShares);
  if (totalShares === 0n) throw new Error("totalShares must not be zero");
  if (shares > totalShares) throw new Error("shares exceed totalShares");
  return (pool * shares) / totalShares;
}

/**
 * Apply the same bps tax `hops` times (each hop taxes the previous net).
 * Educational: dust can accumulate across multi-hop paths.
 */
export function multiHopNet(amount: bigint, bps: number, hops: number): bigint {
  assertAmount(amount);
  assertBps(bps);
  if (!Number.isInteger(hops) || hops < 1 || hops > 32) {
    throw new Error("hops must be an integer from 1 to 32");
  }
  let cur = amount;
  for (let i = 0; i < hops; i++) {
    cur = taxBps(cur, bps).net;
  }
  return cur;
}

/** True when a positive amount produces zero tax at this bps (pure dust). */
export function isTaxDust(amount: bigint, bps: number): boolean {
  if (amount <= 0n) return false;
  return taxBps(amount, bps).tax === 0n;
}

/** True when positive shares still yield zero reward. */
export function isRewardDust(
  pool: bigint,
  shares: bigint,
  totalShares: bigint
): boolean {
  if (shares <= 0n) return false;
  return rewardShare(pool, shares, totalShares) === 0n;
}

/**
 * Smallest shares that produce reward ≥ 1 for a given pool and totalShares.
 * null if pool is 0 (no reward possible).
 */
export function minSharesForNonDustReward(
  pool: bigint,
  totalShares: bigint
): bigint | null {
  assertAmount(pool);
  assertAmount(totalShares);
  if (totalShares === 0n) throw new Error("totalShares must not be zero");
  if (pool === 0n) return null;
  // ceil(totalShares / pool)
  const need = (totalShares + pool - 1n) / pool;
  if (need > totalShares) return totalShares; // only full ownership might pay
  return need;
}

/** Total tax extracted across multi-hop (amount - final net). */
export function multiHopTaxTaken(
  amount: bigint,
  bps: number,
  hops: number
): bigint {
  const net = multiHopNet(amount, bps, hops);
  return amount - net;
}

/** Compare tax at two bps rates for the same amount. */
export function compareTaxBps(
  amount: bigint,
  bpsA: number,
  bpsB: number
): { a: { tax: bigint; net: bigint }; b: { tax: bigint; net: bigint }; taxDelta: bigint } {
  const a = taxBps(amount, bpsA);
  const b = taxBps(amount, bpsB);
  return { a, b, taxDelta: a.tax - b.tax };
}

/** Scan [1..limit] and count how many amounts are tax-dust at bps. */
export function countDustAmounts(bps: number, limit: bigint): bigint {
  assertBps(bps);
  assertAmount(limit);
  if (limit === 0n) return 0n;
  let n = 0n;
  for (let a = 1n; a <= limit; a++) {
    if (isTaxDust(a, bps)) n++;
  }
  return n;
}
