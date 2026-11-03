/**
 * Offline CLI walkthrough — no network.
 *   node invariants/demo.mjs
 */
import {
  isTaxDust,
  minAmountForNonDustTax,
  multiHopNet,
  rewardShare,
  taxBps,
} from "./dust.ts";

console.log("px-token-dust-truncation-visualizer — educational CLI\n");

const mid = taxBps(10_000n, 30);
console.log("taxBps(10000, 30) →", mid);

console.log("isTaxDust(333, 30) →", isTaxDust(333n, 30));
console.log("isTaxDust(334, 30) →", isTaxDust(334n, 30));
console.log("minAmountForNonDustTax(30) →", minAmountForNonDustTax(30)?.toString());

console.log(
  "rewardShare(100, 1, 10000) →",
  rewardShare(100n, 1n, 10_000n).toString()
);
console.log("multiHopNet(10000, 30, 3) →", multiHopNet(10_000n, 30, 3).toString());
console.log("\nNot a live token. See EDUCATION.md.");
