import { vosforByArcane } from "../data/arcanes/dissolutionData.js";
import { copiesToMax } from "./processArcaneSalesData.js";

export default function calculateDissolutionValues(arcane, packs, rank = null) {
  const baseVosfor = vosforByArcane.get(arcane.id) ?? null;

  const calculateForRank = (targetRank) => {
    const copies = targetRank === "maxed" ? copiesToMax(arcane.maxRank) : 1;
    const vosfor = baseVosfor == null ? null : baseVosfor * copies;
    const sales = arcane.valuations?.[targetRank];
    // No reported trades is unknown, not evidence an Arcane is worthless.
    const sellValue =
      sales?.volume > 0 && Number.isFinite(sales.average) && sales.average > 0
        ? sales.average
        : null;
    const comparisons = packs
      .map((pack) => {
        const expectedValue =
          vosfor > 0 &&
          Number.isFinite(pack.packValue) &&
          pack.packValue >= 0 &&
          Number.isFinite(pack.vosforCost) &&
          pack.vosforCost > 0
            ? (vosfor / pack.vosforCost) * pack.packValue
            : null;
        const gain =
          expectedValue != null && sellValue != null
            ? expectedValue - sellValue
            : null;
        return {
          ...pack,
          expectedValue,
          gain,
          perCopy: {
            expectedValue:
              expectedValue == null ? null : expectedValue / copies,
            gain: gain == null ? null : gain / copies,
          },
        };
      })
      .sort((a, b) => (b.expectedValue ?? -1) - (a.expectedValue ?? -1));

    return {
      copies,
      vosfor,
      sellValue,
      perCopy: {
        vosfor: baseVosfor,
        sellValue: sellValue == null ? null : sellValue / copies,
      },
      comparisons,
      profitablePacks: comparisons.filter((pack) => pack.perCopy.gain > 1e-8),
      best: comparisons.find((pack) => pack.expectedValue != null) ?? null,
    };
  };

  if (rank) {
    return calculateForRank(rank);
  }

  return {
    unranked: calculateForRank("unranked"),
    maxed: calculateForRank("maxed"),
  };
}
