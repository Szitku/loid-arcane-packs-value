import React, { useState } from 'react';
import { TrendingUp, Users, Zap } from 'lucide-react';
import WelcomeSection from './assets/components/sections/WelcomeSection';
import TilesSection from './assets/components/sections/TilesSection';

export default function App() {
  const [activeTab, setActiveTab] = useState('welcome');
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <button 
                  onClick={() => setActiveTab('welcome')}
                  className="text-xl font-bold text-white hover:text-white/80 transition-colors">
                  ModernApp
                </button>
              </div>
            </div>

          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        {activeTab === 'welcome' && 
          <WelcomeSection setActiveTab={setActiveTab}/>
        }

      
        {activeTab !== 'welcome' && 
        <TilesSection setActiveTab={setActiveTab} activeTab={activeTab}/>
        }
      </div>
    </div>
  );
}