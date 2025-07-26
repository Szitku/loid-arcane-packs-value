import React from "react";

const ArcaneValuesSections = ({
  fetchedArcanes,
  loadingTiles,
  avgWeightedValues,
}) => {
  return (
    <>
      {/* Fetched Arcanes List or Loading */}
      {loadingTiles.has("cavia") ? (
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
              Fetched Arcanes (Cavia)
            </h2>
            <div className="mb-2 flex justify-between px-3 font-semibold text-blue-400">
              <span className="w-1/3">Arcane Name</span>
              <span className="w-1/3 text-center">Average</span>
              <span className="w-1/3 text-right">Weighted</span>
            </div>
            <ul className="space-y-2">
              {(fetchedArcanes.get("cavia") || []).map((arcane, idx) => {
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
                      {arcane.avgPlatinum.toFixed(2)}
                    </span>
                    <span className={`w-1/3 ${rarityText} text-right`}>
                      {arcane.weightedValue.toFixed(2)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          {/* Avg Weighted Value */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-blue-100">
              Total Weighted Value
            </h3>
            <div className="text-2xl font-bold text-green-400">
              {avgWeightedValues.get("cavia") !== undefined
                ? avgWeightedValues.get("cavia").toFixed(2)
                : "-"}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ArcaneValuesSections;
