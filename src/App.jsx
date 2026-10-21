import { useState } from "react";
import TilesSection from "./components/sections/TilesSection";
import { LotusIcon } from "./components/icons/WarframeIcons";
import { toggleSound, isSoundEnabled, playUiClick } from "./util/soundEffects";
import { Volume2, VolumeX, ArrowUpRight } from "lucide-react";

function GithubIcon({ size = 24, className = "", ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

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
            <a href="#dissolver">Dissolver</a>
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
              href="https://github.com/Szitku/loid-vosfor-exchange"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
            >
              <GithubIcon size={17} />
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
