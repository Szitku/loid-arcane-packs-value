import React, { useState } from "react";
import WelcomeSection from "./assets/components/sections/WelcomeSection";
import TilesSection from "./assets/components/sections/TilesSection";

export default function App() {
  const [activeTab, setActiveTab] = useState("welcome");
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-black text-blue-100">
      {/* Navigation */}
      <nav className="bg-blue-900/60 backdrop-blur-lg border-b border-blue-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16">
            <button
              onClick={() => setActiveTab("welcome")}
              className="text-xl font-bold text-white hover:text-white/80 transition-colors"
            >
              Loid Arcane Pack Values
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        {activeTab === "welcome" && (
          <WelcomeSection setActiveTab={setActiveTab} />
        )}

        {activeTab !== "welcome" && (
          <TilesSection setActiveTab={setActiveTab} activeTab={activeTab} />
        )}
      </div>
    </div>
  );
}
