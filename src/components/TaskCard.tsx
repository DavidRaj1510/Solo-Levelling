
import React, { useState } from 'react';
import { Task } from '../context/UserContext';
import { Check, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showXpAnimation, setShowXpAnimation] = useState(false);
  
  const handleComplete = async () => {
    if (task.completed || isCompleting) return;
    
    setIsCompleting(true);
    
    // Visual feedback before API call
    setShowXpAnimation(true);
    
    // Let the animation play before completing the task
    setTimeout(async () => {
      await onComplete(task.id);
      setIsCompleting(false);
      
      // Reset XP animation after it's played
      setTimeout(() => {
        setShowXpAnimation(false);
      }, 1000);
    }, 800);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`solo-card relative ${task.completed ? 'opacity-75' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}>
            {task.name}
          </h3>
          <motion.div
            className="text-sm text-gray-400 flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Star className="text-solo-purple w-4 h-4 mr-1" />
            <span>+{task.xp} XP</span>
            {!task.completed && (
              <motion.span
                className="ml-1 text-xs text-solo-purple"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, repeat: Infinity, repeatType: "reverse", duration: 1 }}
              >
                ✨
              </motion.span>
            )}
          </motion.div>
        </div>
        
        <button
          onClick={handleComplete}
          disabled={task.completed || isCompleting}
          className={`p-3 rounded-full transition-all ${
            task.completed 
              ? 'bg-green-600/20 text-green-500 cursor-default' 
              : isCompleting
                ? 'bg-solo-purple/40 text-solo-purple cursor-wait'
                : 'bg-solo-purple/20 text-solo-purple hover:bg-solo-purple/30'
          }`}
        >
          {isCompleting ? (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-5 h-5 border-2 border-solo-purple border-t-transparent rounded-full"
            />
          ) : (
            <Check size={20} />
          )}
        </button>
      </div>
      
      <AnimatePresence>
        {showXpAnimation && !task.completed && (
          <motion.div
            className="absolute top-0 right-0 mt-2 mr-2"
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -20, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-solo-purple text-white text-xs font-bold px-2 py-1 rounded-full">
              +{task.xp} XP
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {task.completed && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-[1px] rounded-lg flex items-center justify-center"
          >
            <motion.div 
              initial={{ rotate: -10, y: 10 }}
              animate={{ rotate: 0, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="bg-green-600 text-white py-1 px-3 rounded-full text-sm font-medium"
            >
              Completed
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskCard;
