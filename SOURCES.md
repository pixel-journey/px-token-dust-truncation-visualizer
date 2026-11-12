# Official sources

Floor division is ordinary integer arithmetic. This lab makes the **dust** consequence explicit for tax and share math.

| Source | Use |
| --- | --- |
| [eosio.token reference](https://github.com/eosio/eosio.contracts) | Asset amounts as integers |
| [docs.wax.io](https://docs.wax.io/) | WAX development |
| [px-invariant-kit](https://github.com/pixel-journey/px-invariant-kit) | Shared `bps` helper |

## Domain map

| Repo | Role |
| --- | --- |
| [px-token-transfer-tax-burn-treasury](https://github.com/pixel-journey/px-token-transfer-tax-burn-treasury) | Tax that can dust |
| [px-treasury-incoming-fee-splitter](https://github.com/pixel-journey/px-treasury-incoming-fee-splitter) | Last leg absorbs remainder |
| [px-stake-ft-single-sided-vault](https://github.com/pixel-journey/px-stake-ft-single-sided-vault) | Floor in / ceil out |
| **This repo** | When floor is zero while input is positive |
