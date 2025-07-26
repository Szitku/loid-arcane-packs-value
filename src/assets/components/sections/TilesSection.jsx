import React, { useRef, useState } from "react";
import { TrendingUp, Users, Zap } from "lucide-react";
import { tiles } from "../../../data/tilesData.js";
import ArcaneValuesSections from "./ArcaneValuesSection.jsx";
const TilesSection = ({ setActiveTab, activeTab }) => {
  // Track which tiles have already triggered the API request
  const fetchedTiles = useRef(new Set());
  const [fetchedArcanes, setFetchedArcanes] = useState(new Map());
  const [avgWeightedValues, setAvgWeightedValues] = useState(new Map());

  const stats = [
    { icon: Users, label: "Active Users", value: "12.4K", change: "+12%" },
    { icon: TrendingUp, label: "Revenue", value: "$84.2K", change: "+18%" },
    { icon: Zap, label: "Performance", value: "98.2%", change: "+2.1%" },
  ];

  const projects = [
    {
      name: "AI Dashboard",
      status: "In Progress",
      progress: 75,
      color: "bg-blue-500",
    },
    {
      name: "Mobile App",
      status: "Review",
      progress: 90,
      color: "bg-purple-500",
    },
    {
      name: "Website Redesign",
      status: "Planning",
      progress: 25,
      color: "bg-green-500",
    },
  ];

  const calculateAvgWeightedValues = (tileId, weightedArcanes) => {
    let totalWeightedValue = 0;
    weightedArcanes.forEach((arcane) => {
      totalWeightedValue += arcane.weightedValue;
    });
    setAvgWeightedValues((prev) => {
      const newMap = new Map(prev);
      newMap.set(tileId, totalWeightedValue);
      return newMap;
    });
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
          {activeTab === "cavia" && (
            <ArcaneValuesSections
              fetchedArcanes={fetchedArcanes}
              loadingTiles={loadingTiles}
              avgWeightedValues={avgWeightedValues}
            />
          )}

          {activeTab === "duviri" && (
            <ArcaneValuesSections
              fetchedArcanes={fetchedArcanes}
              loadingTiles={loadingTiles}
              avgWeightedValues={avgWeightedValues}
              activeTab={activeTab}
            />
          )}

          {activeTab === "eidolon" && (
            <>
              <h2 className="text-2xl font-bold text-blue-100">
                Analytics Overview
              </h2>
              <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-black/90 backdrop-blur-lg rounded-2xl p-8 border border-blue-900">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-700 to-blue-400 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <TrendingUp className="w-16 h-16 text-blue-100" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-100 mb-2">
                    Performance Metrics
                  </h3>
                  <p className="text-blue-300 max-w-md mx-auto">
                    Your application is performing exceptionally well with high
                    user engagement and optimal load times across all devices.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    {["97.8%", "1.2s", "99.9%", "4.8/5"].map(
                      (metric, index) => (
                        <div key={index} className="text-center">
                          <div className="text-2xl font-bold text-blue-100">
                            {metric}
                          </div>
                          <div className="text-blue-400 text-sm">
                            {["Score", "Load Time", "Uptime", "Rating"][index]}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default TilesSection;
