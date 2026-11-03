# Policy — dust truncation lab

**Trust label:** `educational-reference`  
**Updated:** 2026-11-03

## In scope

- Pure integer tax/reward dust helpers under `invariants/`
- Offline unit tests and CLI demo

## Out of scope

- Deployed token wasm
- Claims about live PIXA / any mainnet tax schedule
- Network calls

## Rules

1. `npm test` never requires network.
2. Docs must document floor behavior, not “always X%”.
3. Prefer WharfKit if a future host adds intentional chain actions.
