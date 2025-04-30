
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  max: number;
  className?: string;
  showPercentage?: boolean;
  color?: 'purple' | 'blue' | 'green';
  animate?: boolean;
  showXpGain?: boolean;
  recentGain?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  current, 
  max, 
  className = '',
  showPercentage = false,
  color = 'purple',
  animate = true,
  showXpGain = false,
  recentGain = 0
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [showGainAnimation, setShowGainAnimation] = useState(false);
  
  // Calculate the real percentage (0-100)
  const actualPercentage = Math.min(Math.round((current / max) * 100), 100);
  
  // Define color gradients based on the color prop
  const gradientMap = {
    'purple': 'from-solo-purple to-solo-blue-glow',
    'blue': 'from-blue-500 to-cyan-400',
    'green': 'from-green-500 to-emerald-400'
  };
  
  const gradient = gradientMap[color];

  // Animate the progress when the current value changes
  useEffect(() => {
    if (animate) {
      // Start from current value for smoother transitions
      const startValue = displayValue;
      
      // Animate to actual value
      const timer = setTimeout(() => {
        setDisplayValue(actualPercentage);
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(actualPercentage);
    }
  }, [current, max, animate, actualPercentage]);
  
  // Show XP gain animation when recent gain is provided
  useEffect(() => {
    if (recentGain > 0) {
      setShowGainAnimation(true);
      const timer = setTimeout(() => {
        setShowGainAnimation(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [recentGain]);
  
  return (
    <div className={`w-full h-4 bg-gray-800 rounded-full overflow-hidden relative ${className}`}>
      <motion.div 
        className={`h-full bg-gradient-to-r ${gradient} relative`}
        initial={{ width: '0%' }}
        animate={{ width: `${displayValue}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjgiIGhlaWdodD0iMTYiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')]"></div>
      </motion.div>
      
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-white">{actualPercentage}%</span>
        </div>
      )}
      
      <AnimatePresence>
        {showXpGain && showGainAnimation && recentGain > 0 && (
          <motion.div 
            className="absolute right-2 top-[-20px]"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -10 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs font-bold text-solo-purple bg-solo-dark-bg/80 px-2 py-1 rounded-full">
              +{recentGain} XP
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProgressBar;
