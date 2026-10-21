import { useMemo, useState } from "react";
import { ArrowRight, ArrowRightLeft, ChevronDown, Search, X } from "lucide-react";
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
      <PlatinumIcon className={iconClass} />
      {suffix && <span className="advisor-plat-suffix">{suffix}</span>}
    </span>
  );
}

function Recommendation({ value }) {
  const gain = value.best?.gain;
  if (value.vosfor === 0)
    return <span className="advisor-unavailable">Cannot dissolve</span>;
  if (value.vosfor == null)
    return <span className="advisor-unavailable">Unknown yield</span>;
  if (value.sellValue == null)
    return <span className="advisor-unavailable">No sales data</span>;
  if (gain == null)
    return <span className="advisor-unavailable">Scan target pack</span>;

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
    <div className={`advisor-decision ${decisionClass}`}>
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
  strategy,
  onScanAll,
  isScanningAll,
}) {
  const [rank, setRank] = useState("unranked");
  const [targetPack, setTargetPack] = useState("all");
  const [query, setQuery] = useState("");
  const [onlyWorthwhile, setOnlyWorthwhile] = useState(true);
  const [showAll, setShowAll] = useState(false);
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
              value: calculateDissolutionValues(arcane, targets)[rank],
            },
          ];
        }),
      )
      .sort(
        (a, b) =>
          (b.value.best?.gain ?? -Infinity) -
            (a.value.best?.gain ?? -Infinity) ||
          a.arcane.name.localeCompare(b.arcane.name),
      );
  }, [tiles, fetchedArcanes, packs, targetPack, rank]);

  const filteredRows = rows.filter(
    ({ arcane, value }) =>
      arcane.name.toLowerCase().includes(query.trim().toLowerCase()) &&
      (!onlyWorthwhile || value.profitablePacks.length > 0),
  );
  const visibleRows = showAll ? filteredRows : filteredRows.slice(0, 6);
  const isPartial = fetchedArcanes.size < tiles.length;
  const targetMissing =
    targetPack !== "all" && !packs.some((pack) => pack.id === targetPack);

  const resetView = () => setShowAll(false);

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
            <h2 id="dissolution-title">Dissolver</h2>
            <p>Find collection Arcanes worth turning into your next pack.</p>
          </div>
        </div>
        <div
          className="segmented-control"
          role="group"
          aria-label="Owned Arcane rank"
        >
          {[
            { id: "unranked", label: "Rank 0" },
            { id: "maxed", label: "Max rank" },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={rank === option.id}
              className={rank === option.id ? "selected" : ""}
              onClick={() => {
                playUiClick();
                setRank(option.id);
                resetView();
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
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
            {tiles.map((tile) => (
              <option key={tile.id} value={tile.id}>
                {packName(tile.label)}
              </option>
            ))}
          </select>
        </label>
        <label className="advisor-search">
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
              <X size={14} />
            </button>
          )}
        </label>
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
          {filteredRows.length} {onlyWorthwhile ? "opportunities" : "Arcanes"} ·{" "}
          {packs.length}/{tiles.length} packs scanned
          {isPartial ? " · Partial results" : ""}
        </span>
        {isPartial && (
          <button
            type="button"
            className="text-button"
            onClick={onScanAll}
            disabled={isScanningAll}
          >
            {isScanningAll ? "Scanning…" : "Scan all"}
            <ArrowRight size={12} />
          </button>
        )}
      </div>

      {visibleRows.length > 0 ? (
        <>
          <div className="advisor-columns" aria-hidden="true">
            <span>Arcane</span>
            <span>Sell price</span>
            <span>Dissolve into</span>
            <span>Recommendation</span>
          </div>
          <ul className="advisor-results">
            {visibleRows.map(({ arcane, collection, value }) => {
              const style = getRarityStyle(arcane.rarity);
              const rarityKey = (arcane.rarity || "").toLowerCase();

              return (
                <li
                  className={`advisor-row rarity-${rarityKey}`}
                  key={arcane.id}
                >
                  <div className="advisor-arcane">
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
                        {value.vosfor ?? "?"} Vosfor
                      </span>
                    </div>
                  </div>

                  <div className="advisor-price">
                    <span className="advisor-mobile-label">Sell price</span>
                    {value.sellValue == null ? (
                      <span className="advisor-dim">—</span>
                    ) : (
                      <PlatValue
                        value={value.sellValue}
                        iconClass="w-3.5 h-3.5"
                        className="advisor-price-val"
                      />
                    )}
                  </div>

                  <div className="advisor-pack">
                    <span className="advisor-pack-title">
                      {value.best ? packName(value.best.label) : "No pack valued"}
                    </span>
                    {value.best?.expectedValue != null ? (
                      <small className="advisor-pack-expected">
                        <PlatValue
                          value={value.best.expectedValue}
                          suffix="expected"
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
                                  value={pack.gain}
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
          {filteredRows.length > 6 && (
            <button
              type="button"
              className="advisor-show-more"
              aria-expanded={showAll}
              onClick={() => {
                playUiClick();
                requestAnimationFrame(() => {
                  setShowAll((value) => !value);
                });
              }}
            >
              {showAll
                ? "Show less"
                : `Show all ${filteredRows.length} results`}
              <ChevronDown size={14} className={showAll ? "is-expanded" : ""} />
            </button>
          )}
        </>
      ) : (
        <div className="advisor-empty">
          <ArrowRightLeft size={22} />
          <strong>
            {rows.length === 0 || targetMissing
              ? "Scan packs to compare"
              : "No matching opportunities"}
          </strong>
          <p>
            {rows.length === 0
              ? "Your collection Arcanes will appear here once scanned."
              : targetMissing
                ? "Scan all to include the selected target pack."
                : "Try another pack or turn off the worthwhile-only filter."}
          </p>
        </div>
      )}

      <div className="advisor-footer">
        <span>
          Pack returns:{" "}
          {strategy === "maxed" ? "max-rank sales / copy" : "Rank 0 sales"} ·
          Estimates, not guaranteed profit.
        </span>
        <details className="advisor-method">
          <summary onClick={() => playUiClick()}>How it works</summary>
          <p>
            Expected return = Vosfor ÷ pack cost × pack value. Compare this with
            the sale price of one owned Arcane at your selected rank. Max-rank
            yields assume unranking first (21 copies at rank 5; 10 at rank 3).
            Pack returns follow the collection selling strategy and exclusions.
            Missing sales mean unknown, not 0p. Fractional packs represent
            pooled Vosfor; trading time and the 50,000 Credit cost per pack are
            not priced in.{" "}
            <a
              href="https://wiki.warframe.com/w/Vosfor"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playUiClick()}
            >
              Vosfor yield reference ↗
            </a>
          </p>
        </details>
      </div>
    </section>
  );
}
