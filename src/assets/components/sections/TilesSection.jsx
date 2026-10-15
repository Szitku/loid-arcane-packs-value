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
  Calculator,
  RotateCw,
  Search,
  Award,
  ChevronRight,
  Info,
  ArrowUpRight,
  ArrowRight,
  Layers3,
  X,
  SlidersHorizontal,
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
  const [collectionQuery, setCollectionQuery] = useState("");
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
    setFetchErrors((prev) => {
      const next = new Map(prev);
      next.delete(tileId);
      return next;
    });

    try {
      const requests = arcanes.map((arcane) =>
        fetchArcaneStatistics(arcane.id).then((statistics) =>
          processArcaneSalesData(statistics, arcane),
        ),
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
      setFetchErrors((prev) =>
        new Map(prev).set(
          tileId,
          "Market data unavailable. Click the collection to retry.",
        ),
      );
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
        best = {
          ...tile,
          packValue: data.packValue,
          platPer100Vosfor: data.platPer100Vosfor,
        };
      }
    }
    return best;
  }, [weightedCollections, strategy]);

  const rankedTiles = useMemo(
    () =>
      [...tiles].sort((a, b) => {
        const aValue =
          weightedCollections.get(a.id)?.[strategy]?.packValue ?? -1;
        const bValue =
          weightedCollections.get(b.id)?.[strategy]?.packValue ?? -1;
        return bValue - aValue;
      }),
    [weightedCollections, strategy],
  );

  const visibleTiles = rankedTiles.filter((tile) =>
    `${tile.label} ${tile.faction} ${tile.desc}`
      .toLowerCase()
      .includes(collectionQuery.toLowerCase()),
  );
  const selectedTile = tiles.find((tile) => tile.id === activeTab);

  return (
    <div className="exchange-dashboard">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="small-diamond" /> THE ART OF DISSOLUTION
          </div>
          <h1 id="hero-title">
            Less guesswork.
            <br />
            More <span>platinum.</span>
          </h1>
          <p>
            Give your unwanted Arcanes a new purpose. Compare Loid’s collections
            and find the best return for your Vosfor.
          </p>
          <div className="hero-actions">
            <button
              className="primary-button"
              onClick={handleScanAll}
              disabled={isScanningAll}
            >
              {isScanningAll ? (
                <RotateCw size={16} className="animate-spin" />
              ) : (
                <Layers3 size={16} />
              )}
              {isScanningAll
                ? `Comparing · ${weightedCollections.size}/${tiles.length}`
                : "Compare all collections"}
              {!isScanningAll && <ArrowRight size={16} />}
            </button>
            <button
              className={`secondary-button ${showCalculator ? "is-active" : ""}`}
              aria-expanded={showCalculator}
              aria-controls="vosfor-calculator"
              onClick={() => {
                setShowCalculator(!showCalculator);
                playUiClick();
              }}
            >
              <Calculator size={16} /> Vosfor calculator
            </button>
          </div>
          <div className="hero-note">
            <span className="status-dot" /> Real market sales{" "}
            <span className="note-divider">/</span> 48-hour weighted averages
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbital orbital-one" />
          <div className="orbital orbital-two" />
          <div className="orbital orbital-three" />
          <div className="orbit-cross orbit-cross-one">+</div>
          <div className="orbit-cross orbit-cross-two">+</div>
          <div className="relic-halo" />
          <div className="relic relic-back" />
          <div className="relic relic-front">
            <LotusIcon className="relic-symbol" />
          </div>
          <span className="art-label art-label-top">VOSFOR TRANSMUTATION</span>
          <span className="art-label art-label-bottom">
            A NEW FORM. THE SAME POTENTIAL.
          </span>
          <span className="art-coordinate">03 / 200</span>
        </div>
      </section>

      <div className="exchange-rules">
        <div>
          <span className="rule-icon">
            <VosforIcon className="w-5 h-5" />
          </span>
          <span>
            <strong>
              200 <span>Vosfor</span>
            </strong>
            <small>ONE COLLECTION</small>
          </span>
        </div>
        <span className="rule-connector">
          <span />
          <ArrowRight size={16} />
          <span />
        </span>
        <div>
          <span className="rule-icon">
            <Layers3 size={21} />
          </span>
          <span>
            <strong>
              3 <span>random Arcanes</span>
            </strong>
            <small>EVERY OPENING</small>
          </span>
        </div>
        <p>
          <Info size={15} /> Dissolve with Loid in the Sanctum Anatomica.
        </p>
      </div>

      {topPack && (
        <div className="best-pack" role="status">
          <Award size={20} />
          <div>
            <span className="eyebrow">
              {weightedCollections.size === tiles.length
                ? "BEST EXPECTED VALUE"
                : "BEST SO FAR"}
            </span>
            <strong>{topPack.label}</strong>
          </div>
          <span className="best-pack-value">
            <PlatinumIcon className="w-5 h-5" />
            {topPack.packValue.toFixed(1)} <small>p / pack</small>
          </span>
          <button
            className="text-button"
            onClick={() => {
              setActiveTab(topPack.id);
              playUiClick();
            }}
          >
            View collection <ArrowUpRight size={16} />
          </button>
        </div>
      )}

      {/* Interactive Vosfor Calculator Widget */}
      {showCalculator && (
        <div id="vosfor-calculator" className="calculator-panel">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider">
                Tenno Vosfor Return Estimator
              </h3>
            </div>
            <button
              onClick={() => setShowCalculator(false)}
              className="icon-button"
              aria-label="Close calculator"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Input Vosfor */}
            <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800">
              <label
                htmlFor="vosfor-amount"
                className="block text-xs uppercase text-slate-400 font-semibold mb-1"
              >
                Your Available Vosfor
              </label>
              <div className="flex items-center space-x-2">
                <VosforIcon className="w-5 h-5" />
                <input
                  id="vosfor-amount"
                  type="number"
                  min="0"
                  step="200"
                  value={userVosfor}
                  onChange={(e) =>
                    setUserVosfor(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  className="bg-black/60 border border-slate-700 rounded px-2.5 py-1 text-emerald-400 font-bold font-mono text-lg w-full focus:outline-none focus:border-amber-400"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                200 Vosfor per Pack
              </p>
            </div>

            {/* Calculated Packs */}
            <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800">
              <div className="text-xs uppercase text-slate-400 font-semibold mb-1">
                Packs & Drops
              </div>
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
                {strategy === "maxed"
                  ? "Long-term maxed-sale equivalent"
                  : "Based on Rank 0 reported sales (48h)"}
              </p>
            </div>
          </div>
        </div>
      )}

      <section
        id="collections"
        className="collections-section"
        aria-labelledby="collections-title"
      >
        <div className="section-heading">
          <div>
            <div className="eyebrow">EXPLORE THE POSSIBILITIES</div>
            <h2 id="collections-title">
              Arcane collections{" "}
              <span>{String(tiles.length).padStart(2, "0")}</span>
            </h2>
          </div>
          <span className="section-hint">
            Same Vosfor. Different potential.
          </span>
        </div>
        <div className="collection-toolbar">
          <div className="strategy-control">
            <span>
              <SlidersHorizontal size={14} /> Selling strategy
            </span>
            <div className="segmented-control">
              {[
                ["unranked", "Sell unranked"],
                ["maxed", "Max & sell"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => {
                    setStrategy(value);
                    playUiClick();
                  }}
                  aria-pressed={strategy === value}
                  className={strategy === value ? "selected" : ""}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="collection-search">
            <Search size={15} />
            <input
              aria-label="Search collections"
              placeholder="Find a collection…"
              value={collectionQuery}
              onChange={(e) => setCollectionQuery(e.target.value)}
            />
            {collectionQuery && (
              <button
                aria-label="Clear collection search"
                onClick={() => setCollectionQuery("")}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
        <div className="collection-grid">
          {visibleTiles.map((tile) => {
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
                aria-pressed={isSelected}
                aria-controls="collection-detail"
                className={`collection-card collection-${tile.id} ${isSelected ? "is-selected" : ""}`}
              >
                <div className="card-art">
                  <div className="card-orbit" />
                  <Icon className="collection-emblem" />
                  <span className="card-index">
                    {String(tiles.indexOf(tile) + 1).padStart(2, "0")} /
                    COLLECTION
                  </span>
                  <ArrowUpRight size={17} className="card-arrow" />
                  {topPack?.id === tile.id && (
                    <span className="best-badge">
                      <Award size={11} /> Best{" "}
                      {weightedCollections.size < tiles.length
                        ? "so far"
                        : "value"}
                    </span>
                  )}
                </div>
                <div className="card-body">
                  <span className="card-faction">{tile.faction}</span>
                  <h3>{tile.label}</h3>
                  <p>{tile.desc}</p>
                  <div className="card-meta">
                    <span>{tile.arcanes.length} Arcanes in pool</span>
                    <span>3 per pack</span>
                  </div>
                </div>
                <div className="card-footer">
                  <span className="card-cost">
                    <VosforIcon className="w-3.5 h-3.5" />
                    200 <span>Vosfor</span>
                  </span>
                  {isLoading ? (
                    <span className="card-analyze">
                      <RotateCw size={12} className="animate-spin" />
                      Analyzing…
                    </span>
                  ) : cachedValues ? (
                    <span
                      className="card-value"
                      title="Expected platinum value per pack"
                    >
                      <PlatinumIcon className="w-3.5 h-3.5" />
                      {cachedValues.packValue === null
                        ? "Incomplete"
                        : `${cachedValues.packValue.toFixed(1)} p`}
                    </span>
                  ) : (
                    <span className="card-analyze">
                      {fetchErrors.has(tile.id) ? "Retry analysis" : "Analyze"}
                      <ArrowRight size={13} />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        {visibleTiles.length === 0 && (
          <div className="empty-search">
            <Search size={24} />
            <h3>No collections found</h3>
            <p>Try a faction, location, or collection name.</p>
            <button
              className="text-button"
              onClick={() => setCollectionQuery("")}
            >
              Clear search <X size={14} />
            </button>
          </div>
        )}
        <div className="methodology-note">
          <Info size={14} />
          <p>
            {strategy === "maxed"
              ? "Maxed values assume you collect enough matching copies to sell at max rank."
              : "Unranked values assume each drop is sold separately."}{" "}
            Prices use volume-weighted reported sales over 48 hours. No reported
            sales are valued at 0p. Expected returns are estimates, not
            guarantees.
          </p>
        </div>
      </section>

      {/* Selected Collection View */}
      {tiles.map((tile) => tile.id).includes(activeTab) && (
        <section id="collection-detail" className="collection-detail space-y-4">
          <div className="detail-heading">
            <div>
              <div className="eyebrow">A CLOSER LOOK</div>
              <h2>{selectedTile.label}</h2>
            </div>
            <button
              className="icon-button"
              aria-label="Close collection details"
              onClick={() => setActiveTab("")}
            >
              <X size={19} />
            </button>
          </div>
          {/* Quick Search & Filter bar for the active pack */}
          <div className="arcane-filters flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-lg border">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                aria-label="Search arcanes in this collection"
                placeholder="Search arcanes in this pack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded bg-slate-950/80 border border-slate-700/80 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
              />
            </div>

            {/* Rarity filter tabs */}
            <div className="flex items-center space-x-1 text-xs">
              {["all", "common", "uncommon", "rare", "legendary"].map(
                (rarity) => (
                  <button
                    key={rarity}
                    aria-pressed={selectedRarityFilter === rarity}
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
                ),
              )}
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
        </section>
      )}
      {!activeTab && (
        <div className="exploration-hint">
          <LotusIcon className="w-5 h-5" />
          <p>
            A little knowledge goes a long way, Tenno.
            <span>
              Select a collection to explore its Arcanes, drop rates, and
              expected returns.
            </span>
          </p>
          <ChevronRight size={17} />
        </div>
      )}
    </div>
  );
};

export default TilesSection;
