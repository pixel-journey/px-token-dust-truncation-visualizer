# Architecture

```
amount, bps ──► taxBps → { tax, net }
                   │
                   ├── isTaxDust
                   ├── minAmountForNonDustTax
                   ├── multiHopNet / multiHopTaxTaken
                   ├── compareTaxBps
                   └── countDustAmounts

pool, shares, totalShares ──► rewardShare
                   │
                   ├── isRewardDust
                   └── minSharesForNonDustReward
```

**Honesty boundary:** pure bigint rules only. No chain, no wallet, no broadcast.
