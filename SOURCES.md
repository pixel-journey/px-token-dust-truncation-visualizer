# Sources

| Source | Use |
| --- | --- |
| [eosio.token](https://github.com/eosio/eosio.contracts) | Integer asset amounts |
| [docs.wax.io](https://docs.wax.io/) | Token patterns |
| [docs.eosnetwork.com](https://docs.eosnetwork.com/) | Asset type |

**At 30 bps**, amounts `1..333` pay tax **0**. First non-dust amount is **334**. Dust is a positive input that floors to a zero fee or reward — not amount 0, and not a 100% tax.

**PXJ precision is always 8** in this org; do not "fix" dust by changing precision.

## Related labs

| Lab | Topic |
| --- | --- |
| [transfer tax](https://github.com/pixel-journey/px-token-transfer-tax-burn-treasury) | Wallet tax split |
| [dex tax](https://github.com/pixel-journey/px-token-dex-differentiated-tax) | Exact pool delivery |
| [fee splitter](https://github.com/pixel-journey/px-treasury-incoming-fee-splitter) | Last-leg remainder |
| [masterchef](https://github.com/pixel-journey/px-stake-nft-custodial-masterchef) | Acc-per-share floors |
| [treasury path](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/TREASURY-TOKEN-LEARNING-PATH.md) | Curriculum + formulas |
