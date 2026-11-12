# When a positive amount still pays zero

> **Domain:** token math — dust / truncation  
> **Sources:** [SOURCES.md](SOURCES.md)  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**One-sentence goal:** Show, with executed tests, that `floor(amount * bps / 10000)` and `floor(pool * shares / totalShares)` can be **zero** while the input is still positive.

**Real code:** `npm test` (unit + **multi-hop / multi-claimer composition**) and `node invariants/demo.mjs`. **Not** wasm, **not** a claim about any live WAX token's tax.

Docs: [docs.wax.io](https://docs.wax.io/). Related tax lab: [transfer-tax](https://github.com/pixel-journey/px-token-transfer-tax-burn-treasury).

## Composition note

`dust.composition.test.ts` walks the exact non-dust threshold, multi-hop tax (net + taken = start), dust hops that never shrink, and a pro-rata claim desk where the sum of floors can be **less than the pool**.

## What is true (executed)

| Rule | Result |
| --- | --- |
| `taxBps(333n, 30)` | tax `0` |
| `taxBps(334n, 30)` | tax `1` |
| `minAmountForNonDustTax(30)` | `334` |
| `rewardShare(100n, 1n, 10000n)` | `0` |
| Multi-claimer floors | paid can be `< pool` |

## Run

```bash
npm test
node invariants/demo.mjs
```

MIT — Pixel Journey
