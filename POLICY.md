# Policy — token dust truncation lab

**Trust:** private educational lab (Tier A)  
**Updated:** 2026-10-31

## In scope

- Pure bigint `taxBps`, `rewardShare`, `multiHopNet`, `minAmountForNonDustTax`
- Executed unit tests via `npm test`

## Out of scope

- Deployed eosio.token / wasm in this tree
- Claims about any live WAX token’s tax schedule

## Rules

- Tests never require network
- Document floors in product copy when dust paths exist
