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
  {
    myth: "Multi-hop dust invents tokens",
    reality:
      "multiHopNet only reduces via repeated floor tax; net stays ≥ 0; tax taken = amount − net.",
  },
  {
    myth: "0.30% always means 30 of every 10000 units",
    reality:
      "Only once amount ≥ minAmountForNonDustTax(30). Below that, effective rate is 0.",
  },
] as const;

export const GLOSSARY = [
  {
    term: "taxBps",
    meaning: "floor(amount * bps / 10000) plus net = amount − tax.",
  },
  {
    term: "minAmountForNonDustTax",
    meaning: "Smallest amount with tax ≥ 1 at a given bps (null if bps is 0).",
  },
  {
    term: "rewardShare",
    meaning: "floor(pool * shares / totalShares).",
  },
  {
    term: "isTaxDust",
    meaning: "amount > 0 but tax is 0.",
  },
] as const;
