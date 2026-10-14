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

  const stats = arcaneStatisticsData?.payload?.statistics_closed?.["48hours"] || [];

  stats.forEach((statistics) => {
    if (statistics.mod_rank > 0) {
      numberOfMaxed++;
      volumeOfMaxed += statistics.volume || 0;
      medianPriceOfMaxedSummed += statistics.median || 0;
    } else {
      numberOfLvlZero++;
      volumeOfLvlZero += statistics.volume || 0;
      medianPriceOflvlZeroSummed += statistics.median || 0;
    }
  });

  const avgMedianOf48HoursMaxed =
    numberOfMaxed > 0 ? medianPriceOfMaxedSummed / numberOfMaxed : 0;

  const avgMedianOf48HourslvlZero =
    numberOfLvlZero > 0 ? medianPriceOflvlZeroSummed / numberOfLvlZero : 0;

  return {
    volumeOfMaxed,
    volumeOfLvlZero,
    avgMedianOf48HoursMaxed,
    avgMedianOf48HourslvlZero,
  };
};

export default processArcaneStatisticsData;
