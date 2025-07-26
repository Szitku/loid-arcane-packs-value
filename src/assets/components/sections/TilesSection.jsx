import React, { useRef, useState } from "react";
import { tiles } from "../../../data/tilesData.js";
import ArcaneValuesSections from "./ArcaneValuesSection.jsx";
const TilesSection = ({ setActiveTab, activeTab }) => {
  // Track which tiles have already triggered the API request
  const fetchedTiles = useRef(new Set());
  const [fetchedArcanes, setFetchedArcanes] = useState(new Map());
  const weightedArcaneCollections = useRef(new Map());

  const calculateAvgWeightedValues = (tileId, weightedArcanes) => {
    let totalWeightedValue = 0;
    weightedArcanes.forEach((arcane) => {
      totalWeightedValue += arcane.weightedValue;
    });

    weightedArcaneCollections.current.set(tileId, totalWeightedValue);
  };

  // Function to fetch data for a tile
  const [loadingTiles, setLoadingTiles] = useState(new Set());

  const fetchTileData = async (arcanes, tileId) => {
    setLoadingTiles((prev) => new Set(prev).add(tileId));
    const type = "sell";
    const request = arcanes.map((arcane) =>
      fetch(
        `https://corsproxy.io/?https://api.warframe.market/v2/orders/item/${arcane.id}`
      )
        .then((res) => res.json())
        .then((data) => {
          const orders = data?.data || [];
          const filtered = orders.filter(
            (order) =>
              order.type === type &&
              order.rank === arcane.maxRank &&
              order.user.status === "ingame"
          );
          const sorted = filtered.sort((a, b) => a.platinum - b.platinum);
          const cheapestFive = sorted.slice(0, 5);
          const avgPlatinum =
            cheapestFive.length > 0
              ? cheapestFive.reduce((sum, o) => sum + o.platinum, 0) /
                cheapestFive.length
              : 0;
          const weightedValue = avgPlatinum * arcane.weight;

          return {
            id: arcane.id,
            rarity: arcane.rarity,
            name: arcane.name,
            avgPlatinum,
            weightedValue,
          };
        })
    );

    const arcanesWithWeightedValue = await Promise.all(request);

    calculateAvgWeightedValues(tileId, arcanesWithWeightedValue);
    setFetchedArcanes((prev) => {
      const newMap = new Map(prev);
      newMap.set(tileId, arcanesWithWeightedValue);
      return newMap;
    });
    setLoadingTiles((prev) => {
      const newSet = new Set(prev);
      newSet.delete(tileId);
      return newSet;
    });
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {tiles.map((tile) => (
          <button
            key={tile.id}
            onClick={() => {
              setActiveTab(tile.id);
              if (!fetchedTiles.current.has(tile.id)) {
                fetchTileData(tile.arcanes, tile.id);
                fetchedTiles.current.add(tile.id);
              }
            }}
            className={`p-4 rounded-xl border transition-all duration-300 text-left hover:scale-105 ${
              activeTab === tile.id
                ? "bg-gradient-to-br from-blue-900 via-blue-700 to-black text-blue-100 border-blue-400 shadow-2xl"
                : "bg-black/80 backdrop-blur-lg border-blue-900 text-blue-200 hover:bg-blue-900/60 hover:border-blue-700"
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  activeTab === tile.id
                    ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white"
                    : "bg-blue-900/60 text-blue-200"
                }`}
              >
                <tile.icon className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold">{tile.label}</h3>
            </div>
            <p
              className={`text-xs ${
                activeTab === tile.id ? "text-blue-200" : "text-blue-400/70"
              }`}
            >
              {tile.desc}
            </p>
          </button>
        ))}
      </div>

      {tiles.map((tile) => tile.id).includes(activeTab) && (
        <div className="space-y-8">
          {
            <ArcaneValuesSections
              fetchedArcanes={fetchedArcanes}
              loadingTiles={loadingTiles}
              weightedArcaneCollections={weightedArcaneCollections}
              activeTab={activeTab}
            />
          }
        </div>
      )}
    </>
  );
};

export default TilesSection;
