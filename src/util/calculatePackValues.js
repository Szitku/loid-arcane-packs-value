export default function calculatePackValues(
  arcanes,
  excludedArcaneIds = new Set(),
) {
  const excludedSet =
    excludedArcaneIds instanceof Set
      ? excludedArcaneIds
      : new Set(excludedArcaneIds || []);
  const safeArcanes = Array.isArray(arcanes) ? arcanes : [];

  // Excluded drops still occur, but contribute no platinum to the return.
  // Keep the original drop weights rather than redistributing their probability.
  const includedArcanes = safeArcanes.filter(
    (arcane) => !excludedSet.has(arcane.id),
  );

  return Object.fromEntries(
    ["unranked", "maxed"].map((strategy) => {
      const complete =
        safeArcanes.length > 0 &&
        includedArcanes.every(
          (arcane) => arcane?.valuations?.[strategy]?.weightedValue != null,
        );

      let totalWeightedValue = 0;
      let totalVolume = 0;
      let soldArcanesCount = 0;
      for (const arcane of includedArcanes) {
        const val = arcane?.valuations?.[strategy];
        totalWeightedValue += val?.weightedValue ?? 0;
        const vol = val?.volume;
        if (Number.isFinite(vol) && vol > 0) {
          totalVolume += vol;
          soldArcanesCount += 1;
        }
      }

      return [
        strategy,
        {
          totalWeightedValue: complete ? totalWeightedValue : null,
          packValue: complete ? totalWeightedValue * 3 : null,
          platPer100Vosfor: complete ? totalWeightedValue * 1.5 : null,
          totalVolume: complete ? totalVolume : null,
          soldArcanesCount: complete ? soldArcanesCount : null,
        },
      ];
    }),
  );
}
