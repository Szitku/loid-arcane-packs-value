import { useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowRightLeft,
  Check,
  ChevronDown,
  Layers3,
  RotateCw,
  Search,
  X,
} from "lucide-react";
import calculateDissolutionValues from "../../util/calculateDissolutionValues";
import { playUiClick } from "../../util/soundEffects";
import { PlatinumIcon } from "../icons/WarframeIcons";
import { getRarityStyle } from "../../util/rarityStyles";

const packName = (label) => label.replace(/ Collection$/, "");

function PlatValue({
  value,
  prefix = "",
  suffix = "",
  className = "",
  iconClass = "w-3.5 h-3.5",
}) {
  if (value == null) return <span className="advisor-dim">—</span>;
  return (
    <span className={`advisor-plat ${className}`}>
      {prefix && <span>{prefix}</span>}
      <span>{value.toFixed(2)}</span>
      <PlatinumIcon className={iconClass} aria-hidden="true" />
      {suffix && <span className="advisor-plat-suffix">{suffix}</span>}
    </span>
  );
}

function Recommendation({ value }) {
  const gain = value.best?.perCopy.gain;
  if (value.vosfor === 0)
    return (
      <span role="cell" className="advisor-unavailable">
        Cannot dissolve
      </span>
    );
  if (value.vosfor == null)
    return (
      <span role="cell" className="advisor-unavailable">
        Unknown yield
      </span>
    );
  if (value.sellValue == null)
    return (
      <span role="cell" className="advisor-unavailable">
        No sales data
      </span>
    );
  if (gain == null)
    return (
      <span role="cell" className="advisor-unavailable">
        Scan target pack
      </span>
    );

  const isPositive = gain > 1e-8;
  const isNegative = gain < -1e-8;
  const decisionClass = isPositive
    ? "is-positive"
    : isNegative
      ? "is-negative"
      : "is-neutral";

  const decisionLabel = isPositive
    ? "Dissolve"
    : isNegative
      ? "Sell instead"
      : "Break even";

  const prefix = gain > 0 ? "+" : "";

  return (
    <div role="cell" className={`advisor-decision ${decisionClass}`}>
      <span className="advisor-decision-badge">{decisionLabel}</span>
      <small className="advisor-decision-diff">
        <PlatValue
          value={gain}
          prefix={prefix}
          suffix="vs. selling"
          iconClass="w-3 h-3"
        />
      </small>
    </div>
  );
}

