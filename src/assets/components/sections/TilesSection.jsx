import React, { useRef, useState } from "react";
import { TrendingUp, Users, Zap } from "lucide-react";
import { tiles } from "../../../data/tilesData.js";
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
                  <span className="text-blue-300 text-lg">
                    Loading arcanes...
                  </span>
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
                      {(fetchedArcanes.get("cavia") || []).map(
                        (arcane, idx) => (
                          <li
                            key={arcane.id || idx}
                            className="bg-blue-900/40 rounded-lg p-3 flex justify-between items-center"
                          >
                            <span className="w-1/3 text-blue-200 font-semibold truncate">
                              {arcane.name}
                            </span>
                            <span className="w-1/3 text-blue-300 text-center">
                              {arcane.avgPlatinum.toFixed(2)}
                            </span>
                            <span className="w-1/3 text-blue-400 text-right">
                              {arcane.weightedValue.toFixed(2)}
                            </span>
                          </li>
                        )
                      )}
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
          )}

          {activeTab === "duviri" && (
            <>
              <h2 className="text-2xl font-bold text-blue-100">
                Active Projects
              </h2>
              <div className="grid gap-6">
                {projects.map((project, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-blue-950 via-blue-900 to-black/90 backdrop-blur-lg rounded-2xl p-6 border border-blue-900 hover:bg-blue-900/60 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-blue-100">
                        {project.name}
                      </h3>
                      <span className="px-3 py-1 bg-blue-900/60 rounded-full text-sm text-blue-200">
                        {project.status}
                      </span>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm text-blue-300 mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-blue-900/40 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${project.color}`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
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
