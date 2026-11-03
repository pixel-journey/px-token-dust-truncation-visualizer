import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  compareTaxBps,
  countDustAmounts,
  isRewardDust,
  isTaxDust,
  minAmountForNonDustTax,
  minSharesForNonDustReward,
  multiHopNet,
  multiHopTaxTaken,
  rewardShare,
  taxBps,
} from "./dust.ts";

describe("taxBps", () => {
  it("pays tax on mid size", () => {
    const r = taxBps(10_000n, 30);
    assert.equal(r.tax, 30n);
    assert.equal(r.net, 9_970n);
  });

  it("dust on tiny amounts", () => {
    assert.equal(taxBps(1n, 30).tax, 0n);
    assert.equal(taxBps(333n, 30).tax, 0n);
    assert.equal(taxBps(334n, 30).tax, 1n);
  });

  it("10000 bps takes everything", () => {
    assert.equal(taxBps(500n, 10_000).tax, 500n);
    assert.equal(taxBps(500n, 10_000).net, 0n);
  });
});

describe("minAmountForNonDustTax", () => {
  it("matches 30 bps threshold", () => {
    assert.equal(minAmountForNonDustTax(30), 334n);
    assert.equal(isTaxDust(333n, 30), true);
    assert.equal(isTaxDust(334n, 30), false);
  });

  it("bps 0 is always dust", () => {
    assert.equal(minAmountForNonDustTax(0), null);
  });

  it("1 bps threshold is 10000", () => {
    assert.equal(minAmountForNonDustTax(1), 10_000n);
  });
});

describe("rewardShare", () => {
  it("tiny share is zero", () => {
    assert.equal(rewardShare(100n, 1n, 10_000n), 0n);
    assert.equal(isRewardDust(100n, 1n, 10_000n), true);
  });

  it("half pool half shares", () => {
    assert.equal(rewardShare(100n, 50n, 100n), 50n);
  });
});

describe("minSharesForNonDustReward", () => {
  it("finds first paying share", () => {
    // pool 100, total 10000 → need ceil(10000/100)=100 shares for reward ≥ 1
    assert.equal(minSharesForNonDustReward(100n, 10_000n), 100n);
    assert.equal(rewardShare(100n, 99n, 10_000n), 0n);
    assert.equal(rewardShare(100n, 100n, 10_000n), 1n);
  });
});

describe("multiHopNet", () => {
  it("stays non-negative", () => {
    assert.ok(multiHopNet(10_000n, 30, 3) >= 0n);
  });

  it("tax taken equals amount - net", () => {
    const amount = 10_000n;
    const taken = multiHopTaxTaken(amount, 30, 3);
    assert.equal(taken + multiHopNet(amount, 30, 3), amount);
  });
});

describe("compareTaxBps", () => {
  it("higher bps takes at least as much tax", () => {
    const c = compareTaxBps(10_000n, 50, 30);
    assert.ok(c.taxDelta >= 0n);
  });
});

describe("countDustAmounts", () => {
  it("counts 1..333 as dust at 30 bps", () => {
    assert.equal(countDustAmounts(30, 333n), 333n);
    assert.equal(countDustAmounts(30, 334n), 333n);
  });
});
