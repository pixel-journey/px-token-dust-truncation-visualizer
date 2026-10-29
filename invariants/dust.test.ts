import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  taxBps,
  rewardShare,
  multiHopNet,
  isTaxDust,
  MAX_AMOUNT,
} from "./dust.ts";

describe("taxBps", () => {
  it("30 bps on 10000 yields tax 30 net 9970", () => {
    assert.deepEqual(taxBps(10_000n, 30), { tax: 30n, net: 9_970n });
  });

  it("1 unit at 30 bps is pure dust (tax 0)", () => {
    assert.deepEqual(taxBps(1n, 30), { tax: 0n, net: 1n });
    assert.equal(isTaxDust(1n, 30), true);
  });

  it("333 units at 30 bps still dust", () => {
    // floor(333 * 30 / 10000) = floor(0.999) = 0
    assert.deepEqual(taxBps(333n, 30), { tax: 0n, net: 333n });
  });

  it("334 units at 30 bps pays 1", () => {
    assert.deepEqual(taxBps(334n, 30), { tax: 1n, net: 333n });
  });

  it("refuses negative amount", () => {
    assert.throws(() => taxBps(-1n, 30), /negative/);
  });

  it("refuses bps above 10000", () => {
    assert.throws(() => taxBps(100n, 10001), /bps/);
  });

  it("refuses amount above MAX_AMOUNT", () => {
    assert.throws(() => taxBps(MAX_AMOUNT + 1n, 1), /MAX_AMOUNT/);
  });
});

describe("rewardShare", () => {
  it("pays floor share of pool", () => {
    assert.equal(rewardShare(1_000_000n, 1n, 3n), 333_333n);
  });

  it("tiny share against large total is dust zero", () => {
    assert.equal(rewardShare(100n, 1n, 10_000n), 0n);
  });

  it("refuses zero totalShares", () => {
    assert.throws(() => rewardShare(100n, 1n, 0n), /totalShares/);
  });

  it("refuses shares above total", () => {
    assert.throws(() => rewardShare(100n, 5n, 3n), /exceed/);
  });
});

describe("multiHopNet", () => {
  it("two hops of 30 bps on 10000", () => {
    // 10000 -> 9970 -> floor(9970*30/10000)=29 -> 9941
    assert.equal(multiHopNet(10_000n, 30, 2), 9_941n);
  });

  it("many hops on dust-sized amount stay non-negative", () => {
    assert.equal(multiHopNet(1n, 30, 8), 1n);
  });
});
