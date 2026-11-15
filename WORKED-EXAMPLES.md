# Worked examples — integer dust

All math is integer division. Tax rate is **basis points** (10000 = 100%).

## taxBps at 30 bps

| amount | tax | net |
| --- | --- | --- |
| 10_000 | 30 | 9_970 |
| 1 | 0 | 1 |
| 333 | 0 | 333 |
| 334 | 1 | 333 |

`minAmountForNonDustTax(30)` is **334**. Amounts 1..333 are dust at 30 bps (`countDustAmounts` = 333). Zero amount is not labeled dust. Bps 0 → min is null (always dust). 1 bps threshold is 10_000.

10000 bps on 500 → tax 500, net 0.

## rewardShare

`rewardShare(pool 100, shares 1, total 10_000)` → 0 (reward dust).
`rewardShare(100, 50, 100)` → 50.
`minSharesForNonDustReward(100, 10_000)` → 100 (first paying share). 99 shares still 0; 100 shares → 1.
Zero pool → null. totalShares 0 or shares > total refused.

## multiHop

3 hops at 30 bps on 10_000 stays non-negative. `taxTaken + net === amount`. Hops 0 or 33 refused.
