import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';

interface StopwatchProps {
  isActive: boolean;
}

const Stopwatch: React.FC<StopwatchProps> = ({ isActive }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    if (!isActive) {
      setIsRunning(false);
    }
  }, [isActive]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps((prevLaps) => [time, ...prevLaps]);
    }
  };

  const formatTime = (timeInMs: number) => {
    const minutes = Math.floor(timeInMs / 60000);
    const seconds = Math.floor((timeInMs % 60000) / 1000);
    const centiseconds = Math.floor((timeInMs % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Time Display */}
      <div className="text-8xl font-bold text-center text-white mb-8">
        {formatTime(time)}
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={isRunning ? handlePause : handleStart}
          className="w-16 h-16 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          {isRunning ? (
            <Pause size={24} className="text-gray-800" />
          ) : (
            <Play size={24} className="text-gray-800 ml-1" />
          )}
        </button>

        <button
          onClick={handleLap}
          disabled={!isRunning}
          className="w-16 h-16 bg-yellow-400 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <Flag size={24} className="text-gray-800" />
        </button>

        <button
          onClick={handleReset}
          className="w-16 h-16 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 border-2 border-white"
        >
          <RotateCcw size={24} className="text-white" />
        </button>
      </div>

      {/* Lap Times */}
      {laps.length > 0 && (
        <div className="bg-white/10 rounded-2xl p-4 max-h-64 overflow-y-auto">
          <h3 className="text-white font-semibold text-lg mb-3 text-center">
            Lap Times
          </h3>
          <div className="space-y-2">
            {laps.map((lapTime, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-white/10 rounded-lg p-3 transition-all duration-200 hover:bg-white/20"
              >
                <span className="text-white font-medium">
                  Lap {laps.length - index}
                </span>
                <span className="text-white font-mono text-lg">
                  {formatTime(lapTime)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Stopwatch;