import React from "react";
import {Star , TrendingUp, Users, Zap, MessageCircle, Share2, Heart } from "lucide-react";

const TilesSection = ({ setActiveTab, activeTab }) => {
  const tiles = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: TrendingUp,
      desc: "Overview & Stats",
    },
    { id: "projects", label: "Projects", icon: Users, desc: "Active Work" },
    { id: "analytics", label: "Analytics", icon: Zap, desc: "Performance" },
    { id: "reports", label: "Reports", icon: Star, desc: "Data Reports" },
    {
      id: "messages",
      label: "Messages",
      icon: MessageCircle,
      desc: "Team Chat",
    },
    { id: "settings", label: "Settings", icon: Share2, desc: "App Config" },
    { id: "calendar", label: "Calendar", icon: Heart, desc: "Schedule" },
    { id: "files", label: "Files", icon: Users, desc: "Documents" },
  ];

    const stats = [
    { icon: Users, label: 'Active Users', value: '12.4K', change: '+12%' },
    { icon: TrendingUp, label: 'Revenue', value: '$84.2K', change: '+18%' },
    { icon: Zap, label: 'Performance', value: '98.2%', change: '+2.1%' },
  ];

  const projects = [
    { name: 'AI Dashboard', status: 'In Progress', progress: 75, color: 'bg-blue-500' },
    { name: 'Mobile App', status: 'Review', progress: 90, color: 'bg-purple-500' },
    { name: 'Website Redesign', status: 'Planning', progress: 25, color: 'bg-green-500' },
  ];

  return (
    (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {tiles.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-4 rounded-xl border transition-all duration-300 text-left hover:scale-105 ${
              activeTab === tab.id
                ? "bg-white text-slate-900 border-white shadow-2xl"
                : "bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/15 hover:border-white/30"
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    : "bg-white/20 text-white/80"
                }`}
              >
                <tab.icon className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold">{tab.label}</h3>
            </div>
            <p
              className={`text-xs ${
                activeTab === tab.id ? "text-slate-600" : "text-white/60"
              }`}
            >
              {tab.desc}
            </p>
          </button>
        ))}
      </div>
    ) &&
    tiles.map((tile) => tile.id).includes(activeTab) && (
      <div className="space-y-8">
        {activeTab === "dashboard" && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/70 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {stat.value}
                      </p>
                      <p className="text-green-400 text-sm mt-1">
                        {stat.change}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </> 
        )}

        {activeTab === "projects" && (
          <>
            <h2 className="text-2xl font-bold text-white">Active Projects</h2>
            <div className="grid gap-6">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">
                      {project.name}
                    </h3>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm text-white/80">
                      {project.status}
                    </span>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-white/70 mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${project.color}`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "analytics" && (
          <>
            <h2 className="text-2xl font-bold text-white">
              Analytics Overview
            </h2>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <TrendingUp className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Performance Metrics
                </h3>
                <p className="text-white/70 max-w-md mx-auto">
                  Your application is performing exceptionally well with high
                  user engagement and optimal load times across all devices.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  {["97.8%", "1.2s", "99.9%", "4.8/5"].map((metric, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {metric}
                      </div>
                      <div className="text-white/60 text-sm">
                        {["Score", "Load Time", "Uptime", "Rating"][index]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    )
  );
};

export default TilesSection;
