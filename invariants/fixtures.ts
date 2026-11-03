/** Sample scenarios for docs and a future UI host. */

export const TAX_SCENARIOS = [
  { label: "mid 30 bps", amount: 10_000n, bps: 30 },
  { label: "dust edge", amount: 333n, bps: 30 },
  { label: "first non-dust", amount: 334n, bps: 30 },
  { label: "1 bps tiny", amount: 9_999n, bps: 1 },
] as const;

export const REWARD_SCENARIOS = [
  { label: "1 of 10000 vs pool 100", pool: 100n, shares: 1n, totalShares: 10_000n },
  { label: "100 of 10000 vs pool 100", pool: 100n, shares: 100n, totalShares: 10_000n },
] as const;
