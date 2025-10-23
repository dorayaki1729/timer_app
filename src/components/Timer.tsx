import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';

// Constants
const INITIAL_MINUTES = 5;
const INITIAL_SECONDS = 0;
const MAX_MINUTES = 59;
const MAX_SECONDS = 59;
const INTERVAL_MS = 1000;

// Types
interface TimerProps {
  isActive: boolean;
}

// Custom Hook
const useTimer = () => {
  const [minutes, setMinutes] = useState<number>(INITIAL_MINUTES);
  const [seconds, setSeconds] = useState<number>(INITIAL_SECONDS);
  const [timeLeft, setTimeLeft] = useState<number>(INITIAL_MINUTES * 60 + INITIAL_SECONDS);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsFinished(false);
    setTimeLeft(minutes * 60 + seconds);
  }, [minutes, seconds]);

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
      }, INTERVAL_MS);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleStart = useCallback(() => {
    if (timeLeft > 0) {
      setIsRunning(true);
      setIsFinished(false);
    }
  }, [timeLeft]);

  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleSetTime = useCallback(() => {
    if (!isRunning) {
      setTimeLeft(minutes * 60 + seconds);
      setIsFinished(false);
    }
  }, [isRunning, minutes, seconds]);

  const adjustTime = useCallback((type: 'minutes' | 'seconds', increment: boolean) => {
    if (isRunning) return;
    
    if (type === 'minutes') {
      setMinutes(prev => 
        increment ? Math.min(prev + 1, MAX_MINUTES) : Math.max(prev - 1, 0)
      );
    } else {
      setSeconds(prev => 
        increment ? Math.min(prev + 1, MAX_SECONDS) : Math.max(prev - 1, 0)
      );
    }
  }, [isRunning]);

  return {
    minutes,
    seconds,
    timeLeft,
    isRunning,
    setIsRunning,
    isFinished,
    resetTimer,
    handleStart,
    handlePause,
    handleSetTime,
    adjustTime
  };
};

// Utility Functions
const formatTime = (totalSeconds: number): string => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const Timer: React.FC<TimerProps> = React.memo(({ isActive }) => {
  const {
    minutes,
    seconds,
    timeLeft,
    isRunning,
    setIsRunning,
    isFinished,
    handleStart,
    handlePause,
    handleSetTime,
    adjustTime
  } = useTimer();

  useEffect(() => {
    if (!isActive) {
      setIsRunning(false);
    }
  }, [isActive]);

  // Memoized Components
  const TimeDisplay = React.memo(() => (
    <div className={`text-8xl font-bold text-center mb-8 transition-all duration-300 ${
      isFinished ? 'text-red-500 animate-pulse' : 'text-white'
    }`}>
      {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
      {String(timeLeft % 60).padStart(2, '0')}
    </div>
  ));

  const TimeControls = React.memo(() => (
    !isRunning && (
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-center space-x-6">
          <div className="text-center">
            <div className="text-white text-sm mb-2">Minutes</div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => adjustTime('minutes', false)}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <Minus size={16} className="text-white" />
              </button>
              <div className="w-12 text-center text-white text-xl font-semibold">
                {String(minutes).padStart(2, '0')}
              </div>
              <button
                onClick={() => adjustTime('minutes', true)}
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
                onClick={() => adjustTime('seconds', false)}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <Minus size={16} className="text-white" />
              </button>
              <div className="w-12 text-center text-white text-xl font-semibold">
                {String(seconds).padStart(2, '0')}
              </div>
              <button
                onClick={() => adjustTime('seconds', true)}
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
    )
  ));

  const ControlButtons = React.memo(() => (
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
        onClick={resetTimer}
        className="w-16 h-16 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 border-2 border-white"
      >
        <RotateCcw size={24} className="text-white" />
      </button>
    </div>
  ));

  return (
    <div className="w-full max-w-md mx-auto">
      <TimeDisplay />
      <TimeControls />
      <ControlButtons />

      {isFinished && (
        <div className="mt-6 text-center">
          <div className="text-2xl font-bold text-yellow-300 animate-bounce">
            Time's Up! ⏰
          </div>
        </div>
      )}
    </div>
  );
});

export default Timer;