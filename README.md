# px-token-dust-truncation-visualizer

> **Trust label:** `educational-reference`  
> **Status:** Full-thrust education pass (2026-11-03)

Show, with **real executable tests**, how integer tax and pro-rata reward math **truncate to zero** (“dust”).

```bash
npm test
node invariants/demo.mjs
```

| Helper | Role |
|--------|------|
| `taxBps` | floor tax + net |
| `minAmountForNonDustTax` | first amount with tax ≥ 1 |
| `rewardShare` | floor pro-rata |
| `isTaxDust` / `isRewardDust` | positive in, zero out |
| `minSharesForNonDustReward` | first paying share count |
| `multiHopNet` / `multiHopTaxTaken` | repeated floor tax |
| `compareTaxBps` / `countDustAmounts` | compare & scan |

[EDUCATION.md](./EDUCATION.md) · [ARCHITECTURE.md](./ARCHITECTURE.md) · [POLICY.md](./POLICY.md) · [SECURITY.md](./SECURITY.md)

MIT — Pixel Journey
