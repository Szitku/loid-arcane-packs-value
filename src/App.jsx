import React, { useState } from "react";
import TilesSection from "./assets/components/sections/TilesSection";
import { LotusIcon, PlatinumIcon, VosforIcon } from "./assets/components/icons/WarframeIcons";
import { toggleSound, isSoundEnabled, playUiClick } from "./util/soundEffects";
import { Volume2, VolumeX, ExternalLink, Sparkles } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("");
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundOn(newState);
    if (newState) playUiClick();
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-200 relative selection:bg-cyan-500/30 selection:text-cyan-200 font-hud">
      {/* Sci-Fi Void Grid & Ambient Lighting Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_120%,rgba(20,184,166,0.1),rgba(0,0,0,0))]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Subtle scanline overlay */}
        <div className="absolute inset-0 wf-scanlines opacity-20" />
      </div>

      {/* Warframe Orokin Top Bar */}
      <header className="relative z-10 border-b border-cyan-900/50 bg-[#070b16]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo & Brand */}
            <button
              onClick={() => {
                setActiveTab("");
                playUiClick();
              }}
              className="flex items-center space-x-3 text-left group focus:outline-none"
            >
              <div className="relative">
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-cyan-900/60 via-slate-900 to-black border border-cyan-500/40 flex items-center justify-center group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-all duration-300">
                  <LotusIcon className="w-7 h-7 text-cyan-400 group-hover:text-cyan-300 transition-colors" glow={true} />
                </div>
                {/* Tech corner accent */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rotate-45 opacity-80" />
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 inline text-amber-400" />
                    Sanctum Anatomica // Deimos
                  </span>
                  <span className="px-1.5 py-0.2 text-[10px] uppercase font-mono tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 rounded">
                    Live Rates
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-slate-100 group-hover:text-cyan-300 transition-colors">
                  Loid Arcane Dissolution
                </h1>
              </div>
            </button>

            {/* Right Tools: Sound, Vosfor info, Warframe Market link */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Vosfor Pack Rule Info */}
              <div className="hidden lg:flex items-center space-x-3 px-3 py-1.5 rounded-lg bg-slate-900/70 border border-slate-800 text-xs">
                <div className="flex items-center space-x-1.5 text-emerald-400">
                  <VosforIcon className="w-4 h-4" />
                  <span className="font-semibold">200 Vosfor</span>
                  <span className="text-slate-400">/ pack</span>
                </div>
                <div className="w-px h-4 bg-slate-700" />
                <div className="text-slate-300">
                  <span className="text-amber-400 font-semibold">3 Arcanes</span> awarded
                </div>
              </div>

              {/* Sound Toggle */}
              <button
                onClick={handleSoundToggle}
                title={soundOn ? "Mute UI Sound FX" : "Enable UI Sound FX"}
                className={`p-2 rounded-lg border transition-all duration-200 ${
                  soundOn
                    ? "bg-cyan-950/50 border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/60"
                    : "bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700"
                }`}
              >
                {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Warframe Market link */}
              <a
                href="https://warframe.market"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playUiClick()}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-blue-950/80 to-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:text-white hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(56,189,248,0.3)] transition-all"
              >
                <PlatinumIcon className="w-3.5 h-3.5" />
                <span>Warframe.Market</span>
                <ExternalLink className="w-3 h-3 text-cyan-400" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <TilesSection setActiveTab={setActiveTab} activeTab={activeTab} />
      </main>

      {/* Warframe Themed Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-[#04060d]/90 py-6 mt-16 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-slate-400">
            <LotusIcon className="w-4 h-4 text-cyan-500" />
            <span>Warframe Arcane Dissolution Valuation Terminal</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Warframe & the Lotus are registered trademarks of Digital Extremes Ltd. Market data provided by Warframe.Market.
          </div>
        </div>
      </footer>
    </div>
  );
}
