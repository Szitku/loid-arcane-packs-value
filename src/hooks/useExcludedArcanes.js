import { useState, useEffect, useCallback } from "react";
import { playUiClick } from "../util/soundEffects";

const ARCANE_SELECTIONS_STORAGE_KEY = "loid-exchange:excluded-arcanes:v1";

function loadExcludedArcanes(tiles) {
  const excludedByCollection = new Map();
  if (typeof window === "undefined") return excludedByCollection;

  try {
    const raw = window.localStorage.getItem(ARCANE_SELECTIONS_STORAGE_KEY);
    const saved = raw ? JSON.parse(raw) : null;
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) {
      return excludedByCollection;
    }

    for (const tile of tiles) {
      if (!Array.isArray(saved[tile.id])) continue;
      const validIds = new Set(tile.arcanes.map((arcane) => arcane.id));
      const excluded = new Set(saved[tile.id].filter((id) => validIds.has(id)));
      if (excluded.size > 0) {
        excludedByCollection.set(tile.id, excluded);
      }
    }
  } catch {
    // Invalid saved data or blocked storage should not prevent using the app.
  }

  return excludedByCollection;
}

export function useExcludedArcanes(tiles) {
  const [excludedArcanesByCollection, setExcludedArcanesByCollection] = useState(
    () => loadExcludedArcanes(tiles),
  );

  useEffect(() => {
    try {
      const saved = Object.fromEntries(
        [...excludedArcanesByCollection].map(([tileId, excludedIds]) => [
          tileId,
          [...excludedIds],
        ]),
      );
      window.localStorage.setItem(
        ARCANE_SELECTIONS_STORAGE_KEY,
        JSON.stringify(saved),
      );
    } catch {
      // Keep selections usable in memory if local storage is unavailable.
    }
  }, [excludedArcanesByCollection]);

  const handleArcaneInclusionChange = useCallback(
    (tileId, arcaneId, included) => {
      playUiClick();
      setExcludedArcanesByCollection((prev) => {
        const next = new Map(prev);
        const excluded = new Set(next.get(tileId));
        if (included) {
          excluded.delete(arcaneId);
        } else {
          excluded.add(arcaneId);
        }
        if (excluded.size > 0) {
          next.set(tileId, excluded);
        } else {
          next.delete(tileId);
        }
        return next;
      });
    },
    [],
  );

  const handleIncludeAllArcanes = useCallback((tileId) => {
    playUiClick();
    setExcludedArcanesByCollection((prev) => {
      const next = new Map(prev);
      next.delete(tileId);
      return next;
    });
  }, []);

  return {
    excludedArcanesByCollection,
    handleArcaneInclusionChange,
    handleIncludeAllArcanes,
  };
}

export default useExcludedArcanes;
