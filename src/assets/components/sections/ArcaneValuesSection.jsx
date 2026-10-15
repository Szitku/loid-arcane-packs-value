import React, { useState } from "react";
import { PlatinumIcon, VosforIcon, LotusIcon } from "../icons/WarframeIcons";
import { playUiClick } from "../../../util/soundEffects";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

const ArcaneValuesSections = ({
  fetchedArcanes,
  loadingTiles,
  weightedArcaneCollections,
  activeTab,
  searchQuery = "",
  rarityFilter = "all",
  strategy = "unranked",
  error,
}) => {
  // Sorting state
  const [sortBy, setSortBy] = useState("weighted"); // default to weighted
  const [sortDir, setSortDir] = useState("desc"); // default desc

  // Sorting and filtering logic
  const getProcessedArcanes = () => {
    let arcanes = (fetchedArcanes.get(activeTab) || []).map((arcane) => ({
      ...arcane,
      avgPlatinum: arcane.valuations[strategy].average,
      weightedValue: arcane.valuations[strategy].weightedValue,
    }));

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      arcanes = arcanes.filter((arcane) =>
        arcane.name.toLowerCase().includes(q),
      );
    }

    // Filter by rarity
    if (rarityFilter && rarityFilter !== "all") {
      arcanes = arcanes.filter(
        (arcane) =>
          (arcane.rarity || "").toLowerCase() === rarityFilter.toLowerCase(),
      );
    }

    // Sort
    if (sortBy === "none") return arcanes;
    return [...arcanes].sort((a, b) => {
      let valA, valB;
      if (sortBy === "average") {
        valA = a.avgPlatinum || 0;
        valB = b.avgPlatinum || 0;
      } else if (sortBy === "weighted") {
        valA = a.weightedValue || 0;
        valB = b.weightedValue || 0;
      } else if (sortBy === "name") {
        return sortDir === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === "weight") {
        valA = a.weight || 0;
        valB = b.weight || 0;
      }
      if (sortDir === "asc") return valA - valB;
      return valB - valA;
    });
  };

  // Click handlers for sorting
  const handleSort = (column) => {
    playUiClick();
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

  const allValues = weightedArcaneCollections.current.get(activeTab) || {};
  const collectionData = allValues[strategy] || {};
  const totalWeighted = collectionData.totalWeightedValue;
  const packValue = totalWeighted != null ? totalWeighted * 3 : null;
  const weightTotal = (fetchedArcanes.get(activeTab) || []).reduce(
    (sum, arcane) => sum + arcane.weight,
    0,
  );

  return (
    <div className="arcane-analysis space-y-4">
      {error && (
        <p role="alert" className="text-amber-300">
          {error}
        </p>
      )}
      {weightTotal > 0 && Math.abs(weightTotal - 1) > 0.001 && (
        <p role="alert" className="text-amber-300 text-sm">
          Warning: configured drop probabilities total{" "}
          {(weightTotal * 100).toFixed(2)}%, not 100%. These estimates are
          provisional until the drop table is corrected.
        </p>
      )}
      {/* Loading State */}
      {loadingTiles.has(activeTab) ? (
        <div className="analysis-loading flex flex-col items-center justify-center py-16 px-4 rounded-xl border">
          <div className="relative mb-4">
            <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
            <LotusIcon className="w-6 h-6 text-cyan-400 absolute inset-0 m-auto" />
          </div>
          <span className="text-cyan-300 font-semibold tracking-wider text-base">
            Fetching Warframe.Market sales history...
          </span>
          <span className="text-slate-500 text-xs mt-1 font-mono">
            Transmuting live market valuations for {activeTab.toUpperCase()}
          </span>
        </div>
      ) : (
        <>
          {/* Pack Value Analysis Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Full Pack Expected Value (3 Arcanes for 200 Vosfor) */}
            <div className="analysis-stat analysis-stat-primary p-4 rounded-lg border relative overflow-hidden">
              <div className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold flex items-center justify-between mb-1">
                <span>Pack Expected Return (3x Drops)</span>
                <span className="px-1.5 py-0.2 bg-amber-500/20 border border-amber-500/30 rounded text-[10px]">
                  200 Vosfor
                </span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono flex items-center gap-1.5">
                  <PlatinumIcon className="w-6 h-6" />
                  {packValue !== null ? packValue.toFixed(1) : "-"}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Expected value of 3 random Arcanes from Loid's 200 Vosfor pack.
              </p>
            </div>

            {/* Single Arcane Weighted Value */}
            <div className="analysis-stat p-4 rounded-lg border">
              <div className="text-[11px] uppercase tracking-wider text-cyan-400 font-semibold mb-1">
                Single Arcane Avg Value (1x Drop)
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-mono flex items-center gap-1.5">
                  <PlatinumIcon className="w-6 h-6" />
                  {totalWeighted != null ? totalWeighted.toFixed(2) : "-"}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Sum of (drop probability ×{" "}
                {strategy === "maxed"
                  ? "maxed price ÷ copies needed"
                  : "Rank 0 price"}
                ).
              </p>
            </div>

            {/* Vosfor Efficiency */}
            <div className="analysis-stat p-4 rounded-lg border">
              <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold mb-1">
                Vosfor Efficiency Yield
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono flex items-center gap-1.5">
                  <VosforIcon className="w-5 h-5" />
                  {packValue !== null ? (packValue / 2).toFixed(1) : "-"}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  plat / 100 Vosfor
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Expected platinum equivalent per 100 Vosfor spent.
              </p>
            </div>
          </div>

          {/* Arcanes Table Header */}
          <div className="arcane-table rounded-lg border overflow-hidden">
            <div className="arcane-table-heading grid grid-cols-12 gap-2 px-4 py-3 border-b text-xs font-semibold uppercase tracking-wider text-slate-400 select-none">
              <button
                type="button"
                aria-label={`Sort by arcane name${sortBy === "name" ? `, currently ${sortDir === "asc" ? "ascending" : "descending"}` : ""}`}
                className="col-span-5 sm:col-span-4 cursor-pointer hover:text-cyan-300 transition-colors flex items-center gap-1"
                onClick={() => handleSort("name")}
              >
                <span>Arcane</span>
                {sortBy === "name" &&
                  (sortDir === "asc" ? (
                    <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                  ))}
              </button>

              <button
                type="button"
                aria-label="Sort by drop rate"
                className="col-span-2 hidden sm:flex items-center justify-center cursor-pointer hover:text-cyan-300 transition-colors gap-1"
                onClick={() => handleSort("weight")}
              >
                <span>Drop Rate</span>
                {sortBy === "weight" &&
                  (sortDir === "asc" ? (
                    <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                  ))}
              </button>

              <button
                type="button"
                aria-label="Sort by average sale price"
                className="col-span-4 sm:col-span-3 text-center cursor-pointer hover:text-cyan-300 transition-colors flex items-center justify-center gap-1"
                onClick={() => handleSort("average")}
              >
                <span>
                  Avg Sold ({strategy === "maxed" ? "Max Rank" : "Rank 0"}, 48h)
                </span>
                {sortBy === "average" &&
                  (sortDir === "asc" ? (
                    <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                  ))}
              </button>

              <button
                type="button"
                aria-label="Sort by weighted platinum value"
                className="col-span-3 text-right cursor-pointer hover:text-cyan-300 transition-colors flex items-center justify-end gap-1"
                onClick={() => handleSort("weighted")}
              >
                <span>Weighted Plat</span>
                {sortBy === "weighted" &&
                  (sortDir === "asc" ? (
                    <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                  ))}
              </button>
            </div>

            {/* Arcanes List */}
            <div className="divide-y divide-slate-800/60">
              {getProcessedArcanes().map((arcane) => {
                // Authentic Warframe Rarity Colors & Stylings
                let rarityColor = "text-slate-300";
                let rarityBadge =
                  "bg-slate-800/80 text-slate-300 border-slate-700";
                let leftBorder = "border-l-4 border-slate-600";

                if (arcane.rarity === "common") {
                  rarityColor = "text-[#d97706]";
                  rarityBadge =
                    "bg-[#78350f]/30 text-[#fcd34d] border-[#b45309]";
                  leftBorder = "border-l-4 border-[#b45309]";
                } else if (arcane.rarity === "uncommon") {
                  rarityColor = "text-slate-200";
                  rarityBadge =
                    "bg-slate-700/30 text-slate-200 border-slate-400";
                  leftBorder = "border-l-4 border-slate-400";
                } else if (arcane.rarity === "rare") {
                  rarityColor = "text-amber-300";
                  rarityBadge =
                    "bg-amber-950/40 text-amber-300 border-amber-500";
                  leftBorder = "border-l-4 border-amber-400";
                } else if (arcane.rarity === "legendary") {
                  rarityColor = "text-cyan-200";
                  rarityBadge =
                    "bg-cyan-950/50 text-cyan-200 border-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.4)]";
                  leftBorder = "border-l-4 border-cyan-300";
                }

                return (
                  <div
                    key={arcane.id}
                    className={`grid grid-cols-12 gap-2 px-4 py-3 items-center ${leftBorder}`}
                  >
                    {/* Arcane Name & Rarity */}
                    <div className="col-span-5 sm:col-span-4 flex items-center space-x-2.5 min-w-0">
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`font-bold tracking-wide truncate ${rarityColor}`}
                          >
                            {arcane.name}
                          </span>
                          <a
                            href={`https://warframe.market/items/${arcane.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open on Warframe.Market"
                            className="text-slate-500 hover:text-cyan-400 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        {/* Warframe Rank Indicator: 5 pips */}
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 font-mono mt-0.5">
                          <span className="text-amber-400/90 font-mono tracking-tighter">
                            {"◆".repeat(
                              strategy === "maxed" ? arcane.maxRank : 0,
                            )}
                          </span>
                          <span className="text-slate-500">
                            Rank {strategy === "maxed" ? arcane.maxRank : 0}
                            {strategy === "maxed"
                              ? ` / ${arcane.copiesToMax} copies`
                              : ""}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-semibold border ${rarityBadge}`}
                          >
                            {arcane.rarity}
                          </span>
                          {typeof arcane.weight === "number" && (
                            <span className="text-cyan-400 sm:hidden">
                              • {(arcane.weight * 100).toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Drop Rate Percentage */}
                    <div className="col-span-2 hidden sm:flex items-center justify-center font-mono text-xs text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-semibold">
                        {typeof arcane.weight === "number"
                          ? `${(arcane.weight * 100).toFixed(1)}%`
                          : "-"}
                      </span>
                    </div>

                    {/* Average Platinum & Cheapest in parenthesis */}
                    <div className="col-span-4 sm:col-span-3 text-center font-mono">
                      <div className="text-slate-100 font-bold flex items-center justify-center gap-1">
                        <PlatinumIcon className="w-3.5 h-3.5" />
                        <span>
                          {arcane.avgPlatinum != null
                            ? arcane.avgPlatinum.toFixed(1)
                            : "N/A"}
                        </span>
                        <span className="text-slate-500 text-xs font-normal">
                          p
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {arcane.valuations[strategy].volume} reported sales
                      </div>
                    </div>

                    {/* Weighted Platinum Value */}
                    <div className="col-span-3 text-right font-mono flex items-center justify-end space-x-2">
                      <div>
                        <div className="text-emerald-400 font-bold flex items-center justify-end gap-1">
                          <PlatinumIcon className="w-3.5 h-3.5" />
                          <span>
                            {arcane.weightedValue != null
                              ? arcane.weightedValue.toFixed(2)
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ArcaneValuesSections;
