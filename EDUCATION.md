# Education — integer dust

## The pattern

```text
tax    = floor(amount * bps / 10000)
reward = floor(pool * shares / totalShares)
```

A **positive** `amount` or `shares` can still produce **zero** tax or reward.

That is not a TypeScript quirk. The same floor behavior appears in C++ `int64_t` / `__int128` contract code when you divide after multiply.

## What `npm test` demonstrates

1. Mid-size transfer (10000 at 30 bps) pays non-zero tax.
2. Tiny transfers (1…333 at 30 bps) pay **zero** tax — pure dust.
3. First non-dust threshold at 30 bps is 334 (`minAmountForNonDustTax(30)`).
4. 1-share claim against pool 100 / totalShares 10000 pays **0**.
5. First paying share count is 100 (`minSharesForNonDustReward`).
6. Multi-hop nets stay non-negative; tax taken = amount − net.
7. `countDustAmounts(30, 334)` is 333.

## Teaching use

- Before writing a taxed token, list `minAmountForNonDustTax(bps)`.
- Before shipping a farm, unit-test the smallest share a user can hold.
- Do not document “always 0.30% fee” if dust paths exist unless you also document the floor.
- Prefer WharfKit if a host app later signs Antelope actions around such math.

## CLI walkthrough

```bash
node invariants/demo.mjs
```

## Myths

See `myths.ts`.

## What this repo is not

- Not wasm
- Not a full eosio.token
- Not a claim about any live PIXA/WAX token’s current tax code
