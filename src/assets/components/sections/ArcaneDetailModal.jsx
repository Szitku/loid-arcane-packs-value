import React, { useEffect } from "react";
import { PlatinumIcon, LotusIcon } from "../icons/WarframeIcons";
import { playUiClick } from "../../../util/soundEffects";
import { ExternalLink, X, TrendingUp, BarChart2, Shield, Sparkles } from "lucide-react";

const ArcaneDetailModal = ({ arcane, isOpen, onClose, arcaneStatistics }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !arcane) return null;

  const stats = arcaneStatistics.get(arcane.id) || {
    volumeOfLvlZero: 0,
    volumeOfMaxed: 0,
    avgMedianOf48HourslvlZero: 0,
    avgMedianOf48HoursMaxed: 0,
  };

  // Warframe Rarity styling
  let rarityBadge = "bg-slate-800 text-slate-300 border-slate-700";
  let rarityGlow = "border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.25)]";

  if (arcane.rarity === "common") {
    rarityBadge = "bg-[#78350f]/40 text-[#fcd34d] border-[#b45309]";
    rarityGlow = "border-[#b45309]/80 shadow-[0_0_25px_rgba(217,119,6,0.25)]";
  } else if (arcane.rarity === "uncommon") {
    rarityBadge = "bg-slate-700/40 text-slate-200 border-slate-400";
    rarityGlow = "border-slate-400/80 shadow-[0_0_25px_rgba(148,163,184,0.25)]";
  } else if (arcane.rarity === "rare") {
    rarityBadge = "bg-amber-950/60 text-amber-300 border-amber-500";
    rarityGlow = "border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.3)]";
  } else if (arcane.rarity === "legendary") {
    rarityBadge = "bg-cyan-950/70 text-cyan-200 border-cyan-400";
    rarityGlow = "border-cyan-400 shadow-[0_0_30px_rgba(56,189,248,0.4)]";
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`bg-[#080d1a] border ${rarityGlow} rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative font-hud shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle scanline overlay */}
        <div className="absolute inset-0 wf-scanlines opacity-20 pointer-events-none rounded-2xl" />

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800/80 relative z-10 flex items-start justify-between bg-slate-900/40">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-cyan-400 font-mono">
              <LotusIcon className="w-4 h-4 text-cyan-400" />
              <span>Warframe Codex // Arcane Intelligence</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-wide text-slate-100 flex items-center gap-2">
              {arcane.name}
            </h2>

            <div className="flex items-center space-x-3 pt-1">
              <span
                className={`inline-block px-3 py-0.5 rounded text-xs font-semibold uppercase tracking-wider border ${rarityBadge}`}
              >
                {arcane.rarity} Arcane
              </span>
              <span className="text-xs text-amber-400 font-mono">
                ◆◆◆◆◆ Rank 5
              </span>
              {arcane.weight && (
                <span className="text-xs text-slate-400 font-mono">
                  Drop Chance: {(arcane.weight * 100).toFixed(1)}%
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              playUiClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 relative z-10">
          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Live Top Orders */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-2 text-sm font-bold uppercase tracking-wider text-cyan-300">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Live Sell Orders (Top 5)</span>
              </div>

              <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Average Price:</span>
                  <span className="text-slate-100 font-bold flex items-center gap-1">
                    <PlatinumIcon className="w-4 h-4" />
                    {arcane.avgPlatinum?.toFixed(2)} p
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Cheapest Order:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <PlatinumIcon className="w-4 h-4" />
                    {arcane.cheapestPlatinum} p
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Weighted Contribution:</span>
                  <span className="text-cyan-300 font-bold flex items-center gap-1">
                    <PlatinumIcon className="w-4 h-4" />
                    {arcane.weightedValue?.toFixed(2)} p
                  </span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Floor Contribution:</span>
                  <span className="text-cyan-400 font-bold flex items-center gap-1">
                    <PlatinumIcon className="w-4 h-4" />
                    {arcane.cheapestWeightedValue?.toFixed(2)} p
                  </span>
                </div>
              </div>
            </div>

            {/* 48hr Historical Market Trends */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-2 text-sm font-bold uppercase tracking-wider text-amber-300">
                <BarChart2 className="w-4 h-4 text-amber-400" />
                <span>Recent Volume (48hr History)</span>
              </div>

              <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Rank 0 Sold:</span>
                  <span className="text-purple-300 font-semibold">
                    {stats.volumeOfLvlZero} units
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Rank 0 Avg Price:</span>
                  <span className="text-purple-300 font-semibold flex items-center gap-1">
                    <PlatinumIcon className="w-3.5 h-3.5" />
                    {stats.avgMedianOf48HourslvlZero?.toFixed(1) || 0} p
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Rank 5 Max Sold:</span>
                  <span className="text-amber-300 font-semibold">
                    {stats.volumeOfMaxed} units
                  </span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Rank 5 Avg Price:</span>
                  <span className="text-amber-300 font-semibold flex items-center gap-1">
                    <PlatinumIcon className="w-3.5 h-3.5" />
                    {stats.avgMedianOf48HoursMaxed?.toFixed(1) || 0} p
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Explanation of Dissolution Mechanics */}
          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-900/50 text-xs text-slate-300 space-y-1">
            <div className="font-semibold text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Warframe Arcane Dissolution Note</span>
            </div>
            <p>
              When opening Loid's Arcane Packs, each pack drops 3 unranked (Rank 0) arcanes. Players commonly combine 21 copies into a Rank 5 arcane to maximize trading value on Warframe.Market.
            </p>
          </div>

          {/* Warframe Market Outlink */}
          <div className="flex justify-center pt-2">
            <a
              href={`https://warframe.market/items/${arcane.id}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playUiClick()}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-500 hover:via-cyan-500 hover:to-teal-500 text-white font-bold uppercase tracking-wider text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
            >
              <PlatinumIcon className="w-4 h-4" />
              <span>Trade On Warframe.Market</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArcaneDetailModal;
