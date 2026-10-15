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

      const totalWeightedValue = complete
        ? includedArcanes.reduce(
            (sum, arcane) =>
              sum + (arcane?.valuations?.[strategy]?.weightedValue ?? 0),
            0,
          )
        : null;

      return [
        strategy,
        {
          totalWeightedValue,
          packValue: complete ? totalWeightedValue * 3 : null,
          platPer100Vosfor: complete ? totalWeightedValue * 1.5 : null,
        },
      ];
    }),
  );
}
