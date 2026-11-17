# Tips — integer dust is a product bug, not a rounding nicety

`floor(amount * bps / 10000)` is 0 for every positive amount below `ceil(10000 / bps)`.

| bps | First amount that pays tax 1 |
| --- | --- |
| 30 | **334** |
| 1 | **10000** |
| 0 | never (`null`) |

Amount 0 is not dust. Dust means a **positive** input collapsed to a 0 fee or 0 reward.

## Do

- Publish the minimum next to the marketing rate ("0.30% above 333 units").
- Test multi-hop nets. Floors compound. The 3-hop test locks conservation, not one magic net.
- Use a wide intermediate for `amount * bps` in C++ before the divide.

## Don't

- Say this file is the live PIXA tax. See `myths.ts`.
- Mark a 0-reward claim as consumed. You deleted the user's share of the pool.
- Mix this with exact DEX delivery. [dex tax](https://github.com/pixel-journey/px-token-dex-differentiated-tax) keeps the pool's amount intact. [transfer tax](https://github.com/pixel-journey/px-token-transfer-tax-burn-treasury) shrinks the recipient.

## Common mistakes

1. Advertising 0.30% and taking 0 on a 333-unit transfer.
2. Using `amount * 0.003` in JavaScript and then wondering why the chain disagrees.
3. Copying `rewardShare` into a farm without an accumulator scale. The chef lab uses a scale so small stakers are not stuck at 0 as fast.
4. Calling a 100% tax "dust." Tax 500 on amount 500 is confiscation, not dust.

## Nice-to-have rules (not implemented here)

| Rule | Tradeoff |
| --- | --- |
| Minimum tax of 1 | Small transfers always pay; can drain dust accounts |
| Round half up | Different dust boundary; retest every neighbor |
| Higher precision | PXJ stays 8 in this org; do not "fix" dust by changing PXJ precision |

Path: [TREASURY-TOKEN-LEARNING-PATH](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/TREASURY-TOKEN-LEARNING-PATH.md).
