# Security and economic assumptions

Dust is not only a UX issue. It breaks **assumptions** people encode in higher-level logic.

## Assumptions that fail under dust

| Assumption | Failure mode |
|------------|----------------|
| “Every transfer pays the protocol” | Dust transfers are free of tax |
| “sum(taxes) == bps * volume / 10000” | Floor per transfer under-collects vs real arithmetic on totals |
| “Pro-rata always pays something” | Tiny shares claim 0 while still counting in totalShares |
| “Multi-hop fee is hops * bps” | Compound floors reduce net faster than a single multiply |

## Related hard rules (other quests)

- Prefer `__int128` (or `bigint` in tests) between multiply and divide
- Cap amounts at `MAX_AMOUNT` (`2^62 - 1` for classic asset paths)
- Refuse negative quantities
- DEX-facing paths may need **exact** delivery (see `px-token-dex-differentiated-tax`) — a different rule from dust visualization

## This lab’s scope

We **demonstrate** floor dust with tests. We do **not** claim a particular production mitigation (minimum tax of 1, round-to-nearest, exempt dust, etc.). Choose mitigations deliberately in the quest that implements a full token.
