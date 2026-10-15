import React from "react";
import { LotusIcon } from "../icons/WarframeIcons";
import { Calculator, RotateCw, Layers3, ArrowRight } from "lucide-react";

export default function HeroSection({
  isScanningAll,
  completedScans,
  totalCollections,
  onScanAll,
  showCalculator,
  onToggleCalculator,
  marketUpdated,
}) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <div className="eyebrow">
          <span className="small-diamond" /> THE ART OF DISSOLUTION
        </div>
        <h1 id="hero-title">
          Less guesswork.
          <br />
          More <span>platinum.</span>
        </h1>
        <p>
          Give your unwanted Arcanes a new purpose. Compare Loid’s collections
          and find the best return for your Vosfor.
        </p>
        <div className="hero-actions">
          <button
            className="primary-button"
            onClick={onScanAll}
            disabled={isScanningAll}
          >
            {isScanningAll ? (
              <RotateCw size={16} className="animate-spin" />
            ) : (
              <Layers3 size={16} />
            )}
            {isScanningAll
              ? `Comparing · ${completedScans}/${totalCollections}`
              : "Compare all collections"}
            {!isScanningAll && <ArrowRight size={16} />}
          </button>
          <button
            className={`secondary-button ${showCalculator ? "is-active" : ""}`}
            aria-expanded={showCalculator}
            aria-controls="vosfor-calculator"
            onClick={onToggleCalculator}
          >
            <Calculator size={16} /> Vosfor calculator
          </button>
        </div>
        <div className="hero-note">
          <span className="status-dot" /> Real market sales{" "}
          <span className="note-divider">/</span> 48-hour weighted averages
          {marketUpdated && (
            <>
              <span className="note-divider">/</span>
              <span>
                Updated{" "}
                {new Date(marketUpdated).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="hero-art" aria-hidden="true">
        <div className="orbital orbital-one" />
        <div className="orbital orbital-two" />
        <div className="orbital orbital-three" />
        <div className="orbit-cross orbit-cross-one">+</div>
        <div className="orbit-cross orbit-cross-two">+</div>
        <div className="relic-halo" />
        <div className="relic relic-back" />
        <div className="relic relic-front">
          <LotusIcon className="relic-symbol" />
        </div>
        <span className="art-label art-label-top">VOSFOR TRANSMUTATION</span>
        <span className="art-label art-label-bottom">
          A NEW FORM. THE SAME POTENTIAL.
        </span>
        <span className="art-coordinate">03 / 200</span>
      </div>
    </section>
  );
}
