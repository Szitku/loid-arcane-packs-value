import React from "react";

const WelcomeSection = ({ setActiveTab }) => {
  return (
    <div className="text-center max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-transparent mb-6 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-700 bg-clip-text">
          Welcome
        </h1>
        <button
          onClick={() => setActiveTab("dashboard")}
          className="bg-gradient-to-r from-blue-800 to-blue-600 text-blue-100 px-8 py-4 rounded-2xl font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 border border-blue-900/60"
        >
          What up doods
        </button>
      </div>
    </div>
  );
};

export default WelcomeSection;
