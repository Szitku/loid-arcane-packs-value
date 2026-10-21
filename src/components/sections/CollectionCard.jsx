import React from "react";
import { PlatinumIcon } from "../icons/WarframeIcons";
import { RotateCw, ArrowRight, ArrowUpRight, Award, TrendingUp } from "lucide-react";

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
        <div className="card-header-meta">
          <span className="card-faction">{tile.faction}</span>
          <span className="card-pool-badge">
            {tile.arcanes.length} in pool
          </span>
        </div>
        <h3>{tile.label}</h3>
      </div>
      <div className="card-footer">
        {isLoading ? (
          <div className="card-analyze-state is-loading">
            <RotateCw size={13} className="animate-spin text-[#d9bc7e]" />
            <span>Analyzing…</span>
          </div>
        ) : cachedValues ? (
          <div className="card-ultra-dock">
            <div
              className="dock-item dock-volume"
              title={
                cachedValues.totalVolume != null
                  ? `${cachedValues.totalVolume.toLocaleString()} units sold across ${cachedValues.soldArcanesCount ?? 0} included arcanes in the last 48 hours`
                  : "No sales data in the last 48 hours"
              }
            >
              <TrendingUp size={13} className="dock-icon text-emerald-400" />
              <div className="dock-text">
                <span className="dock-val">
                  {cachedValues.totalVolume != null
                    ? cachedValues.totalVolume.toLocaleString()
                    : "0"}
                </span>
                <span className="dock-sub">sold (48h)</span>
              </div>
            </div>
            <div
              className="dock-item dock-value"
              title="Expected platinum value per pack"
            >
              <div className="dock-text text-right">
                <span className="dock-val">
                  {cachedValues.packValue === null
                    ? "Incomplete"
                    : cachedValues.packValue.toFixed(1)}
                </span>
                <span className="dock-sub">Plat / Pack</span>
              </div>
              <PlatinumIcon className="w-4.5 h-4.5 flex-shrink-0" glow />
            </div>
          </div>
        ) : (
          <div className={`card-analyze-state ${hasError ? "is-error" : ""}`}>
            <span>{hasError ? "Retry analysis" : "Analyze Market"}</span>
            <ArrowRight size={13} />
          </div>
        )}
      </div>
    </button>
  );
}
