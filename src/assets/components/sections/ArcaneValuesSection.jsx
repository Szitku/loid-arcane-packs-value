import React, { useState } from "react";

const ArcaneValuesSections = ({
  fetchedArcanes,
  loadingTiles,
  weightedArcaneCollections,
  activeTab,
}) => {
  // Sorting state
  const [sortBy, setSortBy] = useState("none"); // "none", "average", "weighted"
  const [sortDir, setSortDir] = useState("desc"); // "asc" or "desc"

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
        setSortDir("desc");
      }
    } else {
      setSortBy(column);
      setSortDir("desc");
    }
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
                  The name of the arcane. Click to view on Warframe Market.
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
                return (
                  <li
                    key={arcane.id || idx}
                    className={`${rarityBg} border ${rarityBorder} border-[1.5px] rounded-lg p-3 flex justify-between items-center`}
                  >
                    <span
                      className={`w-1/3 ${rarityText} font-semibold truncate`}
                    >
                      <a
                        href={`https://warframe.market/items/${arcane.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-blue-400 transition-colors"
                      >
                        {arcane.name}
                      </a>
                    </span>
                    <span className={`w-1/3 ${rarityText} text-center`}>
                      {arcane.avgPlatinum.toFixed(2)}({arcane.cheapestPlatinum})
                    </span>
                    <span className={`w-1/3 ${rarityText} text-right`}>
                      {arcane.weightedValue.toFixed(2)}(
                      {arcane.cheapestWeightedValue.toFixed(2)})
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default ArcaneValuesSections;
