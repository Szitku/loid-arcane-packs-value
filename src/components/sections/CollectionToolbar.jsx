import React from "react";
import { SlidersHorizontal, Search, X } from "lucide-react";

const STRATEGIES = [
  { value: "unranked", label: "Sell unranked" },
  { value: "maxed", label: "Max & sell" },
];

export default function CollectionToolbar({
  strategy,
  onSelectStrategy,
  collectionQuery,
  onChangeCollectionQuery,
}) {
  return (
    <div className="collection-toolbar">
      <div className="strategy-control">
        <span>
          <SlidersHorizontal size={14} /> Selling strategy
        </span>
        <div className="segmented-control">
          {STRATEGIES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onSelectStrategy(value)}
              aria-pressed={strategy === value}
              className={strategy === value ? "selected" : ""}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
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
            onClick={() => onChangeCollectionQuery("")}
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
