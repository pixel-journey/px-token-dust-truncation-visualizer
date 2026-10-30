# px-token-dust-truncation-visualizer

> **Trust:** private educational lab (Tier A)  
> **Status:** Pure rules + education pass (2026-10-31)

Show, with **real executable tests**, how integer tax and pro-rata reward math **truncate to zero** (“dust”).

```bash
npm test
```

| Helper | Role |
|--------|------|
| `taxBps` | floor tax + net |
| `minAmountForNonDustTax` | first amount with tax ≥ 1 |
| `rewardShare` | floor pro-rata |
| `isTaxDust` | positive amount, zero tax |

[POLICY.md](./POLICY.md) · [EDUCATION.md](./EDUCATION.md)

MIT — Pixel Journey
