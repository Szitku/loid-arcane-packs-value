import { useMemo, useState } from "react";
import { ArrowRight, ArrowRightLeft, ChevronDown, Search } from "lucide-react";
import calculateDissolutionValues from "../../util/calculateDissolutionValues";

const platinum = (value) => (value == null ? "—" : `${value.toFixed(2)}p`);
const packName = (label) => label.replace(/ Collection$/, "");

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
  const worthwhile = gain > 1e-8;
  return (
    <div className={`advisor-decision ${worthwhile ? "is-dissolve" : ""}`}>
      <span>
        {worthwhile
          ? "Dissolve"
          : Math.abs(gain) <= 1e-8
            ? "Break even"
            : "Sell instead"}
      </span>
      <small>
        {gain > 0 ? "+" : ""}
        {platinum(gain)} vs. selling
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
      id="dissolve-or-sell"
      className="dissolution-panel"
      aria-labelledby="dissolution-title"
    >
      <div className="advisor-heading">
        <div className="advisor-title">
          <span className="advisor-mark">
            <ArrowRightLeft size={19} />
          </span>
          <div>
            <h2 id="dissolution-title">Dissolve or sell?</h2>
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
        </label>
        <button
          type="button"
          className={`advisor-filter ${onlyWorthwhile ? "is-active" : ""}`}
          aria-pressed={onlyWorthwhile}
          onClick={() => {
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
            {visibleRows.map(({ arcane, collection, value }) => (
              <li className="advisor-row" key={arcane.id}>
                <div className="advisor-arcane">
                  <a
                    href={`https://warframe.market/items/${arcane.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {arcane.name}
                  </a>
                  <small>
                    {collection} ·{" "}
                    {rank === "maxed" ? `Rank ${arcane.maxRank} · ` : ""}
                    {value.vosfor ?? "?"} Vosfor
                  </small>
                </div>
                <div className="advisor-price">
                  <span className="advisor-mobile-label">Sell price</span>
                  {platinum(value.sellValue)}
                </div>
                <div className="advisor-pack">
                  <span>
                    {value.best ? packName(value.best.label) : "No pack valued"}
                  </span>
                  <small>{platinum(value.best?.expectedValue)} expected</small>
                  {value.profitablePacks.length > 1 && (
                    <details>
                      <summary>
                        +{value.profitablePacks.length - 1} other packs
                      </summary>
                      <ul>
                        {value.profitablePacks.slice(1).map((pack) => (
                          <li key={pack.id}>
                            <span>{packName(pack.label)}</span>
                            <strong>+{platinum(pack.gain)}</strong>
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
                <Recommendation value={value} />
              </li>
            ))}
          </ul>
          {filteredRows.length > 6 && (
            <button
              type="button"
              className="advisor-show-more"
              aria-expanded={showAll}
              onClick={() => setShowAll((value) => !value)}
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
          <summary>How it works</summary>
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
            >
              Vosfor yield reference ↗
            </a>
          </p>
        </details>
      </div>
    </section>
  );
}
