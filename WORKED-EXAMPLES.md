# Worked examples — integer dust

## Example A — tax threshold at 30 bps

```text
taxBps(333n, 30) → tax 0, net 333   // pure dust
taxBps(334n, 30) → tax 1, net 333
minAmountForNonDustTax(30) === 334n
```

## Example B — zero bps

Every positive amount is dust for tax purposes; `minAmountForNonDustTax(0)` is `null`.

## Example C — multi-hop

Apply the same bps several times: `multiHopNet` + `multiHopTaxTaken === start`. Very small starts may never shrink once tax floors to zero each hop.

## Example D — reward dust

```text
rewardShare(100n, 1n, 10000n) === 0n
isRewardDust(100n, 1n, 10000n) === true
```

## Example E — multi-claimer remainder

Several floors of `pool * shares / total` can sum to **less than** `pool`. Remainder policy is a product decision (last claimer, treasury, burn).

## Example F — demo script

```bash
node invariants/demo.mjs
```
