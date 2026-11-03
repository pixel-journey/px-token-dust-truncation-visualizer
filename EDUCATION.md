# Education — integer dust

> **Rung:** `npm test` passes. This lab is pure TypeScript on purpose. It is not a token and not a farm.  
> **The test is the rule.** Derived numbers below that the tests do not assert are marked derived.

## What you should be able to do

| Level | After this file |
| --- | --- |
| Beginner | Show a positive amount whose 30 bps tax is zero |
| Intermediate | Derive the first non-dust amount and the first paying share, and match them to the tests |
| Masterclass | Decide what a token or a farm must document, and what this lab still does not implement |

Myths live in `myths.ts`. Do not skip the one that says this is not live PIXA tax code.

---

## Beginner — one scene

Someone says the fee is 0.30%. A transfer of 333 units arrives.

```text
tax = floor(333 * 30 / 10000) = floor(0.999) = 0
net = 333
```

The next unit:

```text
tax = floor(334 * 30 / 10000) = floor(1.002) = 1
net = 333
```

The advertised rate and the paid rate are different numbers until the amount is large enough to survive the floor. `minAmountForNonDustTax(30)` is `334n`. Amounts `1` through `333` are tax-dust. `countDustAmounts(30, 334n)` is still `333`, because 334 itself is not dust.

A reward can vanish the same way:

```text
reward = floor(100 * 1 / 10000) = 0
```

One share against a pool of 100 and a total of 10000 shares pays nothing. You need 100 shares before the floor becomes 1.

### Words

| Word | Formula in this lab |
| --- | --- |
| `taxBps` | `floor(amount * bps / 10000)`, plus `net = amount - tax` |
| Tax dust | Amount > 0 and tax = 0. Amount 0 is **not** called dust |
| `minAmountForNonDustTax` | `ceil(10000 / bps)`, or `null` when bps is 0 |
| `rewardShare` | `floor(pool * shares / totalShares)` |
| Reward dust | Shares > 0 and reward = 0 |
| Multi-hop | Apply the same tax to the previous net, 1 to 32 times |

### Predict, then run

```bash
npm test
node invariants/demo.mjs
```

1. `taxBps(10000n, 30)` is tax 30, net 9970.
2. `taxBps(500n, 10000)` takes the entire 500. Net is 0. A 100% floor is not dust.
3. `minAmountForNonDustTax(0)` is `null`. A zero rate never produces a tax of 1.
4. `minAmountForNonDustTax(1)` is `10000`. One basis point needs a 10000-unit amount before the tax is 1.

---

## Intermediate — where the thresholds come from

You want `floor(amount * bps / 10000) >= 1`, so `amount * bps >= 10000`, so `amount >= ceil(10000 / bps)`.

The code writes that ceil as `(10000 + bps - 1) / bps` in bigint division.

| bps | ceil(10000 / bps) | Test |
| --- | --- | --- |
| 30 | 334 | `minAmountForNonDustTax(30) === 334n` |
| 1 | 10000 | `minAmountForNonDustTax(1) === 10000n` |
| 0 | undefined | returns `null` |

Reward: `floor(pool * shares / totalShares) >= 1` means `shares >= ceil(totalShares / pool)` when the pool is positive.

| pool | totalShares | ceil | Test |
| --- | --- | --- | --- |
| 100 | 10000 | 100 | 99 shares pay 0; 100 shares pay 1 |

`rewardShare` refuses `totalShares === 0` and refuses `shares` above `totalShares`. `assertAmount` also refuses a negative pool. A zero pool is allowed by `assertAmount` (zero is not negative) and `minSharesForNonDustReward` returns `null` for it. The tests do not call that zero-pool path.

### Multi-hop — what is tested vs derived

The test says `multiHopNet(10000n, 30, 3)` is `>= 0`, and `multiHopTaxTaken + multiHopNet` equals the start. It does **not** lock the final net.

Derived, not asserted:

```text
10000 → tax 30 → net 9970
9970  → tax floor(299100/10000)=29 → net 9941
9941  → tax floor(298230/10000)=29 → net 9912
tax taken = 10000 - 9912 = 88
```

If you quote 9912, say it is arithmetic from the formula, not a test expectation. The tested property is conservation: hops only reduce net, they do not mint the truncated dust back.

### `compareTaxBps`

`compareTaxBps(10000n, 50, 30)` only asserts `taxDelta >= 0`. Derived: tax 50 minus tax 30 is 20. The test would also pass if both taxes were 0. Do not over-read it.

### `fixtures.ts`

The fixture `{ amount: 9999n, bps: 1 }` is not asserted. By the same ceil, 9999 is still dust at 1 bps, because the tested threshold is 10000.

---

## Masterclass — what to write down before you ship a rate

### A rate sentence is incomplete without the floor

"0.30% fee" is false for every amount under 334 at 30 bps. The effective rate is 0. Document `minAmountForNonDustTax(bps)` beside the marketing number, or change the rule (minimum tax of 1, round-half-up, or tax in a higher precision). This lab does not implement those alternatives. It shows the floor.

### Farms

`floor(pool * shares / totalShares)` with a large `totalShares` and a small `pool` strands small stakers at 0. They still paid for the deposit. `px-stake-nft-custodial-masterchef` is the neighbor that uses an accumulator scale (`1e12`) so the dust threshold moves. This file does not import it. If you copy `rewardShare` into a claim function, a user with 99 shares in the example above claims 0 and, if you still mark them claimed, you have deleted their reward.

### Dex and tax legs

Dust on a transfer tax is a different bug from dust inside a pool. `px-token-transfer-tax-burn-treasury` shows a 1-unit transfer whose tax is 0 and whose recipient still gets 1. `px-token-dex-differentiated-tax` is about the pool seeing the exact amount. Do not mix the three explanations.

### Integer width

`MAX_AMOUNT` is `2^62 - 1`. `bigint` will not wrap. An `int64` multiply of `amount * bps` can, which is why the vault standard requires a wider intermediate (`__int128`) before the divide. This lab does not demonstrate that overflow. It refuses amounts above the cap instead.

### Exercise

1. Compute `minAmountForNonDustTax(100)`. `ceil(10000/100) = 100`. Amount 99 should be dust. The tests do not include 100 bps. Check it yourself if you add a case.
2. Explain why `isTaxDust(0n, 30)` is false without calling a tax of zero "dust." (The helper returns false when amount is not positive. Dust means a positive input collapsed.)
3. Name one sentence you are not allowed to write about this repo. ("This is the PIXA tax." See `myths.ts`.)

---

## What this course will not teach

- A specific asserted value for the 3-hop net (the test does not lock one)
- A live token's parameters
- How to round away from zero (not implemented)
