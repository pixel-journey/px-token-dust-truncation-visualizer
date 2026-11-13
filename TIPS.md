# Tips — dust in token design

- Document the **minimum economic unit** users will notice (e.g. 334 units at 30 bps).
- Multi-hop DEX/tax paths can trap value in floors — test hops, not only single transfers.
- Prefer wide intermediates (`amount * bps` before divide) in production C++.
- Pair with [transfer-tax](https://github.com/pixel-journey/px-token-transfer-tax-burn-treasury) and [fee splitter](https://github.com/pixel-journey/px-treasury-incoming-fee-splitter).

Path: [TREASURY-TOKEN-LEARNING-PATH](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/TREASURY-TOKEN-LEARNING-PATH.md).
