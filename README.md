# When a positive amount still pays zero

> **Trust label:** `educational-reference`  
> **Status:** TypeScript floor rules only. Not a token.

**One-sentence goal:** Show, with executed tests, that `floor(amount * bps / 10000)` and `floor(pool * shares / totalShares)` can be **zero** while the input is still positive.

**Real code:** `npm test` and `node invariants/demo.mjs`. **Not** wasm, **not** a claim about any live WAX token's tax.

## What you can learn

- Why "0.30%" is not 30 units out of every amount. Below the threshold the effective tax is 0.
- Why the first non-dust amount at 30 bps is 334, not 333.
- Why 1 share of 10000 against a pool of 100 pays nothing.
- Why repeating the floor tax does not mint the truncated units back.

## What is actually in the repo

| Piece | Role |
| --- | --- |
| `invariants/dust.ts` | Tax, reward, multi-hop, and scan helpers |
| `invariants/dust.test.ts` | Executed claims |
| `invariants/demo.mjs` | Offline print of the same helpers |
| `invariants/fixtures.ts` | Sample rows for docs. Not asserted by the test file |
| `myths.ts` | Short myth / reality pairs |
| `EDUCATION.md` | The two floor formulas |
| `ARCHITECTURE.md` | Which helper calls which |

## What is true (executed)

| Rule | Result |
| --- | --- |
| `taxBps(10000n, 30)` | tax `30`, net `9970` |
| `taxBps(1n, 30)` and `taxBps(333n, 30)` | tax `0` |
| `taxBps(334n, 30)` | tax `1` |
| `taxBps(500n, 10000)` | tax `500`, net `0` |
| `minAmountForNonDustTax(30)` | `334` |
| `minAmountForNonDustTax(0)` | `null` |
| `minAmountForNonDustTax(1)` | `10000` |
| `isTaxDust(333n, 30)` / `isTaxDust(334n, 30)` | true / false |
| `rewardShare(100n, 1n, 10000n)` | `0` |
| `rewardShare(100n, 50n, 100n)` | `50` |
| `minSharesForNonDustReward(100n, 10000n)` | `100` |
| `rewardShare(100n, 99n, 10000n)` | `0` |
| `rewardShare(100n, 100n, 10000n)` | `1` |
| `multiHopNet(10000n, 30, 3)` | non-negative |
| `multiHopTaxTaken(...) + multiHopNet(...)` | equals the starting amount |
| `compareTaxBps(10000n, 50, 30)` | tax delta ≥ 0 |
| `countDustAmounts(30, 333n)` and `countDustAmounts(30, 334n)` | both `333` |

The multi-hop test does not pin a specific net. It checks that the path cannot go negative and that tax taken plus final net equals the start.

## The rule, in order

```text
tax    = floor(amount * bps / 10000)
net    = amount - tax
reward = floor(pool * shares / totalShares)
```

`minAmountForNonDustTax` is `ceil(10000 / bps)`, written as `(10000 + bps - 1) / bps`. At 0 bps every amount is dust, so the helper returns `null`.

`minSharesForNonDustReward` is `ceil(totalShares / pool)` when that count is at most `totalShares`. A zero pool returns `null`.

`isTaxDust` is true only when amount is positive and tax is zero. A zero amount is not called dust. Same shape for `isRewardDust`.

`multiHopNet` applies `taxBps` to the previous net, 1 to 32 times.

```ts
import { taxBps, minAmountForNonDustTax, rewardShare } from "./invariants/dust.ts";

taxBps(333n, 30); // { tax: 0n, net: 333n }
taxBps(334n, 30); // { tax: 1n, net: 333n }
minAmountForNonDustTax(30); // 334n
rewardShare(100n, 1n, 10_000n); // 0n
```

## Edge cases

- Amounts must be a non-negative `bigint` at or below `MAX_AMOUNT` (`2^62 - 1`). Basis points must be an integer from 0 to 10000.
- `rewardShare` refuses `totalShares === 0` and refuses `shares` above `totalShares`.
- `countDustAmounts` loops from 1 through `limit`. It is a teaching scan, not a chain indexer.
- `fixtures.ts` lists a 1 bps amount of 9999. The test file does not assert that row. At 1 bps the tested threshold is 10000, so 9999 is dust by the same floor.

## Best practice and the opposite

**Do** publish `minAmountForNonDustTax(bps)` next to any "0.30%" sentence.  
**Do** unit-test the smallest share a farm will actually pay.

**Do not** say a positive balance always produces a positive tax.  
**Do not** treat this file as the tax code of a live token. See `myths.ts`.

## Live path, not shipped

```
taxBps / rewardShare / multiHopNet   [tested]
    → token transfer                    [not in this repo]
    → farm claim                        [not in this repo]
```

See [EDUCATION.md](EDUCATION.md), [ARCHITECTURE.md](ARCHITECTURE.md), and [SECURITY.md](SECURITY.md).

## Related

- `px-token-transfer-tax-burn-treasury` — one tax split into burn and treasury, including a 1-unit dust transfer
- `px-treasury-incoming-fee-splitter` — last leg absorbs floor remainder
- `px-stake-ft-single-sided-vault` — floor on the way in, ceil on the way out

## Run

```bash
npm test
node invariants/demo.mjs
```

MIT — Pixel Journey
