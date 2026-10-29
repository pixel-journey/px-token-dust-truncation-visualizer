# px-token-dust-truncation-visualizer

> **Trust:** private educational lab (Tier A)  
> **Quest:** 113 — `px-token-dust-truncation-visualizer`  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**One-sentence goal:** Show, with **real executable tests**, how integer tax and pro-rata reward math **truncate to zero** (“dust”) so contract authors do not assume every positive balance produces a positive fee or payout.

This is **real TypeScript code** that `npm test` runs. It is **not** a deployed eosio.token, **not** wasm, and **not** a mainnet claim.

---

## What is true (executed)

| Rule | Result |
|------|--------|
| `taxBps(10000n, 30)` | `{ tax: 30n, net: 9970n }` |
| `taxBps(1n, 30)` | `{ tax: 0n, net: 1n }` — pure dust |
| `taxBps(333n, 30)` | still dust; `334n` pays `1n` |
| `rewardShare(100n, 1n, 10000n)` | `0n` |
| Negative amounts / bad bps / zero totalShares | refused |

```bash
npm test
```

---

## Why this is educational “real code”

Antelope asset math is integer. Basis-point tax is typically:

```text
tax = amount * bps / 10000   (floor)
```

For small `amount` or small `bps`, **tax is 0** even though `amount > 0`. The same pattern appears in MasterChef-style `pool * shares / totalShares` rewards.

Authors who only test “large round numbers” never see dust. This lab forces the edge cases into unit tests.

---

## Layout

| Path | Role |
|------|------|
| `invariants/dust.ts` | Pure rules (`bigint`) |
| `invariants/dust.test.ts` | Executed claims |
| `EDUCATION.md` | Pitfalls and teaching notes |
| `SECURITY.md` | How dust interacts with economic assumptions |

Optional C++ sketch can be added later under `contracts/src/` and labeled uncompiled until a CDT pin produces wasm.

---

## Related seeded neighbors

- `px-token-dex-differentiated-tax` — exact DEX delivery (different rule)
- `px-stake-nft-custodial-masterchef` — acc-per-share at 1e12
- Template: `px-antelope-contract-template`

## License

MIT — Pixel Journey
