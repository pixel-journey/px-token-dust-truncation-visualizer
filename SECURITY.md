# Security notes

- No keys, wallets, or signing in this package.
- Amounts are capped with `MAX_AMOUNT` for educational parity with int64-ish ranges — not a full Antelope asset serializer.
- Do not ship “0.30% fee” marketing without documenting dust thresholds.
- Dust does not authorize minting: multi-hop only reduces net.
