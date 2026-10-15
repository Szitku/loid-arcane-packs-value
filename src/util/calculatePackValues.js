export default function calculatePackValues(arcanes) {
  return Object.fromEntries(["unranked", "maxed"].map((strategy) => {
    const complete = arcanes.length > 0 && arcanes.every(
      (arcane) => arcane.valuations[strategy].weightedValue !== null,
    );
    const totalWeightedValue = complete
      ? arcanes.reduce((sum, arcane) => sum + arcane.valuations[strategy].weightedValue, 0)
      : null;
    return [strategy, {
      totalWeightedValue,
      packValue: complete ? totalWeightedValue * 3 : null,
      platPer100Vosfor: complete ? totalWeightedValue * 1.5 : null,
    }];
  }));
}
