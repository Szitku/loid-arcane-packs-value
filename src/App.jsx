import { useState } from "react";
import TilesSection from "./assets/components/sections/TilesSection";
import { LotusIcon } from "./assets/components/icons/WarframeIcons";
import { toggleSound, isSoundEnabled, playUiClick } from "./util/soundEffects";
import { Volume2, VolumeX, ArrowUpRight, Github } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("");
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundOn(newState);
    if (newState) playUiClick();
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to collections
      </a>
      <header className="site-header">
        <div className="header-inner">
          <button
            className="brand"
            onClick={() => {
              setActiveTab("");
              playUiClick();
            }}
            aria-label="Loid's Exchange home"
          >
            <span className="brand-mark">
              <LotusIcon className="w-7 h-7" />
            </span>
            <span>
              LOID’S <span className="brand-light">EXCHANGE</span>
              <small>ARCANE DISSOLUTION TERMINAL</small>
            </span>
          </button>
          <nav className="header-nav" aria-label="Main navigation">
            <a className="nav-active" href="#collections">
              Collections
            </a>
            <a
              href="https://warframe.market"
              target="_blank"
              rel="noopener noreferrer"
            >
              Warframe Market <ArrowUpRight size={13} />
            </a>
          </nav>
          <div className="header-tools">
            <span className="community-label">
              <span className="status-dot" /> Community-built
            </span>
            <button
              className="icon-button"
              onClick={handleSoundToggle}
              aria-label={
                soundOn ? "Mute sound effects" : "Enable sound effects"
              }
              aria-pressed={soundOn}
            >
              {soundOn ? <Volume2 size={17} /> : <VolumeX size={17} />}
            </button>
            <a
              className="icon-button github-link"
              href="https://github.com/Szitku/loid-arcane-packs-value"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
            >
              <Github size={17} />
            </a>
          </div>
        </div>
      </header>

      <main id="main" className="main-content">
        <TilesSection setActiveTab={setActiveTab} activeTab={activeTab} />
      </main>

      <footer className="site-footer">
        <div>
          <LotusIcon className="w-4 h-4" />
          <span>
            Made for the Tenno.{" "}
            <span className="footer-muted">Not for profit.</span>
          </span>
        </div>
        <p>
          Not affiliated with Digital Extremes. Market data from{" "}
          <a
            href="https://warframe.market"
            target="_blank"
            rel="noopener noreferrer"
          >
            warframe.market <ArrowUpRight size={11} />
          </a>
        </p>
        <span className="footer-coordinate">SANCTUM ANATOMICA · DEIMOS</span>
      </footer>
    </div>
  );
}
