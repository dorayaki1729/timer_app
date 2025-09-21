import React, { useState } from 'react';
import { Clock, Timer as TimerIcon } from 'lucide-react';
import Timer from './components/Timer';
import Stopwatch from './components/Stopwatch';

function App() {
  const [activeTab, setActiveTab] = useState<'timer' | 'stopwatch'>('timer');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Time Keeper
          </h1>
          <p className="text-white/80 text-lg">
            Your colorful timer & stopwatch companion
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 flex space-x-2">
            <button
              onClick={() => setActiveTab('timer')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${
                activeTab === 'timer'
                  ? 'bg-white text-purple-600 shadow-lg transform scale-105'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <TimerIcon size={20} />
              <span className="font-semibold">Timer</span>
            </button>
            <button
              onClick={() => setActiveTab('stopwatch')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${
                activeTab === 'stopwatch'
                  ? 'bg-white text-purple-600 shadow-lg transform scale-105'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <Clock size={20} />
              <span className="font-semibold">Stopwatch</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl">
          {activeTab === 'timer' ? (
            <Timer isActive={activeTab === 'timer'} />
          ) : (
            <Stopwatch isActive={activeTab === 'stopwatch'} />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">
            Made with ❤️ for productive timing
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;