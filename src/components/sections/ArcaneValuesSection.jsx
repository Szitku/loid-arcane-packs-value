import React, { useState, useMemo } from "react";
import { PlatinumIcon, LotusIcon } from "../icons/WarframeIcons";
import { playUiClick } from "../../util/soundEffects";
import { getRarityStyle } from "../../util/rarityStyles";
import {
  ChevronDown,
  ChevronUp,
  Search,
  TrendingUp,
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
      volume: arcane.valuations?.[strategy]?.volume ?? 0,
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
      } else if (sortBy === "volume") {
        valA = a.volume || 0;
        valB = b.volume || 0;
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
                <span className="px-1.5 py-0.5 bg-amber-500/20 border border-amber-500/30 rounded text-[10px]">
                  200 Vosfor
                </span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono flex items-center gap-1.5">
                  {packValue !== null ? packValue.toFixed(1) : "-"}
                  {packValue !== null && <PlatinumIcon className="w-6 h-6" />}
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
                  {totalWeighted != null ? totalWeighted.toFixed(2) : "-"}
                  {totalWeighted != null && <PlatinumIcon className="w-6 h-6" />}
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
              <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold mb-1 flex items-center justify-between">
                <span>Total Arcanes Sold (48h)</span>
                <span className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] text-emerald-300">
                  {strategy === "maxed" ? "Max Rank" : "Rank 0"}
                </span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-mono flex items-center gap-1.5">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                  {collectionData?.totalVolume != null
                    ? collectionData.totalVolume.toLocaleString()
                    : "-"}
                </span>
                <span className="text-slate-400 text-xs font-mono">units</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {excludedCount > 0
                  ? `${collectionData?.soldArcanesCount ?? 0} of ${rawCollectionArcanes.length - excludedCount} included Arcanes have reported sales (${excludedCount} excluded).`
                  : `${collectionData?.soldArcanesCount ?? 0} of ${rawCollectionArcanes.length} Arcanes in this pack have reported sales.`}
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

            {processedArcanes.length > 0 ? (
              <>
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

                  <div className="col-span-4 sm:col-span-3 flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      aria-sort={getSortAria("average")}
                      aria-label="Sort by average sale price"
                      className="cursor-pointer hover:text-cyan-300 transition-colors flex items-center gap-0.5"
                      onClick={() => handleSort("average")}
                    >
                      <span>Avg Price</span>
                      {sortBy === "average" &&
                        (sortDir === "asc" ? (
                          <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                        ))}
                    </button>
                    <span className="text-slate-600">·</span>
                    <button
                      type="button"
                      aria-sort={getSortAria("volume")}
                      aria-label="Sort by units sold"
                      className="cursor-pointer hover:text-cyan-300 transition-colors flex items-center gap-0.5"
                      onClick={() => handleSort("volume")}
                    >
                      <span>Sold</span>
                      {sortBy === "volume" &&
                        (sortDir === "asc" ? (
                          <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                        ))}
                    </button>
                  </div>

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
                    const rarityKey = (arcane.rarity || "").toLowerCase();
                    const isExcluded = excludedArcaneIds.has(arcane.id);
                    const rankCount =
                      strategy === "maxed" ? Math.max(0, arcane.maxRank || 0) : 0;

                    return (
                      <div
                        key={arcane.id}
                        className={`arcane-table-grid arcane-table-row grid gap-2 px-4 py-3 items-center rarity-${rarityKey} ${isExcluded ? "arcane-excluded" : ""}`}
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
                              <a
                                href={`https://warframe.market/items/${arcane.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => playUiClick()}
                                title={`Open ${arcane.name} on Warframe.Market`}
                                className={`advisor-arcane-link font-bold tracking-wide truncate ${style.color}`}
                              >
                                {arcane.name}
                              </a>
                            </div>

                            {/* Rank Indicator */}
                            <div className="advisor-arcane-meta mt-0.5">
                              <span
                                className={`advisor-rarity-badge ${style.badge}`}
                              >
                                {arcane.rarity}
                              </span>
                              {rankCount > 0 && (
                                <span className="text-amber-400/90 font-mono tracking-tighter text-[11px]">
                                  {"◆".repeat(rankCount)}
                                </span>
                              )}
                              <span className="text-slate-500 text-[11px] font-mono">
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
                              {typeof arcane.weight === "number" && (
                                <span className="text-cyan-400 sm:hidden text-[11px] font-mono">
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
                            <span>
                              {arcane.avgPlatinum != null
                                ? arcane.avgPlatinum.toFixed(1)
                                : "N/A"}
                            </span>
                            {arcane.avgPlatinum != null && (
                              <PlatinumIcon className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <span
                            className={`text-[11px] font-mono ${
                              sortBy === "volume"
                                ? "text-emerald-400 font-semibold"
                                : "text-slate-400"
                            }`}
                          >
                            {arcane.volume.toLocaleString()} sold
                          </span>
                        </div>

                        {/* Weighted Platinum Value */}
                        <div className="col-span-3 text-right font-mono flex items-center justify-end space-x-2">
                          <div>
                            <div className="text-emerald-400 font-bold flex items-center justify-end gap-1">
                              <span>
                                {arcane.weightedValue != null
                                  ? arcane.weightedValue.toFixed(2)
                                  : "N/A"}
                              </span>
                              {arcane.weightedValue != null && (
                                <PlatinumIcon className="w-3.5 h-3.5" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="advisor-empty arcane-empty">
                <Search size={22} aria-hidden="true" />
                <strong>
                  {rawCollectionArcanes.length === 0
                    ? "No Arcanes available"
                    : "No matching Arcanes"}
                </strong>
                <p>
                  {rawCollectionArcanes.length === 0
                    ? "This collection currently has no Arcanes configured."
                    : searchQuery.trim() && rarityFilter !== "all"
                      ? "Try another search term or select a different rarity."
                      : searchQuery.trim()
                        ? "Try another search term or clear the search bar."
                        : rarityFilter !== "all"
                          ? "No Arcanes in this collection match the selected rarity."
                          : "No Arcanes found in this collection."}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
