import React, { useState, useMemo } from "react";
import { tiles } from "../../data/tilesData";
import ArcaneValuesSection from "./ArcaneValuesSection";
import HeroSection from "./HeroSection";
import ExchangeRules from "./ExchangeRules";
import TopPackBanner from "./TopPackBanner";
import VosforCalculator from "./VosforCalculator";
import CollectionToolbar from "./CollectionToolbar";
import CollectionCard from "./CollectionCard";
import { useExcludedArcanes } from "../../hooks/useExcludedArcanes";
import { useMarketAnalysis } from "../../hooks/useMarketAnalysis";
import { useCollectionTransition } from "../../hooks/useCollectionTransition";
import { LotusIcon } from "../icons/WarframeIcons";
import { playUiClick } from "../../util/soundEffects";
import { Search, ChevronRight, X } from "lucide-react";

export default function TilesSection({ setActiveTab, activeTab }) {
  const {
    excludedArcanesByCollection,
    handleArcaneInclusionChange,
    handleIncludeAllArcanes,
  } = useExcludedArcanes(tiles);

  const {
    fetchedArcanes,
    loadingTiles,
    isScanningAll,
    fetchErrors,
    marketUpdated,
    weightedCollections,
    handleScanAll,
    loadTileIfNeeded,
  } = useMarketAnalysis(tiles, excludedArcanesByCollection);

  const [strategy, setStrategy] = useState("unranked");

  // Search & Filter states
  const [collectionQuery, setCollectionQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRarityFilter, setSelectedRarityFilter] = useState("all");

  // Vosfor Calculator Modal / Drawer state
  const [showCalculator, setShowCalculator] = useState(false);
  const [userVosfor, setUserVosfor] = useState(600);

  // Highest value pack calculation
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

  const visibleTiles = useMemo(
    () =>
      rankedTiles.filter((tile) =>
        `${tile.label} ${tile.faction} ${tile.desc}`
          .toLowerCase()
          .includes(collectionQuery.toLowerCase()),
      ),
    [rankedTiles, collectionQuery],
  );

  const isAllScanned = weightedCollections.size === tiles.length;

  const {
    collectionsRef,
    detailRef,
    displayedTile,
    isClosing,
    handleSelectCollection,
    handleClose,
    handleAnimationEnd,
  } = useCollectionTransition({
    tiles,
    activeTab,
    setActiveTab,
    onSelectTile: loadTileIfNeeded,
  });

  return (
    <div className="exchange-dashboard">
      <HeroSection
        isScanningAll={isScanningAll}
        completedScans={weightedCollections.size}
        totalCollections={tiles.length}
        onScanAll={handleScanAll}
        showCalculator={showCalculator}
        onToggleCalculator={() => {
          setShowCalculator((prev) => !prev);
          playUiClick();
        }}
        marketUpdated={marketUpdated}
      />

      <ExchangeRules />

      <TopPackBanner
        topPack={topPack}
        isAllScanned={isAllScanned}
        onSelectPack={(id) => {
          const tile = tiles.find((t) => t.id === id);
          if (tile) handleSelectCollection(tile);
        }}
      />

      {showCalculator && (
        <VosforCalculator
          userVosfor={userVosfor}
          onChangeVosfor={setUserVosfor}
          onClose={() => setShowCalculator(false)}
          topPack={topPack}
          strategy={strategy}
        />
      )}

      <section
        ref={collectionsRef}
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

        <CollectionToolbar
          strategy={strategy}
          onSelectStrategy={(newStrategy) => {
            setStrategy(newStrategy);
            playUiClick();
          }}
          collectionQuery={collectionQuery}
          onChangeCollectionQuery={setCollectionQuery}
        />

        <div className="collection-grid">
          {visibleTiles.map((tile) => (
            <CollectionCard
              key={tile.id}
              tile={tile}
              index={tiles.indexOf(tile)}
              isSelected={activeTab === tile.id}
              isLoading={loadingTiles.has(tile.id)}
              hasError={fetchErrors.has(tile.id)}
              cachedValues={weightedCollections.get(tile.id)?.[strategy]}
              isBestValue={topPack?.id === tile.id}
              isAllScanned={isAllScanned}
              onSelect={() => handleSelectCollection(tile)}
            />
          ))}
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
          <ChevronRight size={14} />
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
      {displayedTile && (
        <section
          ref={detailRef}
          id="collection-detail"
          className={`collection-detail space-y-4 ${isClosing ? "is-closing" : ""}`}
          onAnimationEnd={handleAnimationEnd}
        >
          <div className="detail-heading">
            <div className="flex items-center gap-3.5">
              {displayedTile.icon && (
                <div
                  className={`detail-emblem-badge collection-${displayedTile.id}`}
                >
                  <displayedTile.icon className="collection-emblem" />
                </div>
              )}
              <div>
                <div className="eyebrow">A CLOSER LOOK</div>
                <h2>{displayedTile.label}</h2>
              </div>
            </div>
            <button
              className="icon-button"
              aria-label="Close collection details"
              onClick={handleClose}
            >
              <X size={19} />
            </button>
          </div>

          {/* Quick Search & Filter bar for the active pack */}
          <div className="arcane-filters flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-lg border">
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

          <ArcaneValuesSection
            fetchedArcanes={fetchedArcanes}
            loadingTiles={loadingTiles}
            weightedCollections={weightedCollections}
            excludedArcaneIds={excludedArcanesByCollection.get(displayedTile.id)}
            onArcaneInclusionChange={(arcaneId, included) =>
              handleArcaneInclusionChange(displayedTile.id, arcaneId, included)
            }
            onIncludeAllArcanes={() => handleIncludeAllArcanes(displayedTile.id)}
            activeTab={displayedTile.id}
            searchQuery={searchQuery}
            rarityFilter={selectedRarityFilter}
            strategy={strategy}
            error={fetchErrors.get(displayedTile.id)}
          />
        </section>
      )}

      {!displayedTile && (
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
}
