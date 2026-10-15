import { summarizeRankSales } from "./processArcaneStatisticsData.js";

export const copiesToMax = (maxRank) => ((maxRank + 1) * (maxRank + 2)) / 2;

const processArcaneSalesData = (statistics, arcane) => {
  const copies = copiesToMax(arcane.maxRank);
  const unranked = summarizeRankSales(statistics, 0);
  const maxed = summarizeRankSales(statistics, arcane.maxRank);
  const valuation = (prices, divisor) => ({
    average: prices.average ?? 0,
    volume: prices.volume,
    perCopy: (prices.average ?? 0) / divisor,
    weightedValue: ((prices.average ?? 0) / divisor) * arcane.weight,
  });
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
