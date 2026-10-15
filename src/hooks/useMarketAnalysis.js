import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { fetchArcaneStatistics, preloadMarketData } from "../util/apiClient";
import processArcaneSalesData from "../util/processArcaneSalesData";
import calculatePackValues from "../util/calculatePackValues";
import { playScanChime } from "../util/soundEffects";

export function useMarketAnalysis(tiles, excludedArcanesByCollection) {
  const fetchedTilesRef = useRef(new Set());
  const [fetchedArcanes, setFetchedArcanes] = useState(() => new Map());
  const [loadingTiles, setLoadingTiles] = useState(() => new Set());
  const [isScanningAll, setIsScanningAll] = useState(false);
  const [fetchErrors, setFetchErrors] = useState(() => new Map());
  const [marketUpdated, setMarketUpdated] = useState(null);

  useEffect(() => {
    preloadMarketData().then((data) => {
      if (data?.lastUpdated) {
        setMarketUpdated(data.lastUpdated);
      }
    });
  }, []);

  const fetchTileData = useCallback(async (arcanes, tileId) => {
    setLoadingTiles((prev) => new Set(prev).add(tileId));
    setFetchErrors((prev) => {
      if (!prev.has(tileId)) return prev;
      const next = new Map(prev);
      next.delete(tileId);
      return next;
    });

    try {
      const requests = arcanes.map((arcane) =>
        fetchArcaneStatistics(arcane.id).then((statistics) =>
          processArcaneSalesData(statistics, arcane),
        ),
      );

      const arcanesWithWeightedValue = await Promise.all(requests);

      setFetchedArcanes((prev) => {
        const next = new Map(prev);
        next.set(tileId, arcanesWithWeightedValue);
        return next;
      });
      fetchedTilesRef.current.add(tileId);
    } catch (err) {
      console.error(`Failed to fetch arcanes for ${tileId}:`, err);
      fetchedTilesRef.current.delete(tileId);
      setFetchErrors((prev) =>
        new Map(prev).set(
          tileId,
          "Market data unavailable. Click the collection to retry.",
        ),
      );
    } finally {
      setLoadingTiles((prev) => {
        const next = new Set(prev);
        next.delete(tileId);
        return next;
      });
    }
  }, []);

  const handleScanAll = useCallback(async () => {
    playScanChime();
    setIsScanningAll(true);

    for (const tile of tiles) {
      if (!fetchedTilesRef.current.has(tile.id)) {
        await fetchTileData(tile.arcanes, tile.id);
      }
    }

    setIsScanningAll(false);
  }, [tiles, fetchTileData]);

  const loadTileIfNeeded = useCallback(
    (tile) => {
      if (
        !fetchedTilesRef.current.has(tile.id) &&
        !loadingTiles.has(tile.id)
      ) {
        fetchTileData(tile.arcanes, tile.id);
      }
    },
    [fetchTileData, loadingTiles],
  );

  const weightedCollections = useMemo(
    () =>
      new Map(
        [...fetchedArcanes].map(([tileId, arcanes]) => [
          tileId,
          calculatePackValues(arcanes, excludedArcanesByCollection.get(tileId)),
        ]),
      ),
    [fetchedArcanes, excludedArcanesByCollection],
  );

  return {
    fetchedArcanes,
    loadingTiles,
    isScanningAll,
    fetchErrors,
    marketUpdated,
    weightedCollections,
    fetchTileData,
    handleScanAll,
    loadTileIfNeeded,
  };
}

export default useMarketAnalysis;
