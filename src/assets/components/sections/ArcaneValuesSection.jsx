import React, { useState } from "react";
import ArcaneDetailModal from "./ArcaneDetailModal";
import processArcaneStatisticsData from "../../../util/processArcaneStatisticsData";

const ArcaneValuesSections = ({
  fetchedArcanes,
  loadingTiles,
  weightedArcaneCollections,
  activeTab,
}) => {
  // Sorting state
  const [sortBy, setSortBy] = useState("none"); // "none", "average", "weighted"
  const [sortDir, setSortDir] = useState(""); // "asc" or "desc"

  // Modal state
  const [selectedArcane, setSelectedArcane] = useState(null);
  const [arcaneStatistics, setArcaneStatistics] = useState(new Map());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingArcaneDetails, setLoadingArcaneDetails] = useState(false);

  // Sorting logic
  const getSortedArcanes = () => {
    const arcanes = fetchedArcanes.get(activeTab) || [];
    if (sortBy === "none") return arcanes;
    const sorted = [...arcanes].sort((a, b) => {
      let valA, valB;
      if (sortBy === "average") {
        valA = a.avgPlatinum;
        valB = b.avgPlatinum;
      } else if (sortBy === "weighted") {
        valA = a.weightedValue;
        valB = b.weightedValue;
      }
      if (sortDir === "asc") return valA - valB;
      else return valB - valA;
    });
    return sorted;
  };

  // Click handlers for sorting (cycle: desc → asc → none)
  const handleSort = (column) => {
    if (sortBy === column) {
      if (sortDir === "desc") {
        setSortDir("asc");
      } else if (sortDir === "asc") {
        setSortBy("none");
        setSortDir("");
      }
    } else {
      setSortBy(column);
      setSortDir("desc");
    }
  };

  // Handle arcane item click with loading state
  const handleArcaneClick = async (arcane, event) => {
    // Prevent opening modal if clicking on the market link
    if (event.target.tagName === "A") return;

    // Prevent multiple clicks while loading
    if (loadingArcaneDetails) return;

    setLoadingArcaneDetails(true);
    setSelectedArcane(arcane);

    try {
      // Check if we already have statistics for this arcane
      if (!arcaneStatistics.has(arcane.id)) {
        const response = await fetch(
          `https://corsproxy.io/?https://api.warframe.market/v1/items/${arcane.id}/statistics`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const arcaneStatisticsData = await response.json();
        const processedData = processArcaneStatisticsData(arcaneStatisticsData);

        // Update the statistics map
        setArcaneStatistics((prevStats) => {
          const newStats = new Map(prevStats);
          newStats.set(arcane.id, processedData);
          return newStats;
        });
      }

      // Only open modal after data is loaded
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch arcane statistics:", error);
      // You might want to show an error state or notification here
      // For now, we'll still open the modal but without the statistics
      setIsModalOpen(true);
    } finally {
      setLoadingArcaneDetails(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArcane(null);
  };

  return (
    <>
      {/* Fetched Arcanes List or Loading */}
      {loadingTiles.has(activeTab) ? (
        <div className="flex flex-col items-center justify-center py-12">
          <svg
            className="animate-spin h-8 w-8 text-blue-400 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span className="text-blue-300 text-lg">Loading arcanes...</span>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-blue-100 mb-2">
              Fetched Arcanes (
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)})
            </h2>
            {/* Avg Weighted Value */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-blue-100 cursor-help inline-block relative group">
                Total Weighted Value:
                <span className="absolute left-0 bottom-full mb-1 hidden group-hover:block bg-black/90 text-xs text-white rounded px-2 py-1 z-10 whitespace-nowrap pointer-events-none">
                  Sum of all arcanes' weighted values (average price × drop
                  weight). This would be the price you would sell a maxed out
                  arcane on average.
                </span>
              </h3>
              <div className="text-2xl font-bold text-green-400 cursor-help relative group inline-block ml-2">
                {weightedArcaneCollections.current.get(activeTab)
                  .totalWeightedValue !== undefined
                  ? weightedArcaneCollections.current
                      .get(activeTab)
                      .totalWeightedValue.toFixed(2)
                  : "-"}
                (
                {weightedArcaneCollections.current.get(activeTab)
                  .totalWeightedValueWithCheapest !== undefined
                  ? weightedArcaneCollections.current
                      .get(activeTab)
                      .totalWeightedValueWithCheapest.toFixed(2)
                  : "-"}
                )
                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block bg-black/90 text-xs text-white rounded px-2 py-1 z-10 whitespace-nowrap pointer-events-none">
                  First value: sum of weighted averages. Value in parentheses:
                  sum using the cheapest price for each arcane.
                </span>
              </div>
            </div>
            <div className="mb-2 flex justify-between px-3 font-semibold text-blue-400">
              <span className="w-1/3 cursor-help relative group">
                Arcane Name
                <span className="absolute left-0 bottom-full mb-1 hidden group-hover:block bg-black/90 text-xs text-white rounded px-2 py-1 z-10 whitespace-nowrap pointer-events-none">
                  Click on any arcane item to view detailed statistics and
                  market data
                </span>
              </span>
              <span
                className="w-1/3 text-center cursor-pointer cursor-help relative group select-none"
                onClick={() => handleSort("average")}
              >
                Average
                <span className="ml-1 text-xs">
                  {sortBy === "average" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                </span>
                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block bg-black/90 text-xs text-white rounded px-2 py-1 z-10 whitespace-nowrap pointer-events-none">
                  Average price of the 5 cheapest ingame orders. Value in
                  parentheses is the single cheapest.
                </span>
              </span>
              <span
                className="w-1/3 text-right cursor-pointer cursor-help relative group select-none"
                onClick={() => handleSort("weighted")}
              >
                Weighted
                <span className="ml-1 text-xs">
                  {sortBy === "weighted" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                </span>
                <span className="absolute right-0 bottom-full mb-1 hidden group-hover:block bg-black/90 text-xs text-white rounded px-2 py-1 z-10 whitespace-nowrap pointer-events-none">
                  Weighted value = average price × arcane drop weight. Value in
                  parentheses is the cheapest weighted.
                </span>
              </span>
            </div>
            <ul className="space-y-2">
              {getSortedArcanes().map((arcane, idx) => {
                let rarityBg = "bg-blue-900/40";
                let rarityBorder = "border-blue-400";
                let rarityText = "text-blue-200";
                // Border, background, and text color logic
                if (arcane.rarity === "common") {
                  rarityBorder = "border-[#cd7f32]"; // bronze
                  rarityBg = "bg-[#3a2c1a]/80"; // dark bronze background
                  rarityText = "text-[#ffe6b3]"; // light bronze text
                } else if (arcane.rarity === "uncommon") {
                  rarityBorder = "border-[#c0c0c0]"; // silver
                  rarityBg = "bg-[#23272b]/80"; // dark silver/gray background
                  rarityText = "text-[#e0e0e0]"; // light silver text
                } else if (arcane.rarity === "rare") {
                  rarityBorder = "border-[#ffd700]"; // gold
                  rarityBg = "bg-[#3a320a]/80"; // dark gold background
                  rarityText = "text-[#ffe066]"; // gold text
                } else if (arcane.rarity === "legendary") {
                  rarityBorder = "border-white";
                  rarityBg =
                    "bg-gradient-to-r from-[#b6eaff]/80 via-[#e6f7ff]/60 to-[#b6eaff]/80";
                  rarityText = "text-[#1e3a5c]"; // deep blue text for contrast
                }

                // Show loading state for the currently loading arcane
                const isCurrentlyLoading =
                  loadingArcaneDetails && selectedArcane?.id === arcane.id;

                return (
                  <li
                    key={arcane.id || idx}
                    className={`${rarityBg} border ${rarityBorder} border-[1.5px] rounded-lg p-3 flex justify-between items-center cursor-pointer hover:brightness-110 hover:scale-[1.02] hover:shadow-lg transition-all duration-200 ${
                      isCurrentlyLoading ? "opacity-75" : ""
                    } relative group`}
                    onClick={(e) => handleArcaneClick(arcane, e)}
                  >
                    <span
                      className={`w-1/3 ${rarityText} font-semibold truncate flex items-center`}
                    >
                      <a
                        href={`https://warframe.market/items/${arcane.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-blue-400 transition-colors"
                      >
                        {arcane.name}
                      </a>
                      {isCurrentlyLoading && (
                        <svg
                          className="animate-spin h-4 w-4 ml-2 text-blue-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                      )}
                    </span>
                    <span className={`w-1/3 ${rarityText} text-center`}>
                      {arcane.avgPlatinum.toFixed(2)}({arcane.cheapestPlatinum})
                    </span>
                    <span
                      className={`w-1/3 ${rarityText} text-right flex items-center justify-end`}
                    >
                      {arcane.weightedValue.toFixed(2)}(
                      {arcane.cheapestWeightedValue.toFixed(2)})
                      {/* Click indicator */}
                      <svg
                        className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}

      {/* Detail Modal */}
      <ArcaneDetailModal
        arcane={selectedArcane}
        isOpen={isModalOpen}
        onClose={closeModal}
        arcaneStatistics={arcaneStatistics}
      />
    </>
  );
};

export default ArcaneValuesSections;
