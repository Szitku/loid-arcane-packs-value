import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { playUiClick } from "../util/soundEffects";

/**
 * Custom hook to manage the opening and closing transitions of the collection detail view.
 * Coordinates smooth scrolling, exit animation state, reduced-motion preferences,
 * and timer/scrollend cleanup.
 */
export function useCollectionTransition({
  tiles,
  activeTab,
  setActiveTab,
  onSelectTile,
}) {
  const collectionsRef = useRef(null);
  const detailRef = useRef(null);
  const closingTimeoutRef = useRef(null);
  const scrollEndCleanupRef = useRef(null);
  const shouldScrollToDetailRef = useRef(false);
  const [closingTileId, setClosingTileId] = useState(null);

  const activeTile = useMemo(
    () => tiles.find((tile) => tile.id === activeTab),
    [tiles, activeTab],
  );

  const closingTile = useMemo(
    () => tiles.find((tile) => tile.id === closingTileId),
    [tiles, closingTileId],
  );

  const displayedTile = activeTile || closingTile;
  const isClosing = Boolean(!activeTile && closingTile);

  const clearScrollListener = useCallback(() => {
    if (scrollEndCleanupRef.current) {
      window.removeEventListener("scrollend", scrollEndCleanupRef.current);
      scrollEndCleanupRef.current = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    playUiClick();
    if (!activeTab) return;
    shouldScrollToDetailRef.current = false;
    clearScrollListener();

    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isReduced) {
      collectionsRef.current?.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
      setActiveTab("");
      setClosingTileId(null);
      return;
    }

    const startY = window.scrollY;
    const targetY = collectionsRef.current
      ? collectionsRef.current.getBoundingClientRect().top + window.scrollY - 24
      : 0;
    const distance = Math.abs(startY - targetY);

    setClosingTileId(activeTab);
    setActiveTab("");

    collectionsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    if (closingTimeoutRef.current) clearTimeout(closingTimeoutRef.current);

    let finished = false;
    const finishClose = () => {
      if (finished) return;
      finished = true;
      clearScrollListener();
      if (closingTimeoutRef.current) clearTimeout(closingTimeoutRef.current);
      setClosingTileId(null);
    };

    if (distance > 60) {
      if ("onscrollend" in window) {
        scrollEndCleanupRef.current = finishClose;
        window.addEventListener("scrollend", finishClose, { once: true });
      }
      closingTimeoutRef.current = setTimeout(finishClose, 500);
    } else {
      closingTimeoutRef.current = setTimeout(finishClose, 220);
    }
  }, [activeTab, clearScrollListener, setActiveTab]);

  const handleAnimationEnd = useCallback(
    (e) => {
      if (e.target !== e.currentTarget) return;
      if (
        e.animationName === "closerLookClose" &&
        !scrollEndCleanupRef.current
      ) {
        if (closingTimeoutRef.current) clearTimeout(closingTimeoutRef.current);
        setClosingTileId(null);
      }
    },
    [],
  );

  const handleSelectCollection = useCallback(
    (tile) => {
      if (activeTab === tile.id) {
        playUiClick();
        const isReduced =
          typeof window !== "undefined" &&
          window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        detailRef.current?.scrollIntoView({
          behavior: isReduced ? "auto" : "smooth",
          block: "start",
        });
        return;
      }
      clearScrollListener();
      if (closingTimeoutRef.current) clearTimeout(closingTimeoutRef.current);
      setClosingTileId(null);
      shouldScrollToDetailRef.current = true;
      setActiveTab(tile.id);
      playUiClick();
      onSelectTile?.(tile);
    },
    [activeTab, clearScrollListener, onSelectTile, setActiveTab],
  );

  useEffect(() => {
    if (shouldScrollToDetailRef.current && activeTab) {
      shouldScrollToDetailRef.current = false;
      const isReduced =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const rafId = requestAnimationFrame(() => {
        detailRef.current?.scrollIntoView({
          behavior: isReduced ? "auto" : "smooth",
          block: "start",
        });
      });

      return () => cancelAnimationFrame(rafId);
    }
  }, [activeTab]);

  useEffect(() => {
    return () => {
      clearScrollListener();
      if (closingTimeoutRef.current) clearTimeout(closingTimeoutRef.current);
    };
  }, [clearScrollListener]);

  return {
    collectionsRef,
    detailRef,
    displayedTile,
    isClosing,
    handleSelectCollection,
    handleClose,
    handleAnimationEnd,
  };
}

export default useCollectionTransition;
