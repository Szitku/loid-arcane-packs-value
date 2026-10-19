import React from "react";
import { PlatinumIcon } from "../icons/WarframeIcons";
import { Award, ArrowUpRight } from "lucide-react";

export default function TopPackBanner({ topPack, isAllScanned, onSelectPack }) {
  if (!topPack) return null;

  return (
    <div className="best-pack" role="status">
      <Award size={20} />
      <div>
        <span className="eyebrow">
          {isAllScanned ? "BEST EXPECTED VALUE" : "BEST SO FAR"}
        </span>
        <strong>{topPack.label}</strong>
      </div>
      <span className="best-pack-value">
        {topPack.packValue.toFixed(1)}
        <PlatinumIcon className="w-5 h-5" />
        <small>/ pack</small>
      </span>
      <button
        className="text-button"
        onClick={() => onSelectPack(topPack.id)}
      >
        View collection <ArrowUpRight size={16} />
      </button>
    </div>
  );
}
