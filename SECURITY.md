# Security — integer dust truncation

## Closed in tests

| Issue | Behavior |
| --- | --- |
| Bad bps / amount | refused |
| shares > totalShares | refused |
| totalShares 0 | refused |
| hops bounds | 1..32 |
| First non-dust at 30 bps | amount **334** pays tax 1; 333 is dust |

Dust means a **positive** input collapsed to a 0 fee or 0 reward. Amount 0 is not dust. Tax taking the entire amount is confiscation, not dust.

## Not closed (production)

| Concern | Guidance |
| --- | --- |
| Floating point | Forbidden — integer units only |
| Remainder ownership | Who receives floor leftovers (see fee splitter last leg) |
| Multi-hop grief | Floors compound; test conservation across hops |
| Product messaging | Publish minimum next to the marketing rate |
| Wide multiply | `amount * bps` before `/ 10000` |

## Attack angles

1. Advertising 0.30% and taking 0 on a 333-unit transfer.
2. Marking a 0-reward claim as consumed (deleted the user's share).
3. Using `amount * 0.003` in JS and expecting chain agreement.
4. Calling a 100% tax "dust."
5. "Fixing" dust by changing PXJ precision (org policy: **always 8**).

## Honesty limits

Math visualizer only — not the live PIXA tax. Related: [transfer tax](https://github.com/pixel-journey/px-token-transfer-tax-burn-treasury) · [dex tax](https://github.com/pixel-journey/px-token-dex-differentiated-tax) · [fee splitter](https://github.com/pixel-journey/px-treasury-incoming-fee-splitter).
