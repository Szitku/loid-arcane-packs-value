import React, { useEffect } from "react";
import { PlatinumIcon, LotusIcon } from "../icons/WarframeIcons";
import { playUiClick } from "../../util/soundEffects";
import { getRarityStyle } from "../../util/rarityStyles";
import {
  ExternalLink,
  X,
  TrendingUp,
  BarChart2,
  Sparkles,
} from "lucide-react";

export default function ArcaneDetailModal({
  arcane,
  isOpen,
  onClose,
  strategy = "unranked",
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !arcane) return null;

  const style = getRarityStyle(arcane.rarity);
  const unrankedVal = arcane.valuations?.unranked || {};
  const maxedVal = arcane.valuations?.maxed || {};
  const activeVal = arcane.valuations?.[strategy] || {};

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-arcane-title"
    >
      <div
        className={`bg-[#080d1a] border ${style.glow} rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative font-hud shadow-2xl`}
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

            <h2
              id="modal-arcane-title"
              className="text-2xl sm:text-3xl font-bold tracking-wide text-slate-100 flex items-center gap-2"
            >
              {arcane.name}
            </h2>

            <div className="flex items-center space-x-3 pt-1">
              <span
                className={`inline-block px-3 py-0.5 rounded text-xs font-semibold uppercase tracking-wider border ${style.badge}`}
              >
                {arcane.rarity} Arcane
              </span>
              <span className="text-xs text-amber-400 font-mono">
                Rank {strategy === "maxed" ? arcane.maxRank : 0}
              </span>
              {typeof arcane.weight === "number" && (
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
            aria-label="Close arcane details"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Active Valuation Summary */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-2 text-sm font-bold uppercase tracking-wider text-cyan-300">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Selected Valuation ({strategy})</span>
              </div>

              <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Average Sale:</span>
                  <span className="text-slate-100 font-bold flex items-center gap-1">
                    <PlatinumIcon className="w-4 h-4" />
                    {activeVal.average != null
                      ? `${activeVal.average.toFixed(1)} p`
                      : "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Per-Copy Value:</span>
                  <span className="text-cyan-300 font-bold flex items-center gap-1">
                    <PlatinumIcon className="w-4 h-4" />
                    {activeVal.perCopy != null
                      ? `${activeVal.perCopy.toFixed(2)} p`
                      : "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Pack Contribution:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <PlatinumIcon className="w-4 h-4" />
                    {activeVal.weightedValue != null
                      ? `${activeVal.weightedValue.toFixed(2)} p`
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* 48hr Historical Market Trends */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-2 text-sm font-bold uppercase tracking-wider text-amber-300">
                <BarChart2 className="w-4 h-4 text-amber-400" />
                <span>Market Activity (48h)</span>
              </div>

              <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Rank 0 Sold:</span>
                  <span className="text-purple-300 font-semibold">
                    {unrankedVal.volume ?? 0} units
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Rank 0 Avg:</span>
                  <span className="text-purple-300 font-semibold flex items-center gap-1">
                    <PlatinumIcon className="w-3.5 h-3.5" />
                    {unrankedVal.average != null
                      ? `${unrankedVal.average.toFixed(1)} p`
                      : "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">
                    Rank {arcane.maxRank} Sold:
                  </span>
                  <span className="text-amber-300 font-semibold">
                    {maxedVal.volume ?? 0} units
                  </span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">
                    Rank {arcane.maxRank} Avg:
                  </span>
                  <span className="text-amber-300 font-semibold flex items-center gap-1">
                    <PlatinumIcon className="w-3.5 h-3.5" />
                    {maxedVal.average != null
                      ? `${maxedVal.average.toFixed(1)} p`
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Explanation of Dissolution Mechanics */}
          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-900/50 text-xs text-slate-300 space-y-1">
            <div className="font-semibold text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Warframe Arcane Dissolution Note</span>
            </div>
            <p>
              Each pack drops 3 Rank 0 arcanes. This arcane requires{" "}
              {arcane.copiesToMax} matching copies to reach Rank {arcane.maxRank}
              . The maxed strategy divides the max-rank price by that copy count
              before weighting it by drop probability.
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
}
