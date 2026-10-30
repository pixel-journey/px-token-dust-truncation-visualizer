# Education

## The pattern

Integer division discards the fractional part. In fee and reward code that looks like:

```text
tax    = amount * bps / 10000
reward = pool * shares / totalShares
```

a **positive** `amount` or `shares` can still produce **zero** tax or reward.

That is not a TypeScript quirk. The same floor behavior appears in C++ `int64_t` / `__int128` contract code when you divide after multiply.

## What `npm test` demonstrates

1. A comfortable mid-size transfer (10000 at 30 bps) pays a non-zero tax.
2. Tiny transfers (1…333 at 30 bps) pay **zero** tax — pure dust.
3. The first non-dust threshold at 30 bps is 334 (`minAmountForNonDustTax(30)`).
4. A 1-share claim against a 100-unit pool and 10000 total shares pays **0**.
5. Multi-hop nets stay non-negative; dust does not invent tokens.

## Teaching use

- Before writing a taxed token, list the minimum amount that produces `tax >= 1` at your bps (`minAmountForNonDustTax`).
- Before shipping a farm, unit-test the smallest share a user can hold.
- Do not document “always 0.30% fee” if dust paths exist unless you also document the floor.

## Myths

See `myths.ts` — positive balance ≠ positive tax; this is not live token code; pro-rata can still be zero.

## What this repo is not

- Not wasm
- Not a full eosio.token
- Not a claim about any live PIXA/WAX token’s current tax code
