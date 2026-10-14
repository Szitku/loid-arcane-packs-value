const processArcaneOrderData = (arcaneOrderData, arcane) => {
  const orders = arcaneOrderData?.data?.sell || [];
  const avgPlatinum =
    orders.length > 0
      ? orders.reduce((sum, o) => sum + o.platinum, 0) / orders.length
      : 0;
  const weightedValue = avgPlatinum * arcane.weight;
  const cheapestPlatinum = orders[0]?.platinum || 0;
  const cheapestWeightedValue = cheapestPlatinum * arcane.weight;

  return {
    ...arcane,
    id: arcane.id,
    rarity: arcane.rarity,
    name: arcane.name,
    weight: arcane.weight,
    maxRank: arcane.maxRank,
    avgPlatinum,
    cheapestPlatinum,
    weightedValue,
    cheapestWeightedValue,
  };
};

export default processArcaneOrderData;
