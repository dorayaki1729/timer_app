import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';

interface TimerProps {
  isActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ isActive }) => {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
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
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (!isActive) {
      setIsRunning(false);
    }
  }, [isActive]);

  const handleStart = () => {
    if (timeLeft > 0) {
      setIsRunning(true);
      setIsFinished(false);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsFinished(false);
    setTimeLeft(minutes * 60 + seconds);
  };

  const handleSetTime = () => {
    if (!isRunning) {
      setTimeLeft(minutes * 60 + seconds);
      setIsFinished(false);
    }
  };

  const adjustMinutes = (increment: boolean) => {
    if (!isRunning) {
      const newMinutes = increment 
        ? Math.min(minutes + 1, 59)
        : Math.max(minutes - 1, 0);
      setMinutes(newMinutes);
    }
  };

  const adjustSeconds = (increment: boolean) => {
    if (!isRunning) {
      const newSeconds = increment 
        ? Math.min(seconds + 1, 59)
        : Math.max(seconds - 1, 0);
      setSeconds(newSeconds);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Time Display */}
      <div className={`text-8xl font-bold text-center mb-8 transition-all duration-300 ${
        isFinished ? 'text-red-500 animate-pulse' : 'text-white'
      }`}>
        {formatTime(timeLeft)}
      </div>

      {/* Time Setting Controls */}
      {!isRunning && (
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-center space-x-6">
            <div className="text-center">
              <div className="text-white text-sm mb-2">Minutes</div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => adjustMinutes(false)}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <Minus size={16} className="text-white" />
                </button>
                <div className="w-12 text-center text-white text-xl font-semibold">
                  {minutes.toString().padStart(2, '0')}
                </div>
                <button
                  onClick={() => adjustMinutes(true)}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <Plus size={16} className="text-white" />
                </button>
              </div>
            </div>

            <div className="text-center">
              <div className="text-white text-sm mb-2">Seconds</div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => adjustSeconds(false)}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <Minus size={16} className="text-white" />
                </button>
                <div className="w-12 text-center text-white text-xl font-semibold">
                  {seconds.toString().padStart(2, '0')}
                </div>
                <button
                  onClick={() => adjustSeconds(true)}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <Plus size={16} className="text-white" />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleSetTime}
            className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-full text-white font-semibold transition-colors"
          >
            Set Timer
          </button>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={isRunning ? handlePause : handleStart}
          disabled={timeLeft === 0 && !isRunning}
          className="w-16 h-16 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {isRunning ? (
            <Pause size={24} className="text-gray-800" />
          ) : (
            <Play size={24} className="text-gray-800 ml-1" />
          )}
        </button>

        <button
          onClick={handleReset}
          className="w-16 h-16 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 border-2 border-white"
        >
          <RotateCcw size={24} className="text-white" />
        </button>
      </div>

      {/* Finished Message */}
      {isFinished && (
        <div className="mt-6 text-center">
          <div className="text-2xl font-bold text-yellow-300 animate-bounce">
            Time's Up! ⏰
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(Timer);