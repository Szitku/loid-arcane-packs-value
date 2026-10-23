import assert from "node:assert/strict";
import test from "node:test";
import calculateDissolutionValues from "../src/util/calculateDissolutionValues.js";
import calculatePackValues from "../src/util/calculatePackValues.js";

const packs = [{ id: "target", vosforCost: 200, packValue: 20 }];
const makeArcane = (maxRank = 5) => ({
  id: "pax_bolt",
  maxRank,
  valuations: {
    unranked: { volume: 10, average: 2, weightedValue: 2 },
    maxed: { volume: 10, average: 42, weightedValue: 2 },
  },
});

test("rank 5 does not inflate per-copy returns or gains for equal investment", () => {
  const values = calculateDissolutionValues(makeArcane(), packs);
  assert.equal(values.maxed.copies, 21);
  assert.equal(values.maxed.vosfor, values.unranked.vosfor * 21);
  assert.equal(values.maxed.sellValue, 42);
  assert.equal(values.maxed.perCopy.sellValue, 2);
  assert.equal(values.maxed.perCopy.vosfor, values.unranked.perCopy.vosfor);
  assert.equal(
    values.maxed.best.perCopy.expectedValue,
    values.unranked.best.perCopy.expectedValue,
  );
  assert.ok(
    Math.abs(
      values.maxed.best.perCopy.gain - values.unranked.best.perCopy.gain,
    ) < 1e-8,
  );
});

test("rank 3 divides by 10 copies, not 21", () => {
  const value = calculateDissolutionValues(makeArcane(3), packs, "maxed");
  assert.equal(value.copies, 10);
  assert.equal(value.perCopy.sellValue, 4.2);
  assert.equal(value.best.perCopy.expectedValue, value.best.expectedValue / 10);
  assert.equal(value.best.perCopy.gain, value.best.gain / 10);
  assert.equal(value.profitablePacks.length, 0);
});

test("normalized gains retain real rank premiums instead of erasing them", () => {
  const arcane = makeArcane();
  arcane.valuations.maxed.average = 84;
  const values = calculateDissolutionValues(arcane, packs);
  assert.equal(values.maxed.perCopy.sellValue, 4);
  assert.ok(values.maxed.best.perCopy.gain < 0);
  assert.ok(values.unranked.best.perCopy.gain > 0);
});

test("unknown yields and sales remain unknown after normalization", () => {
  const arcane = makeArcane();
  arcane.id = "unknown_arcane";
  arcane.valuations.maxed.volume = 0;
  const value = calculateDissolutionValues(arcane, packs, "maxed");
  assert.equal(value.perCopy.vosfor, null);
  assert.equal(value.perCopy.sellValue, null);
  assert.equal(value.best, null);
  assert.equal(value.comparisons[0].perCopy.expectedValue, null);
  assert.equal(value.comparisons[0].perCopy.gain, null);
});

test("all input/output rank combinations normalize pack returns only once", () => {
  const arcane = makeArcane();
  const packValues = calculatePackValues([arcane]);
  for (const inputRank of ["unranked", "maxed"]) {
    for (const outputRank of ["unranked", "maxed"]) {
      const targets = [{ ...packs[0], ...packValues[outputRank] }];
      const value = calculateDissolutionValues(arcane, targets, inputRank);
      assert.equal(value.best.perCopy.expectedValue, (36 / 200) * 6);
      assert.ok(
        Math.abs(value.best.perCopy.gain - ((36 / 200) * 6 - 2)) < 1e-8,
      );
    }
  }
});
