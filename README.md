# When a positive amount still pays zero

> **Domain:** token math — dust / truncation  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Catalog:** `px-contract-examples-vault` (private index; not this public course)  
> **Path:** `px-contract-examples-vault` (private index; not this public course)

**Goal:** Show that `floor(amount * bps / 10000)` and `floor(pool * shares / totalShares)` can be **zero** while inputs are positive — and that the sum of floors can be **less than the pool**.

**Code under test:** `npm test` and `node invariants/demo.mjs`. Not a live token tax claim.

## Learning materials

| Doc | Role |
| --- | --- |
| [EDUCATION.md](EDUCATION.md) | Beginner → masterclass |
| [WORKED-EXAMPLES.md](WORKED-EXAMPLES.md) | 30 bps threshold, multi-hop, reward dust |
| [TIPS.md](TIPS.md) | Design implications |
| [SECURITY.md](SECURITY.md) | Bounds |
| [SOURCES.md](SOURCES.md) | Official + related |

## Composition

Exact non-dust threshold, multi-hop conservation, dust hops that never shrink, pro-rata desk where floors underpay the pool.

## What is true (executed)

| Rule | Result |
| --- | --- |
| `taxBps(333n, 30)` | tax `0` |
| `taxBps(334n, 30)` | tax `1` |
| `minAmountForNonDustTax(30)` | `334` |
| `rewardShare(100n, 1n, 10000n)` | `0` |

```bash
npm test
node invariants/demo.mjs
```

MIT — Pixel Journey
