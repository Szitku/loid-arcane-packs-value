import React from "react";
import { VosforIcon, PlatinumIcon } from "../icons/WarframeIcons";
import { RotateCw, ArrowRight, ArrowUpRight, Award } from "lucide-react";

export default function CollectionCard({
  tile,
  index,
  isSelected,
  isLoading,
  hasError,
  cachedValues,
  isBestValue,
  isAllScanned,
  onSelect,
}) {
  const Icon = tile.icon;

  return (
    <button
      onClick={onSelect}
      aria-pressed={isSelected}
      aria-controls="collection-detail"
      className={`collection-card collection-${tile.id} ${isSelected ? "is-selected" : ""}`}
    >
      <div className="card-art">
        <div className="card-orbit" />
        <Icon className="collection-emblem" />
        <span className="card-index">
          {String(index + 1).padStart(2, "0")} / COLLECTION
        </span>
        <ArrowUpRight size={17} className="card-arrow" />
        {isBestValue && (
          <span className="best-badge">
            <Award size={11} /> Best {isAllScanned ? "value" : "so far"}
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
          <span className="card-value" title="Expected platinum value per pack">
            <PlatinumIcon className="w-3.5 h-3.5" />
            {cachedValues.packValue === null
              ? "Incomplete"
              : `${cachedValues.packValue.toFixed(1)} p`}
          </span>
        ) : (
          <span className="card-analyze">
            {hasError ? "Retry analysis" : "Analyze"}
            <ArrowRight size={13} />
          </span>
        )}
      </div>
    </button>
  );
}
