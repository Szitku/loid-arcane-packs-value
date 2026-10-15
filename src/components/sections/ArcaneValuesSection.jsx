import React, { useState, useMemo } from "react";
import { PlatinumIcon, VosforIcon, LotusIcon } from "../icons/WarframeIcons";
import ArcaneDetailModal from "../modals/ArcaneDetailModal";
import { playUiClick } from "../../util/soundEffects";
import { getRarityStyle } from "../../util/rarityStyles";
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";

export default function ArcaneValuesSection({
  fetchedArcanes,
  loadingTiles,
  weightedCollections,
  excludedArcaneIds = new Set(),
  onArcaneInclusionChange,
  onIncludeAllArcanes,
  activeTab,
  searchQuery = "",
  rarityFilter = "all",
  strategy = "unranked",
  error,
}) {
  const [sortBy, setSortBy] = useState("weighted");
  const [sortDir, setSortDir] = useState("desc");
  const [selectedArcane, setSelectedArcane] = useState(null);

  const rawCollectionArcanes = useMemo(
    () => fetchedArcanes.get(activeTab) || [],
    [fetchedArcanes, activeTab],
  );

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

  const processedArcanes = useMemo(() => {
    let arcanes = rawCollectionArcanes.map((arcane) => ({
      ...arcane,
      avgPlatinum: arcane.valuations?.[strategy]?.average ?? 0,
      weightedValue: excludedArcaneIds.has(arcane.id)
        ? 0
        : (arcane.valuations?.[strategy]?.weightedValue ?? 0),
    }));

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      arcanes = arcanes.filter((arcane) =>
        arcane.name.toLowerCase().includes(q),
      );
    }

    if (rarityFilter && rarityFilter !== "all") {
      const filterLower = rarityFilter.toLowerCase();
      arcanes = arcanes.filter(
        (arcane) => (arcane.rarity || "").toLowerCase() === filterLower,
      );
    }

    if (sortBy === "none") return arcanes;

    return [...arcanes].sort((a, b) => {
      let valA = 0;
      let valB = 0;

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

      return sortDir === "asc" ? valA - valB : valB - valA;
    });
  }, [
    rawCollectionArcanes,
    strategy,
    excludedArcaneIds,
    searchQuery,
    rarityFilter,
    sortBy,
    sortDir,
  ]);

  const allValues = weightedCollections.get(activeTab) || {};
  const collectionData = allValues[strategy] || {};
  const totalWeighted = collectionData.totalWeightedValue;
  const packValue = totalWeighted != null ? totalWeighted * 3 : null;
  const weightTotal = rawCollectionArcanes.reduce(
    (sum, arcane) => sum + (arcane.weight || 0),
    0,
  );
  const excludedCount = rawCollectionArcanes.filter((arcane) =>
    excludedArcaneIds.has(arcane.id),
  ).length;

  const getSortAria = (column) => {
    if (sortBy !== column) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  };

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
          {/* Pack Value Analysis Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

            <div className="analysis-stat p-4 rounded-lg border">
              <div className="text-[11px] uppercase tracking-wider text-cyan-400 font-semibold mb-1">
                Vosfor Efficiency Yield
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono flex items-center gap-1.5">
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

          {/* Arcanes Table */}
          <div className="arcane-table rounded-lg border overflow-hidden">
            <div className="arcane-inclusion-toolbar">
              <div>
                <p role="status">
                  {rawCollectionArcanes.length - excludedCount} of{" "}
                  {rawCollectionArcanes.length} Arcanes included
                </p>
                <p id="arcane-inclusion-help">
                  Untick Arcanes to exclude their value from all estimates. Drop
                  rates stay unchanged.
                </p>
              </div>
              <button
                type="button"
                className="text-button"
                onClick={onIncludeAllArcanes}
                disabled={excludedCount === 0}
              >
                Include all
              </button>
            </div>

            <div className="arcane-table-grid arcane-table-heading grid gap-2 px-4 py-3 border-b text-xs font-semibold uppercase tracking-wider text-slate-400 select-none">
              <span
                className="arcane-include-heading"
                title="Include in calculation"
              >
                Incl.
              </span>
              <button
                type="button"
                aria-sort={getSortAria("name")}
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
                aria-sort={getSortAria("weight")}
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
                aria-sort={getSortAria("average")}
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
                aria-sort={getSortAria("weighted")}
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
              {processedArcanes.map((arcane) => {
                const style = getRarityStyle(arcane.rarity);
                const isExcluded = excludedArcaneIds.has(arcane.id);
                const rankCount =
                  strategy === "maxed" ? Math.max(0, arcane.maxRank || 0) : 0;

                return (
                  <div
                    key={arcane.id}
                    className={`arcane-table-grid arcane-table-row grid gap-2 px-4 py-3 items-center ${style.leftBorder} ${isExcluded ? "arcane-excluded" : ""}`}
                  >
                    <label className="arcane-inclusion-checkbox">
                      <input
                        type="checkbox"
                        checked={!isExcluded}
                        onChange={(event) =>
                          onArcaneInclusionChange(
                            arcane.id,
                            event.target.checked,
                          )
                        }
                        aria-label={`Include ${arcane.name} in calculations`}
                        aria-describedby="arcane-inclusion-help"
                      />
                    </label>

                    {/* Arcane Name & Rarity */}
                    <div className="col-span-5 sm:col-span-4 flex items-center space-x-2.5 min-w-0">
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              playUiClick();
                              setSelectedArcane(arcane);
                            }}
                            className={`font-bold tracking-wide truncate text-left hover:underline cursor-pointer ${style.color}`}
                            title="Click to view detailed statistics"
                          >
                            {arcane.name}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              playUiClick();
                              setSelectedArcane(arcane);
                            }}
                            aria-label={`View statistics for ${arcane.name}`}
                            className="text-slate-500 hover:text-cyan-400 transition-colors"
                          >
                            <Info className="w-3 h-3" />
                          </button>
                          <a
                            href={`https://warframe.market/items/${arcane.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open on Warframe.Market"
                            className="text-slate-500 hover:text-cyan-400 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        {/* Rank Indicator */}
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 font-mono mt-0.5">
                          {rankCount > 0 && (
                            <span className="text-amber-400/90 font-mono tracking-tighter">
                              {"◆".repeat(rankCount)}
                            </span>
                          )}
                          <span className="text-slate-500">
                            Rank {rankCount}
                            {strategy === "maxed"
                              ? ` / ${arcane.copiesToMax} copies`
                              : ""}
                          </span>
                          {isExcluded && (
                            <span className="arcane-excluded-label">
                              Excluded
                            </span>
                          )}
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-semibold border ${style.badge}`}
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

                    {/* Average Platinum */}
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
                        {arcane.valuations?.[strategy]?.volume ?? 0} reported sales
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

      {/* Interactive Detail Modal */}
      <ArcaneDetailModal
        arcane={selectedArcane}
        isOpen={Boolean(selectedArcane)}
        onClose={() => setSelectedArcane(null)}
        strategy={strategy}
      />
    </div>
  );
}
