import React from "react";
import { Zap } from "lucide-react";

const WelcomeSection = ({ setActiveTab }) => {
  return (
    <div className="text-center max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="mb-12">
        <div className="w-32 h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl mx-auto mb-8 flex items-center justify-center animate-pulse">
          <Zap className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
          Welcome to ModernApp
        </h1>
        <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
          Experience the future of web applications with our beautifully
          designed interface, powered by React and Tailwind CSS 4.x. Discover
          powerful features and intuitive navigation.
        </p>
        <button
          onClick={() => setActiveTab("dashboard")}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default WelcomeSection;
