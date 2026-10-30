import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isTaxDust,
  minAmountForNonDustTax,
  multiHopNet,
  rewardShare,
  taxBps,
} from "./dust.ts";

describe("taxBps", () => {
  it("pays tax on mid size",
    () => {
      const r = taxBps(10_000n, 30);
      assert.equal(r.tax, 30n);
      assert.equal(r.net, 9_970n);
    });

  it("dust on tiny amounts",
    () => {
      assert.equal(taxBps(1n, 30).tax, 0n);
      assert.equal(taxBps(333n, 30).tax, 0n);
      assert.equal(taxBps(334n, 30).tax, 1n);
    });
});

describe("minAmountForNonDustTax", () => {
  it("matches 30 bps threshold",
    () => {
      assert.equal(minAmountForNonDustTax(30), 334n);
      assert.equal(isTaxDust(333n, 30), true);
      assert.equal(isTaxDust(334n, 30), false);
    });

  it("bps 0 is always dust",
    () => {
      assert.equal(minAmountForNonDustTax(0), null);
    });
});

describe("rewardShare", () => {
  it("tiny share is zero",
    () => {
      assert.equal(rewardShare(100n, 1n, 10_000n), 0n);
    });
});

describe("multiHopNet", () => {
  it("stays non-negative",
    () => {
      assert.ok(multiHopNet(10_000n, 30, 3) >= 0n);
    });
});
