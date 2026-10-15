import { summarizeRankSales } from "./processArcaneStatisticsData.js";

export const copiesToMax = (maxRank = 5) => {
  const rank = Number.isFinite(maxRank) && maxRank >= 0 ? maxRank : 5;
  return ((rank + 1) * (rank + 2)) / 2;
};

const processArcaneSalesData = (statistics, arcane) => {
  const copies = copiesToMax(arcane.maxRank);
  const unranked = summarizeRankSales(statistics, 0);
  const maxed = summarizeRankSales(statistics, arcane.maxRank);

  const valuation = (prices, divisor) => {
    const avg = prices.average ?? 0;
    const perCopy = divisor > 0 ? avg / divisor : 0;
    return {
      average: avg,
      volume: prices.volume || 0,
      perCopy,
      weightedValue: perCopy * (arcane.weight || 0),
    };
  };

  return {
    ...arcane,
    copiesToMax: copies,
    valuations: {
      unranked: valuation(unranked, 1),
      maxed: valuation(maxed, copies),
    },
  };
};

export default processArcaneSalesData;