export default function DissolutionAdvisor({
  tiles,
  fetchedArcanes,
  weightedCollections,
  onScanAll,
  isScanningAll,
}) {
  const [rank, setRank] = useState("unranked");
  const [strategy, setStrategy] = useState("unranked");
  const [targetPack, setTargetPack] = useState("all");
  const [query, setQuery] = useState("");
  const [onlyWorthwhile, setOnlyWorthwhile] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const packs = useMemo(
    () =>
      tiles.flatMap((tile) => {
        const packValue = weightedCollections.get(tile.id)?.[strategy]
          ?.packValue;
        return Number.isFinite(packValue)
          ? [
              {
                id: tile.id,
                label: tile.label,
                vosforCost: tile.vosforCost,
                packValue,
              },
            ]
          : [];
      }),
    [tiles, weightedCollections, strategy],
  );

  const rows = useMemo(() => {
    const seen = new Set();
    const targets =
      targetPack === "all"
        ? packs
        : packs.filter((pack) => pack.id === targetPack);
    return tiles
      .flatMap((tile) =>
        (fetchedArcanes.get(tile.id) || []).flatMap((arcane) => {
          if (seen.has(arcane.id)) return [];
          seen.add(arcane.id);
          return [
            {
              arcane,
              collection: packName(tile.label),
              value: calculateDissolutionValues(arcane, targets, rank),
            },
          ];
        }),
      )
      .sort((a, b) => {
        const gainA = a.value.best?.perCopy.gain;
        const gainB = b.value.best?.perCopy.gain;
        if (gainA == null && gainB == null) {
          return a.arcane.name.localeCompare(b.arcane.name);
        }
        if (gainA == null) return 1;
        if (gainB == null) return -1;
        if (gainB !== gainA) return gainB - gainA;
        return a.arcane.name.localeCompare(b.arcane.name);
      });
  }, [tiles, fetchedArcanes, packs, targetPack, rank]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredRows = useMemo(() => {
    return rows.filter(
      ({ arcane, value }) =>
        (!normalizedQuery ||
          arcane.name.toLowerCase().includes(normalizedQuery)) &&
        (!onlyWorthwhile || value.profitablePacks.length > 0),
    );
  }, [rows, normalizedQuery, onlyWorthwhile]);
  const visibleRows = showAll ? filteredRows : filteredRows.slice(0, 6);
  const hasScannedAny = fetchedArcanes.size > 0;
  const isPartial = hasScannedAny && fetchedArcanes.size < tiles.length;
  const targetMissing =
    targetPack !== "all" && !packs.some((pack) => pack.id === targetPack);

  const listRef = useRef(null);

  const resetView = () => {
    if (listRef.current) listRef.current.scrollTop = 0;
    setShowAll(false);
  };

  return (
    <section
      id="dissolver"
      className="dissolution-panel"
      aria-labelledby="dissolution-title"
    >
      <div className="advisor-heading">
        <div className="advisor-title">
          <span className="advisor-mark">
            <ArrowRightLeft size={19} />
          </span>
          <div>
            <h1 id="dissolution-title">Dissolver</h1>
            <p>Find collection Arcanes worth turning into your next pack.</p>
          </div>
        </div>
        <div className="advisor-actions">
          {packs.length < tiles.length && onScanAll && (
            <button
              type="button"
              className="primary-button"
              onClick={() => {
                playUiClick();
                onScanAll();
              }}
              disabled={isScanningAll}
            >
              {isScanningAll ? (
                <RotateCw size={14} className="animate-spin" aria-hidden="true" />
              ) : (
                <Layers3 size={14} aria-hidden="true" />
              )}
              {isScanningAll
                ? `Scanning · ${packs.length}/${tiles.length}`
                : packs.length === 0
                  ? "Scan all collections"
                  : `Scan remaining ${tiles.length - packs.length} packs`}
              {!isScanningAll && <ArrowRight size={14} aria-hidden="true" />}
            </button>
          )}
          <button
            type="button"
            className="advisor-method-toggle"
            aria-expanded={showGuide}
            onClick={() => {
              playUiClick();
              setShowGuide((prev) => !prev);
            }}
          >
            How it works
            <ChevronDown size={14} className={showGuide ? "is-expanded" : ""} />
          </button>
        </div>
      </div>

      {showGuide && (
        <div className="advisor-guide-panel">
          <div className="advisor-guide">
            <div className="advisor-guide-grid">
              <div className="advisor-guide-card">
                <div className="advisor-guide-card-header">
                  <span className="advisor-guide-card-num">01</span>
                  <strong>Sell / copy</strong>
                </div>
                <p>
                  Direct platinum value from selling 1 copy on the market.
                </p>
                <div className="advisor-guide-formula">
                  Market Price ÷ Copy Count
                </div>
              </div>

              <div className="advisor-guide-card">
                <div className="advisor-guide-card-header">
                  <span className="advisor-guide-card-num">02</span>
                  <strong>Dissolve into</strong>
                </div>
                <p>
                  Expected platinum value from turning 1 copy into Vosfor.
                </p>
                <div className="advisor-guide-formula">
                  (Vosfor ÷ 200) × Pack Value ÷ Copies
                </div>
              </div>

              <div className="advisor-guide-card">
                <div className="advisor-guide-card-header">
                  <span className="advisor-guide-card-num">03</span>
                  <strong>Recommendation</strong>
                </div>
                <p>
                  Net profit comparing Vosfor return against market sale.
                </p>
                <div className="advisor-guide-formula">
                  Dissolve Return − Sell Price
                </div>
              </div>
            </div>

            <div className="advisor-guide-example">
              <strong>Quick Example:</strong> An Arcane sells for <strong>1.00p</strong> on the market, but dissolves into <strong>20 Vosfor</strong>. If your target pack averages <strong>30.00p</strong> (per 200 Vosfor), your 20 Vosfor represents 10% of a pack: <code>(20 ÷ 200) × 30.00p = 3.00p</code>. Because <strong>3.00p</strong> &gt; <strong>1.00p</strong> (+2.00p gain), the recommendation is <strong>Dissolve</strong>!
            </div>

            <div className="advisor-guide-rules">
              <div>
                <strong>• Fair Per-Copy Basis:</strong> Rank 5 Arcanes contain 21 copies (Rank 3 contains 10). Both market prices and Vosfor returns are divided by the copy count so you can compare any rank apples-to-apples.
              </div>
              <div>
                <strong>• Unrank First:</strong> In-game, unrank your Arcanes at Loid before dissolving to guarantee the full 21× or 10× Vosfor yield.
              </div>
              <div>
                <strong>• Strategy & Exclusions:</strong> Pack returns match your chosen drop selling rank (Rank 0 vs Max rank) and respect excluded Arcanes.
              </div>
              <div>
                <strong>• Real Market Data:</strong> Missing 48h sales show unknown rather than 0p. Fractional packs represent pooled Vosfor across multiple purchases; Credit costs (50,000/pack) and trade times are not converted to Platinum.
              </div>
            </div>

            <div className="advisor-guide-link">
              <a
                href="https://wiki.warframe.com/w/Vosfor"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playUiClick()}
              >
                Official Vosfor yield reference ↗
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="advisor-strategies">
        {[
          {
            id: "dissolve-rank",
            label: "Dissolve Arcanes at",
            value: rank,
            onChange: setRank,
            hint: "Choose the rank you own. Returns stay normalized per copy.",
            descriptions: ["One unranked copy", "Already ranked up"],
          },
          {
            id: "pack-sale-rank",
            label: "Sell collection drops at",
            value: strategy,
            onChange: setStrategy,
            hint: "Choose how you plan to sell the Arcanes from your packs.",
            descriptions: ["Sell drops individually", "Combine matching drops"],
          },
        ].map(({ id, label, value, onChange, hint, descriptions }, index) => (
          <fieldset
            className="advisor-strategy"
            key={id}
            aria-describedby={`${id}-hint`}
          >
            <legend>
              <span className="advisor-step" aria-hidden="true">
                0{index + 1}
              </span>
              {label}
            </legend>
            <div className="advisor-rank-options">
              {[
                { id: "unranked", label: "Rank 0" },
                { id: "maxed", label: "Max rank" },
              ].map((option, optionIndex) => (
                <label className="advisor-rank-option" key={option.id}>
                  <input
                    type="radio"
                    name={id}
                    value={option.id}
                    checked={value === option.id}
                    onChange={() => {
                      playUiClick();
                      onChange(option.id);
                      resetView();
                    }}
                  />
                  <span className="advisor-rank-card">
                    <span className="advisor-rank-copy">
                      <span className="advisor-rank-label">{option.label}</span>
                      <span className="advisor-rank-description">
                        {descriptions[optionIndex]}
                      </span>
                    </span>
                    <span className="advisor-rank-check" aria-hidden="true">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  </span>
                </label>
              ))}
            </div>
            <p id={`${id}-hint`}>{hint}</p>
          </fieldset>
        ))}
      </div>

      <div className="advisor-normalization-note">
        <strong>Fair comparison: platinum per Rank 0-equivalent copy.</strong>{" "}
        Sell prices, expected returns, gains, and result ordering all use this
        basis. A rank 5 Arcane represents 21 copies; rank 3 represents 10.
      </div>

      <div className="advisor-toolbar">
        <label className="advisor-target">
          <ArrowRight size={14} aria-hidden="true" />
          <select
            aria-label="Target pack"
            value={targetPack}
            onChange={(event) => {
              playUiClick();
              setTargetPack(event.target.value);
              resetView();
            }}
          >
            <option value="all">Best available pack</option>
            {tiles.map((tile) => {
              const isScanned = packs.some((p) => p.id === tile.id);
              return (
                <option key={tile.id} value={tile.id}>
                  {packName(tile.label)}{!isScanned ? " (not scanned)" : ""}
                </option>
              );
            })}
          </select>
        </label>
        <div className="advisor-search">
          <Search size={14} aria-hidden="true" />
          <input
            aria-label="Find a collection Arcane"
            type="search"
            placeholder="Find an Arcane…"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              resetView();
            }}
          />
          {query && (
            <button
              type="button"
              aria-label="Clear arcane search"
              onClick={() => {
                playUiClick();
                setQuery("");
                resetView();
              }}
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>
        <button
          type="button"
          className={`advisor-filter ${onlyWorthwhile ? "is-active" : ""}`}
          aria-pressed={onlyWorthwhile}
          onClick={() => {
            playUiClick();
            setOnlyWorthwhile((value) => !value);
            resetView();
          }}
        >
          Only worth dissolving
        </button>
      </div>

      <div className="advisor-status">
        <span role="status">
          {!hasScannedAny ? (
            `0/${tiles.length} packs scanned · No scans yet`
          ) : (
            <>
              {filteredRows.length} {onlyWorthwhile ? "opportunities" : "Arcanes"} ·{" "}
              {packs.length}/{tiles.length} packs scanned
              {isPartial ? " · Partial results" : ""}
            </>
          )}
        </span>
        {packs.length < tiles.length && onScanAll && (
          <button
            type="button"
            className="text-button"
            onClick={() => {
              playUiClick();
              onScanAll();
            }}
            disabled={isScanningAll}
          >
            {isScanningAll ? (
              <>
                <RotateCw size={12} className="animate-spin" aria-hidden="true" />
                Scanning…
              </>
            ) : (
              <>
                {!hasScannedAny
                  ? "Scan all collections"
                  : `Scan remaining ${tiles.length - packs.length} packs`}
                <ArrowRight size={13} aria-hidden="true" />
              </>
            )}
          </button>
        )}
      </div>

      {visibleRows.length > 0 ? (
        <>
          <div
            role="table"
            aria-label="Arcane dissolution and market comparison"
            aria-rowcount={filteredRows.length + 1}
          >
            <div role="rowgroup">
              <div className="advisor-columns" role="row" aria-rowindex={1}>
                <span role="columnheader">Arcane</span>
                <span role="columnheader">Sell / copy</span>
                <span role="columnheader">Dissolve into</span>
                <span role="columnheader">Recommendation</span>
              </div>
            </div>
            <ul
              ref={listRef}
              id="advisor-results-list"
              role="rowgroup"
              className={`advisor-results ${showAll ? "is-expanded" : ""}`}
            >
              {visibleRows.map(({ arcane, collection, value }, index) => {
                const style = getRarityStyle(arcane.rarity);
                const rarityKey = (arcane.rarity || "").toLowerCase();

                return (
                  <li
                    role="row"
                    aria-rowindex={index + 2}
                    className={`advisor-row rarity-${rarityKey}`}
                    key={arcane.id}
                  >
                    <div role="cell" className="advisor-arcane">
                      <a
                        href={`https://warframe.market/items/${arcane.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => playUiClick()}
                        className={`advisor-arcane-link ${style.color}`}
                      >
                        {arcane.name}
                      </a>
                      <div className="advisor-arcane-meta">
                        <span className={`advisor-rarity-badge ${style.badge}`}>
                          {arcane.rarity}
                        </span>
                        <span className="advisor-meta-text">
                          {collection} ·{" "}
                          {rank === "maxed" ? `Rank ${arcane.maxRank} · ` : ""}
                          {value.vosfor ?? "?"} Vosfor total
                          {value.copies > 1
                            ? ` · ${value.copies} copies`
                            : " · 1 copy"}
                        </span>
                      </div>
                    </div>

                    <div
                      role="cell"
                      className="advisor-price"
                      title={
                        value.sellValue == null
                          ? undefined
                          : `${value.sellValue.toFixed(2)}p total for ${value.copies} ${value.copies === 1 ? "copy" : "copies"}`
                      }
                    >
                      <span className="advisor-mobile-label">Sell / copy</span>
                      {value.sellValue == null ? (
                        <span className="advisor-dim">—</span>
                      ) : (
                        <PlatValue
                          value={value.perCopy.sellValue}
                          iconClass="w-3.5 h-3.5"
                          className="advisor-price-val"
                        />
                      )}
                    </div>

                    <div role="cell" className="advisor-pack">
                      <span className="advisor-pack-title">
                        {value.best
                          ? packName(value.best.label)
                          : "No pack valued"}
                      </span>
                      {value.best?.expectedValue != null ? (
                        <small className="advisor-pack-expected">
                          <PlatValue
                            value={value.best.perCopy.expectedValue}
                            suffix="expected / copy"
                            iconClass="w-3 h-3"
                          />
                        </small>
                      ) : (
                        <small className="advisor-dim">No value data</small>
                      )}
                      {value.profitablePacks.length > 1 && (
                        <details>
                          <summary onClick={() => playUiClick()}>
                            +{value.profitablePacks.length - 1} other packs
                          </summary>
                          <ul>
                            {value.profitablePacks.slice(1).map((pack) => (
                              <li key={pack.id}>
                                <span>{packName(pack.label)}</span>
                                <strong className="advisor-pack-profit">
                                  <PlatValue
                                    value={pack.perCopy.gain}
                                    prefix="+"
                                    iconClass="w-3 h-3"
                                    className="text-emerald-400"
                                  />
                                </strong>
                              </li>
                            ))}
                          </ul>
                        </details>
                      )}
                    </div>

                    <Recommendation value={value} />
                  </li>
                );
              })}
            </ul>
          </div>
          {filteredRows.length > 6 && (
            <button
              type="button"
              className="advisor-show-more"
              aria-expanded={showAll}
              aria-controls="advisor-results-list"
              onClick={() => {
                playUiClick();
                setShowAll((prev) => {
                  const next = !prev;
                  if (!next) {
                    if (listRef.current) listRef.current.scrollTop = 0;
                    document.getElementById("dissolver")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                  return next;
                });
              }}
            >
              {showAll
                ? "Show less"
                : `Show all ${filteredRows.length} results`}
              <ChevronDown size={14} className={showAll ? "is-expanded" : ""} aria-hidden="true" />
            </button>
          )}
        </>
      ) : (
        <div className="advisor-empty">
          <ArrowRightLeft size={22} />
          <strong>
            {!hasScannedAny || targetMissing
              ? "Scan packs to compare"
              : packs.length < tiles.length
                ? "No matching opportunities in scanned packs"
                : "No matching opportunities"}
          </strong>
          <p>
            {!hasScannedAny
              ? "Your collection Arcanes will appear here once scanned."
              : targetMissing
                ? "Scan all to include the selected target pack."
                : packs.length < tiles.length
                  ? "Scan the remaining packs or turn off the worthwhile-only filter."
                  : "Try another pack or turn off the worthwhile-only filter."}
          </p>
          {packs.length < tiles.length && onScanAll && (
            <button
              type="button"
              className="primary-button"
              onClick={() => {
                playUiClick();
                onScanAll();
              }}
              disabled={isScanningAll}
            >
              {isScanningAll ? (
                <>
                  <RotateCw size={14} className="animate-spin" aria-hidden="true" />
                  Scanning…
                </>
              ) : (
                <>
                  {!hasScannedAny
                    ? "Scan all collections"
                    : `Scan remaining ${tiles.length - packs.length} collections`}
                  <ArrowRight size={14} aria-hidden="true" />
                </>
              )}
            </button>
          )}
        </div>
      )}

      <div className="advisor-footer">
        <span className="advisor-footer-note">
          Pack returns:{" "}
          {strategy === "maxed" ? "max-rank sales / copy" : "Rank 0 sales"} ·
          All platinum values per input copy · Estimates, not guaranteed profit.
        </span>
      </div>
    </section>
  );
}
