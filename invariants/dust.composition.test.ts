/**
 * Composition: multi-hop tax path and multi-claimer reward desk.
 * Dust amounts never pay tax; threshold is exact.
 * Many small claimers can sum to less than the pool (floor loss).
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  isTaxDust,
  minAmountForNonDustTax,
  minSharesForNonDustReward,
  multiHopNet,
  multiHopTaxTaken,
  rewardShare,
  taxBps,
} from "./dust.ts";

describe("composition: dust across hops and claimers", () => {
  it("threshold walk: below pays 0, at threshold pays 1, multi-hop conserves", () => {
    const bps = 30;
    const edge = minAmountForNonDustTax(bps)!;
    assert.equal(isTaxDust(edge - 1n, bps), true);
    assert.equal(taxBps(edge - 1n, bps).tax, 0n);
    assert.equal(taxBps(edge, bps).tax, 1n);

    const start = 10_000n;
    const net = multiHopNet(start, bps, 3);
    const taken = multiHopTaxTaken(start, bps, 3);
    assert.equal(net + taken, start);
    assert.ok(taken > 0n);
  });

  it("repeated dust hops stay at the same amount", () => {
    assert.equal(isTaxDust(100n, 30), true);
    assert.equal(multiHopNet(100n, 30, 8), 100n);
    assert.equal(multiHopTaxTaken(100n, 30, 8), 0n);
  });

  it("many tiny claimers leave floor remainder in the pool", () => {
    const pool = 100n;
    const totalShares = 10_000n;
    const claimers = 50;
    const sharesEach = 1n;
    let paid = 0n;
    for (let i = 0; i < claimers; i++) {
      paid += rewardShare(pool, sharesEach, totalShares);
    }
    assert.equal(paid, 0n);
    const need = minSharesForNonDustReward(pool, totalShares)!;
    assert.equal(need, 100n);
    assert.equal(rewardShare(pool, need, totalShares), 1n);
  });

  it("pro-rata claim desk: sum of floors can be less than pool", () => {
    const pool = 100n;
    const legs = [33n, 33n, 34n];
    const total = 100n;
    let paid = 0n;
    for (const s of legs) {
      paid += rewardShare(pool, s, total);
    }
    assert.equal(paid, 100n);

    const pool2 = 10n;
    const legs2 = [1n, 1n, 98n];
    const total2 = 100n;
    let paid2 = 0n;
    for (const s of legs2) {
      paid2 += rewardShare(pool2, s, total2);
    }
    assert.equal(rewardShare(pool2, 1n, total2), 0n);
    assert.equal(rewardShare(pool2, 98n, total2), 9n);
    assert.equal(paid2, 9n);
    assert.ok(paid2 < pool2);
  });
});
