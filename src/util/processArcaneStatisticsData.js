export const summarizeRankSales = (data, rank) => {
  const intervals = data?.payload?.statistics_closed?.["48hours"] || [];
  let volume = 0;
  let totalValue = 0;

  for (const interval of intervals) {
    if (interval.mod_rank !== rank) continue;
    const price = interval.wa_price;
    if (
      !Number.isFinite(price) ||
      price <= 0 ||
      !Number.isFinite(interval.volume) ||
      interval.volume <= 0
    ) {
      continue;
    }
    volume += interval.volume;
    totalValue += price * interval.volume;
  }

  return { average: volume > 0 ? totalValue / volume : null, volume };
};

export const extractArcaneStatistics = (data, maxRank = 5) => {
  const unranked = summarizeRankSales(data, 0);
  const maxed = summarizeRankSales(data, maxRank);
  return {
    volumeOfMaxed: maxed.volume,
    volumeOfLvlZero: unranked.volume,
    avgPriceMaxed: maxed.average,
    avgPriceLvlZero: unranked.average,
  };
};

export default extractArcaneStatistics;
