import React, { useState } from "react";

// Detailed information component/modal
const ArcaneDetailModal = ({ arcane, isOpen, onClose, arcaneStatistics }) => {
  if (!isOpen || !arcane) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-blue-400 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-blue-100 mb-2">
                {arcane.name}
              </h2>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize
                ${arcane.rarity === "common" ? "bg-[#cd7f32]/20 text-[#ffe6b3] border border-[#cd7f32]" : ""}
                ${arcane.rarity === "uncommon" ? "bg-[#c0c0c0]/20 text-[#e0e0e0] border border-[#c0c0c0]" : ""}
                ${arcane.rarity === "rare" ? "bg-[#ffd700]/20 text-[#ffe066] border border-[#ffd700]" : ""}
                ${arcane.rarity === "legendary" ? "bg-white/20 text-white border border-white" : ""}
              `}
              >
                {arcane.rarity}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Price Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-100 mb-3">
                Price Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Average Price:</span>
                  <span className="text-green-400 font-semibold">
                    {arcane.avgPlatinum?.toFixed(2)} p
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Cheapest Price:</span>
                  <span className="text-green-400 font-semibold">
                    {arcane.cheapestPlatinum} p
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Weighted Value:</span>
                  <span className="text-blue-400 font-semibold">
                    {arcane.weightedValue?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Cheapest Weighted:</span>
                  <span className="text-blue-400 font-semibold">
                    {arcane.cheapestWeightedValue?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-100 mb-3">
                Statistics (48hr)
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Rank 0 Sold:</span>
                  <span className="text-purple-400 font-semibold">
                    {arcaneStatistics.get(arcane.id)?.volumeOfLvlZero || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Avg Price:</span>
                  <span className="text-purple-400 font-semibold">
                    {arcaneStatistics
                      .get(arcane.id)
                      ?.avgMedianOf48HourslvlZero.toFixed(2) || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Maxed Rank Sold:</span>
                  <span className="text-purple-400 font-semibold">
                    {arcaneStatistics.get(arcane.id)?.volumeOfMaxed || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Avg Price:</span>
                  <span className="text-purple-400 font-semibold">
                    {arcaneStatistics
                      .get(arcane.id)
                      ?.avgMedianOf48HoursMaxed.toFixed(2) || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Market Link */}
          <div className="flex justify-center">
            <a
              href={`https://warframe.market/items/${arcane.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              View on Warframe Market
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArcaneDetailModal;
