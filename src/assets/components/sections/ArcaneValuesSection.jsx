import React, { useState } from "react";
import ArcaneDetailModal from "./ArcaneDetailModal";
import processArcaneStatisticsData from "../../../util/processArcaneStatisticsData";
import { fetchArcaneStatistics } from "../../../util/apiClient";
import { PlatinumIcon, VosforIcon, LotusIcon } from "../icons/WarframeIcons";
import { playUiClick } from "../../../util/soundEffects";
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  HelpCircle,
  Eye,
  Sparkles,
} from "lucide-react";

const ArcaneValuesSections = ({
  fetchedArcanes,
  loadingTiles,
  weightedArcaneCollections,
  activeTab,
  searchQuery = "",
  rarityFilter = "all",
}) => {
  // Sorting state
  const [sortBy, setSortBy] = useState("weighted"); // default to weighted
  const [sortDir, setSortDir] = useState("desc"); // default desc

  // Modal state
  const [selectedArcane, setSelectedArcane] = useState(null);
  const [arcaneStatistics, setArcaneStatistics] = useState(new Map());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingArcaneDetails, setLoadingArcaneDetails] = useState(false);

  // Sorting and filtering logic
  const getProcessedArcanes = () => {
    let arcanes = fetchedArcanes.get(activeTab) || [];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      arcanes = arcanes.filter((arcane) =>
        arcane.name.toLowerCase().includes(q)
      );
    }

    // Filter by rarity
    if (rarityFilter && rarityFilter !== "all") {
      arcanes = arcanes.filter(
        (arcane) => (arcane.rarity || "").toLowerCase() === rarityFilter.toLowerCase()
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

  // Handle arcane item click with loading state
  const handleArcaneClick = async (arcane, event) => {
    if (event.target.closest("a")) return;
    if (loadingArcaneDetails) return;

    playUiClick();
    setLoadingArcaneDetails(true);
    setSelectedArcane(arcane);

    try {
      if (!arcaneStatistics.has(arcane.id)) {
        const arcaneStatisticsData = await fetchArcaneStatistics(arcane.id);
        const processedData = processArcaneStatisticsData(arcaneStatisticsData);

        setArcaneStatistics((prevStats) => {
          const newStats = new Map(prevStats);
          newStats.set(arcane.id, processedData);
          return newStats;
        });
      }
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch arcane statistics:", error);
      setIsModalOpen(true);
    } finally {
      setLoadingArcaneDetails(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArcane(null);
  };

  const collectionData = weightedArcaneCollections.current.get(activeTab) || {};
  const totalWeighted = collectionData.totalWeightedValue;
  const totalWeightedCheapest = collectionData.totalWeightedValueWithCheapest;
  const packValue = totalWeighted !== undefined ? totalWeighted * 3 : null;
  const packValueCheapest = totalWeightedCheapest !== undefined ? totalWeightedCheapest * 3 : null;

  return (
    <div className="space-y-4">
      {/* Loading State */}
      {loadingTiles.has(activeTab) ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl border border-cyan-900/40 bg-[#080d1a]/80">
          <div className="relative mb-4">
            <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
            <LotusIcon className="w-6 h-6 text-cyan-400 absolute inset-0 m-auto" />
          </div>
          <span className="text-cyan-300 font-semibold tracking-wider text-base">
            Querying Warframe.Market Orderbook...
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
            <div className="p-4 rounded-xl border border-amber-500/40 bg-gradient-to-br from-amber-950/40 via-slate-900/90 to-[#070b16] relative overflow-hidden">
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
                <span className="text-xs text-slate-400 font-mono">
                  (floor: {packValueCheapest !== null ? packValueCheapest.toFixed(1) : "-"} p)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Expected value of 3 random Arcanes from Loid's 200 Vosfor pack.
              </p>
            </div>

            {/* Single Arcane Weighted Value */}
            <div className="p-4 rounded-xl border border-cyan-900/60 bg-gradient-to-br from-cyan-950/30 via-slate-900/90 to-[#070b16]">
              <div className="text-[11px] uppercase tracking-wider text-cyan-400 font-semibold mb-1">
                Single Arcane Avg Value (1x Drop)
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-mono flex items-center gap-1.5">
                  <PlatinumIcon className="w-6 h-6" />
                  {totalWeighted !== undefined ? totalWeighted.toFixed(2) : "-"}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  (min: {totalWeightedCheapest !== undefined ? totalWeightedCheapest.toFixed(2) : "-"} p)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Mathematical expectation: Sum of (Drop Weight × Sell Price).
              </p>
            </div>

            {/* Vosfor Efficiency */}
            <div className="p-4 rounded-xl border border-emerald-900/60 bg-gradient-to-br from-emerald-950/30 via-slate-900/90 to-[#070b16]">
              <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold mb-1">
                Vosfor Efficiency Yield
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono flex items-center gap-1.5">
                  <VosforIcon className="w-5 h-5" />
                  {packValue !== null ? (packValue / 2).toFixed(1) : "-"}
                </span>
                <span className="text-xs text-slate-400 font-mono">plat / 100 Vosfor</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Platinum generated for every 100 Vosfor dissolved.
              </p>
            </div>
          </div>

          {/* Arcanes Table Header */}
          <div className="rounded-xl border border-slate-800 bg-[#070b16]/90 overflow-hidden shadow-xl">
            <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-slate-900/80 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400 select-none">
              <div
                className="col-span-5 sm:col-span-4 cursor-pointer hover:text-cyan-300 transition-colors flex items-center gap-1"
                onClick={() => handleSort("name")}
              >
                <span>Arcane</span>
                {sortBy === "name" && (
                  sortDir === "asc" ? <ChevronUp className="w-3.5 h-3.5 text-cyan-400" /> : <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                )}
              </div>

              <div
                className="col-span-2 hidden sm:flex items-center justify-center cursor-pointer hover:text-cyan-300 transition-colors gap-1"
                onClick={() => handleSort("weight")}
              >
                <span>Drop Rate</span>
                {sortBy === "weight" && (
                  sortDir === "asc" ? <ChevronUp className="w-3.5 h-3.5 text-cyan-400" /> : <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                )}
              </div>

              <div
                className="col-span-4 sm:col-span-3 text-center cursor-pointer hover:text-cyan-300 transition-colors flex items-center justify-center gap-1"
                onClick={() => handleSort("average")}
              >
                <span>Avg Price (Rank 5)</span>
                {sortBy === "average" && (
                  sortDir === "asc" ? <ChevronUp className="w-3.5 h-3.5 text-cyan-400" /> : <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                )}
              </div>

              <div
                className="col-span-3 text-right cursor-pointer hover:text-cyan-300 transition-colors flex items-center justify-end gap-1"
                onClick={() => handleSort("weighted")}
              >
                <span>Weighted Plat</span>
                {sortBy === "weighted" && (
                  sortDir === "asc" ? <ChevronUp className="w-3.5 h-3.5 text-cyan-400" /> : <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                )}
              </div>
            </div>

            {/* Arcanes List */}
            <div className="divide-y divide-slate-800/60">
              {getProcessedArcanes().map((arcane) => {
                const isCurrentlyLoading =
                  loadingArcaneDetails && selectedArcane?.id === arcane.id;

                // Authentic Warframe Rarity Colors & Stylings
                let rarityColor = "text-slate-300";
                let rarityBadge = "bg-slate-800/80 text-slate-300 border-slate-700";
                let rowBg = "hover:bg-slate-800/40";
                let leftBorder = "border-l-4 border-slate-600";

                if (arcane.rarity === "common") {
                  rarityColor = "text-[#d97706]";
                  rarityBadge = "bg-[#78350f]/30 text-[#fcd34d] border-[#b45309]";
                  leftBorder = "border-l-4 border-[#b45309]";
                } else if (arcane.rarity === "uncommon") {
                  rarityColor = "text-slate-200";
                  rarityBadge = "bg-slate-700/30 text-slate-200 border-slate-400";
                  leftBorder = "border-l-4 border-slate-400";
                } else if (arcane.rarity === "rare") {
                  rarityColor = "text-amber-300";
                  rarityBadge = "bg-amber-950/40 text-amber-300 border-amber-500";
                  leftBorder = "border-l-4 border-amber-400";
                  rowBg = "hover:bg-amber-950/15";
                } else if (arcane.rarity === "legendary") {
                  rarityColor = "text-cyan-200";
                  rarityBadge = "bg-cyan-950/50 text-cyan-200 border-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.4)]";
                  leftBorder = "border-l-4 border-cyan-300";
                  rowBg = "hover:bg-cyan-950/20";
                }

                return (
                  <div
                    key={arcane.id}
                    onClick={(e) => handleArcaneClick(arcane, e)}
                    className={`grid grid-cols-12 gap-2 px-4 py-3 items-center cursor-pointer transition-all ${leftBorder} ${rowBg} ${
                      isCurrentlyLoading ? "opacity-60 bg-cyan-950/30" : ""
                    } group`}
                  >
                    {/* Arcane Name & Rarity */}
                    <div className="col-span-5 sm:col-span-4 flex items-center space-x-2.5 min-w-0">
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className={`font-bold tracking-wide truncate ${rarityColor} group-hover:text-cyan-300 transition-colors`}>
                            {arcane.name}
                          </span>
                          <a
                            href={`https://warframe.market/items/${arcane.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title="Open on Warframe.Market"
                            className="text-slate-500 hover:text-cyan-400 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        {/* Warframe Rank Indicator: 5 pips */}
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 font-mono mt-0.5">
                          <span className="text-amber-400/90 font-mono tracking-tighter">
                            ◆◆◆◆◆
                          </span>
                          <span className="text-slate-500">Rank 5</span>
                          <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-semibold border ${rarityBadge}`}>
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
                        <span>{arcane.avgPlatinum ? arcane.avgPlatinum.toFixed(1) : "0"}</span>
                        <span className="text-slate-500 text-xs font-normal">p</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        floor: <span className="text-emerald-400 font-semibold">{arcane.cheapestPlatinum || 0}</span> p
                      </div>
                    </div>

                    {/* Weighted Platinum Value */}
                    <div className="col-span-3 text-right font-mono flex items-center justify-end space-x-2">
                      <div>
                        <div className="text-emerald-400 font-bold flex items-center justify-end gap-1">
                          <PlatinumIcon className="w-3.5 h-3.5" />
                          <span>{arcane.weightedValue ? arcane.weightedValue.toFixed(2) : "0.00"}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          min: {arcane.cheapestWeightedValue ? arcane.cheapestWeightedValue.toFixed(2) : "0.00"}
                        </div>
                      </div>

                      {/* View icon indicator on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400">
                        <Eye className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Warframe Themed Arcane Detail Modal */}
      <ArcaneDetailModal
        arcane={selectedArcane}
        isOpen={isModalOpen}
        onClose={closeModal}
        arcaneStatistics={arcaneStatistics}
      />
    </div>
  );
};

export default ArcaneValuesSections;
