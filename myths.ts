export const DUST_MYTHS = [
  {
    myth: "A positive balance always produces a positive tax",
    reality:
      "floor(amount * bps / 10000) is often 0 for small amounts. Document the floor.",
  },
  {
    myth: "This is the live PIXA tax code",
    reality:
      "Pure educational bigint rules. Not wasm and not a claim about any mainnet token.",
  },
  {
    myth: "Pro-rata rewards always pay something",
    reality:
      "floor(pool * shares / totalShares) is 0 when shares are tiny relative to totalShares.",
  },
] as const;
