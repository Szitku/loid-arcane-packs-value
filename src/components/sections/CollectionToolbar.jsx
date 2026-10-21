import React from "react";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { playUiClick } from "../../util/soundEffects";

const STRATEGIES = [
  { value: "unranked", label: "Sell unranked" },
  { value: "maxed", label: "Max & sell" },
];

export function StrategyControl({ strategy, onSelectStrategy, showLabel = true }) {
  return (
    <div className="strategy-control">
      {showLabel && (
        <span>
          <SlidersHorizontal size={14} /> Selling strategy
        </span>
      )}
      <div className="segmented-control" role="group" aria-label="Selling strategy">
        {STRATEGIES.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => onSelectStrategy(value)}
            aria-pressed={strategy === value}
            className={strategy === value ? "selected" : ""}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CollectionToolbar({
  strategy,
  onSelectStrategy,
  collectionQuery,
  onChangeCollectionQuery,
}) {
  return (
    <div className="collection-toolbar">
      <StrategyControl
        strategy={strategy}
        onSelectStrategy={onSelectStrategy}
      />
      <div className="collection-search">
        <Search size={15} />
        <input
          aria-label="Search collections"
          placeholder="Find a collection…"
          value={collectionQuery}
          onChange={(e) => onChangeCollectionQuery(e.target.value)}
        />
        {collectionQuery && (
          <button
            aria-label="Clear collection search"
            onClick={() => {
              playUiClick();
              onChangeCollectionQuery("");
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
