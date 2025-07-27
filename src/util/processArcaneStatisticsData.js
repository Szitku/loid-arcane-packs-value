const processArcaneStatisticsData = (arcaneStatisticsData) => {
  // Number of maxed and lvl0
  let numberOfMaxed = 0;
  let numberOfLvlZero = 0;

  // Volume sold
  let volumeOfMaxed = 0;
  let volumeOfLvlZero = 0;

  // Summed amount
  let medianPriceOfMaxedSummed = 0;
  let medianPriceOflvlZeroSummed = 0;

  arcaneStatisticsData?.payload?.statistics_closed["48hours"].map(
    (statistics) => {
      if (statistics.mod_rank > 0) {
        numberOfMaxed++;
        volumeOfMaxed += statistics.volume;
        medianPriceOfMaxedSummed += statistics.median;
      } else {
        numberOfLvlZero++;
        volumeOfLvlZero += statistics.volume;
        medianPriceOflvlZeroSummed += statistics.median;
      }
    }
  );

  const avgMedianOf48HoursMaxed = medianPriceOfMaxedSummed / numberOfMaxed;
  const avgMedianOf48HourslvlZero =
    medianPriceOflvlZeroSummed / numberOfLvlZero;

  return {
    volumeOfMaxed,
    volumeOfLvlZero,
    avgMedianOf48HoursMaxed,
    avgMedianOf48HourslvlZero,
  };
};

export default processArcaneStatisticsData;
