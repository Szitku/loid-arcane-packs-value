import React from "react";
import { Calculator, X } from "lucide-react";
import { VosforIcon, PlatinumIcon } from "../icons/WarframeIcons";

export default function VosforCalculator({
  userVosfor,
  onChangeVosfor,
  onClose,
  topPack,
  strategy,
}) {
  const packsCount = Math.floor(userVosfor / 200);
  const arcanesCount = packsCount * 3;
  const remainingVosfor = userVosfor % 200;

  return (
    <div id="vosfor-calculator" className="calculator-panel">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider">
            Tenno Vosfor Return Estimator
          </h3>
        </div>
        <button
          onClick={onClose}
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
                onChangeVosfor(Math.max(0, parseInt(e.target.value, 10) || 0))
              }
              className="bg-black/60 border border-slate-700 rounded px-2.5 py-1 text-cyan-400 font-bold font-mono text-lg w-full focus:outline-none focus:border-amber-400"
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
            {packsCount} Packs{" "}
            <span className="text-sm font-normal text-slate-400">
              ({arcanesCount} Arcanes)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Remaining: {remainingVosfor} Vosfor
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
              ? `${(packsCount * topPack.packValue).toFixed(0)} p`
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
  );
}
