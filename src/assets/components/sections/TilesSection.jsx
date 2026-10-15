import React, { useRef, useState, useMemo } from "react";
import { tiles } from "../../../data/tilesData.js";
import ArcaneValuesSections from "./ArcaneValuesSection.jsx";
import processArcaneSalesData from "../../../util/processArcaneSalesData.js";
import calculatePackValues from "../../../util/calculatePackValues.js";
import { fetchArcaneStatistics } from "../../../util/apiClient.js";
import {
  PlatinumIcon,
  VosforIcon,
  LotusIcon,
} from "../icons/WarframeIcons.jsx";
import { playUiClick, playScanChime } from "../../../util/soundEffects.js";
import {
  Sparkles,
  TrendingUp,
  Calculator,
  RotateCw,
  Search,
  Award,
  ChevronRight,
  Info,
} from "lucide-react";

const TilesSection = ({ setActiveTab, activeTab }) => {
  const fetchedTiles = useRef(new Set());
  const [fetchedArcanes, setFetchedArcanes] = useState(new Map());
  const [weightedCollections, setWeightedCollections] = useState(new Map());
  const [loadingTiles, setLoadingTiles] = useState(new Set());
  const [isScanningAll, setIsScanningAll] = useState(false);
  const [strategy, setStrategy] = useState("unranked");
  const [fetchErrors, setFetchErrors] = useState(new Map());

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRarityFilter, setSelectedRarityFilter] = useState("all");

  // Vosfor Calculator Modal / Drawer state
  const [showCalculator, setShowCalculator] = useState(false);
  const [userVosfor, setUserVosfor] = useState(600);

  // Sync ref for backward compatibility with ArcaneValuesSection props
  const weightedArcaneCollections = useRef(new Map());

  const calculateAvgWeightedValues = (tileId, weightedArcanes) => {
    const values = calculatePackValues(weightedArcanes);

    weightedArcaneCollections.current.set(tileId, values);
    setWeightedCollections((prev) => new Map(prev).set(tileId, values));
  };

  const fetchTileData = async (arcanes, tileId) => {
    setLoadingTiles((prev) => new Set(prev).add(tileId));
    setFetchErrors((prev) => { const next = new Map(prev); next.delete(tileId); return next; });

    try {
      const requests = arcanes.map((arcane) =>
        fetchArcaneStatistics(arcane.id).then((statistics) =>
          processArcaneSalesData(statistics, arcane)
        )
      );

      const arcanesWithWeightedValue = await Promise.all(requests);
      calculateAvgWeightedValues(tileId, arcanesWithWeightedValue);

      setFetchedArcanes((prev) => {
        const newMap = new Map(prev);
        newMap.set(tileId, arcanesWithWeightedValue);
        return newMap;
      });
    } catch (err) {
      console.error(`Failed to fetch arcanes for ${tileId}:`, err);
      fetchedTiles.current.delete(tileId);
      setFetchErrors((prev) => new Map(prev).set(tileId, "Market data unavailable. Click the collection to retry."));
    } finally {
      setLoadingTiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(tileId);
        return newSet;
      });
    }
  };

  // Void Scan: Fetch all packs at once to populate leaderboard
  const handleScanAll = async () => {
    playScanChime();
    setIsScanningAll(true);

    for (const tile of tiles) {
      if (!fetchedTiles.current.has(tile.id)) {
        fetchedTiles.current.add(tile.id);
        await fetchTileData(tile.arcanes, tile.id);
      }
    }

    setIsScanningAll(false);
  };

  // Find the current highest value pack
  const topPack = useMemo(() => {
    let best = null;
    let maxVal = -1;
    for (const tile of tiles) {
      const data = weightedCollections.get(tile.id)?.[strategy];
      if (data && data.packValue !== null && data.packValue > maxVal) {
        maxVal = data.packValue;
        best = { ...tile, packValue: data.packValue, platPer100Vosfor: data.platPer100Vosfor };
      }
    }
    return best;
  }, [weightedCollections, strategy]);

  const rankedTiles = useMemo(() => [...tiles].sort((a, b) => {
    const aValue = weightedCollections.get(a.id)?.[strategy]?.packValue ?? -1;
    const bValue = weightedCollections.get(b.id)?.[strategy]?.packValue ?? -1;
    return bValue - aValue;
  }), [weightedCollections, strategy]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-cyan-900/60 bg-slate-950 p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {[["unranked", "Sell unranked"], ["maxed", "Collect, max & sell"]].map(([value, label]) => (
            <button key={value} onClick={() => setStrategy(value)} aria-pressed={strategy === value}
              className={`px-4 py-2 rounded border ${strategy === value ? "border-cyan-400 text-cyan-300 bg-cyan-950" : "border-slate-700 text-slate-400"}`}>
              {label}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400">
          Compare all packs, then buy the one with the highest expected platinum value.
          {" "}{strategy === "maxed" ? "Maxed values assume you collect enough matching copies to sell at max rank." : "Unranked values assume you sell each drop separately."}
          {" "}Prices use volume-weighted reported sales from the last 48 hours.
          {" "}No reported sales means a 0p value in this comparison.
        </p>
      </div>
      {/* Sanctum Anatomica Lore Dispatch & Quick Tools Banner */}
      <div className="relative overflow-hidden rounded-xl border border-cyan-900/60 bg-gradient-to-r from-[#091122]/95 via-[#0c162d]/90 to-[#070b16]/95 p-4 sm:p-5 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-full bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.1),transparent_70%)] pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center space-x-2 text-xs uppercase font-mono tracking-widest text-cyan-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sanctum Crucible Protocol // Albrecht's Laboratories</span>
            </div>
            <p className="text-sm sm:text-base text-slate-300 font-medium">
              Transmute unwanted Arcanes into <span className="text-emerald-400 font-bold inline-flex items-center gap-0.5"><VosforIcon className="w-3.5 h-3.5" /> Vosfor</span> with Loid. Each collection costs <span className="text-emerald-400 font-semibold">200 Vosfor</span> and yields <span className="text-amber-400 font-semibold">3 Arcanes</span>.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Scan All Collections Button */}
            <button
              onClick={handleScanAll}
              disabled={isScanningAll}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold uppercase tracking-wider bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all"
            >
              <RotateCw className={`w-4 h-4 ${isScanningAll ? "animate-spin text-amber-300" : ""}`} />
              <span>{isScanningAll ? "Comparing packs..." : "Compare All Packs"}</span>
            </button>

            {/* Vosfor Calculator Toggle */}
            <button
              onClick={() => {
                setShowCalculator(!showCalculator);
                playUiClick();
              }}
              className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold uppercase tracking-wider border transition-all ${
                showCalculator
                  ? "bg-amber-950/70 border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                  : "bg-slate-900/80 border-slate-700 text-slate-300 hover:border-amber-500/50 hover:text-amber-300"
              }`}
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>Vosfor Calc</span>
            </button>
          </div>
        </div>

        {/* Top Profit Leaderboard Bar (if available) */}
        {topPack && (
          <div className="mt-4 pt-3 border-t border-cyan-900/40 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 uppercase tracking-wider flex items-center gap-1">
                <Award className="w-3.5 h-3.5 inline text-amber-400" />
                {weightedCollections.size === tiles.length ? "Best Value Pack" : "Best So Far"}
              </span>
              <span className="text-slate-200 font-semibold">{topPack.label}</span>
              <span className="text-slate-400">({topPack.faction})</span>
            </div>
            <div className="flex items-center space-x-3 font-mono">
              <span className="text-slate-400">
                Avg Pack (3x):{" "}
                <span className="text-emerald-400 font-bold inline-flex items-center gap-1">
                  <PlatinumIcon className="w-3.5 h-3.5" />
                  {topPack.packValue.toFixed(1)} p
                </span>
              </span>
              <button
                onClick={() => {
                  setActiveTab(topPack.id);
                  playUiClick();
                }}
                className="text-cyan-400 hover:text-cyan-300 underline flex items-center gap-0.5 font-sans"
              >
                Inspect Pack <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Vosfor Calculator Widget */}
      {showCalculator && (
        <div className="rounded-xl border border-amber-500/40 bg-gradient-to-br from-amber-950/40 via-slate-950 to-slate-950 p-5 shadow-2xl relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider">
                Tenno Vosfor Return Estimator
              </h3>
            </div>
            <button
              onClick={() => setShowCalculator(false)}
              className="text-slate-400 hover:text-white text-lg font-mono"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Input Vosfor */}
            <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800">
              <label className="block text-xs uppercase text-slate-400 font-semibold mb-1">
                Your Available Vosfor
              </label>
              <div className="flex items-center space-x-2">
                <VosforIcon className="w-5 h-5" />
                <input
                  type="number"
                  min="200"
                  step="200"
                  value={userVosfor}
                  onChange={(e) => setUserVosfor(Math.max(0, parseInt(e.target.value) || 0))}
                  className="bg-black/60 border border-slate-700 rounded px-2.5 py-1 text-emerald-400 font-bold font-mono text-lg w-full focus:outline-none focus:border-amber-400"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">200 Vosfor per Pack</p>
            </div>

            {/* Calculated Packs */}
            <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800">
              <div className="text-xs uppercase text-slate-400 font-semibold mb-1">Packs & Drops</div>
              <div className="text-xl font-bold text-amber-300 font-mono">
                {Math.floor(userVosfor / 200)} Packs{" "}
                <span className="text-sm font-normal text-slate-400">
                  ({Math.floor(userVosfor / 200) * 3} Arcanes)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Remaining: {userVosfor % 200} Vosfor
              </p>
            </div>

            {/* Estimated Value with Best Pack */}
            <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800">
              <div className="text-xs uppercase text-slate-400 font-semibold mb-1">
                Estimated Plat Return {topPack ? `(${topPack.label})` : ""}
              </div>
              <div className="text-xl font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                <PlatinumIcon className="w-5 h-5" />
                {topPack
                  ? `${(Math.floor(userVosfor / 200) * topPack.packValue).toFixed(0)} p`
                  : "Scan packs to calculate"}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {strategy === "maxed" ? "Long-term maxed-sale equivalent" : "Based on Rank 0 reported sales (48h)"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Arcane Collection Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {rankedTiles.map((tile) => {
          const isSelected = activeTab === tile.id;
          const isLoading = loadingTiles.has(tile.id);
          const cachedValues = weightedCollections.get(tile.id)?.[strategy];
          const Icon = tile.icon;

          return (
            <button
              key={tile.id}
              onClick={() => {
                setActiveTab(tile.id);
                playUiClick();
                if (!fetchedTiles.current.has(tile.id)) {
                  fetchTileData(tile.arcanes, tile.id);
                  fetchedTiles.current.add(tile.id);
                }
              }}
              className={`group relative p-4 rounded-xl border text-left transition-all duration-200 overflow-hidden ${
                isSelected
                  ? `bg-gradient-to-br ${tile.activeBg} border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-[1.02]`
                  : "bg-[#090e1c]/85 border-slate-800/80 hover:border-slate-600 hover:bg-[#0c1428]"
              }`}
            >
              {/* Corner tech accent */}
              <div
                className={`absolute top-0 right-0 w-8 h-8 pointer-events-none transition-opacity ${
                  isSelected ? "opacity-100" : "opacity-30 group-hover:opacity-70"
                }`}
                style={{
                  background: `radial-gradient(circle at top right, ${isSelected ? "#38bdf8" : "#64748b"}, transparent 70%)`,
                }}
              />

              {/* Faction Header & Icon */}
              <div className="flex items-start justify-between mb-2.5">
                <div className="flex items-center space-x-2.5">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-colors ${
                      isSelected
                        ? "bg-slate-900 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(56,189,248,0.4)]"
                        : "bg-slate-900/90 border-slate-700/80 text-slate-300 group-hover:border-slate-500"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100 tracking-wide group-hover:text-cyan-200 transition-colors">
                      {tile.label}
                    </h3>
                    {topPack?.id === tile.id && <span className="text-[10px] font-bold uppercase text-amber-300">★ Best value {weightedCollections.size < tiles.length ? "so far" : ""}</span>}
                    <span className="text-[11px] font-medium text-slate-400 block -mt-0.5">
                      {tile.faction}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 mb-3 line-clamp-1">{tile.desc}</p>

              {/* Pack Stats Footer (Vosfor Cost & Plat Yield) */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="flex items-center space-x-1 text-slate-400">
                  <VosforIcon className="w-3.5 h-3.5" />
                  <span>200 Vosfor</span>
                </span>

                {isLoading ? (
                  <span className="flex items-center space-x-1 text-cyan-400 animate-pulse text-[11px]">
                    <RotateCw className="w-3 h-3 animate-spin" />
                    <span>Querying...</span>
                  </span>
                ) : cachedValues ? (
                  <span className="flex items-center space-x-1 text-emerald-400 font-bold" title="Expected yield for 3 Arcanes in this pack">
                    <PlatinumIcon className="w-3.5 h-3.5" />
                    <span>{cachedValues.packValue === null ? "Incomplete prices" : `~${cachedValues.packValue.toFixed(1)} p`}</span>
                  </span>
                ) : (
                  <span className="text-slate-500 text-[11px]">{fetchErrors.has(tile.id) ? "Failed — click to retry" : "Click to analyze"}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Collection View */}
      {tiles.map((tile) => tile.id).includes(activeTab) && (
        <div className="space-y-4 pt-2">
          {/* Quick Search & Filter bar for the active pack */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search arcanes in this pack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded bg-slate-950/80 border border-slate-700/80 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
              />
            </div>

            {/* Rarity filter tabs */}
            <div className="flex items-center space-x-1 text-xs">
              {["all", "common", "uncommon", "rare", "legendary"].map((rarity) => (
                <button
                  key={rarity}
                  onClick={() => {
                    setSelectedRarityFilter(rarity);
                    playUiClick();
                  }}
                  className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                    selectedRarityFilter === rarity
                      ? "bg-cyan-950 border border-cyan-500/60 text-cyan-300"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  {rarity}
                </button>
              ))}
            </div>
          </div>

          <ArcaneValuesSections
            fetchedArcanes={fetchedArcanes}
            loadingTiles={loadingTiles}
            weightedArcaneCollections={weightedArcaneCollections}
            activeTab={activeTab}
            searchQuery={searchQuery}
            rarityFilter={selectedRarityFilter}
            strategy={strategy}
            error={fetchErrors.get(activeTab)}
          />
        </div>
      )}
    </div>
  );
};

export default TilesSection;
