
import React, { useState, useEffect } from 'react';
import { User } from '../context/UserContext';
import { Award, Trophy, Star } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface ProfileCardProps {
  user: User;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  // Track previous values for animation
  const [prevXp, setPrevXp] = useState(user.xp);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [recentXpGain, setRecentXpGain] = useState(0);
  
  // Get user's session for data from Supabase
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    }
  });
  
  // Fetch profile data from Supabase if available
  const { data: profileData, refetch: refetchProfile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });
  
  // Update stats from Supabase if available
  useEffect(() => {
    if (profileData) {
      // If we have Supabase data, we'll refetch it when the local user object changes
      // This ensures we're always displaying the latest data
      if (user.xp !== prevXp) {
        refetchProfile();
      }
    }
  }, [user, prevXp, refetchProfile, profileData]);
  
  useEffect(() => {
    // Check if XP has increased
    if (user.xp > prevXp) {
      // Calculate the XP gain
      const gain = user.xp - prevXp;
      setRecentXpGain(gain);
      
      // Reset XP gain indicator after a delay
      const gainTimer = setTimeout(() => {
        setRecentXpGain(0);
      }, 2000);
      
      return () => clearTimeout(gainTimer);
    }
    
    // Update previous XP
    setPrevXp(user.xp);
  }, [user.xp, prevXp]);
  
  useEffect(() => {
    // Check for level up by comparing with localStorage
    const prevLevel = localStorage.getItem('prevUserLevel');
    if (prevLevel && parseInt(prevLevel) < user.level) {
      setIsLevelingUp(true);
      
      // Reset level up animation after a delay
      const timer = setTimeout(() => {
        setIsLevelingUp(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
    
    // Store current level
    localStorage.setItem('prevUserLevel', user.level.toString());
  }, [user.level]);
  
  // Use profile data from Supabase if available, otherwise use context data
  const displayedUser = {
    ...user,
    xp: profileData?.xp ?? user.xp,
    level: profileData?.level ?? user.level,
    xpToNextLevel: profileData?.xp_to_next_level ?? user.xpToNextLevel,
    tasksCompleted: profileData?.tasks_completed ?? user.tasksCompleted,
    missionsCompleted: profileData?.missions_completed ?? user.missionsCompleted,
    rank: profileData?.rank ?? user.rank,
    rankClassName: profileData?.rank_class_name ?? user.rankClassName
  };
  
  return (
    <div className="solo-card overflow-hidden relative">
      <div className="flex flex-col md:flex-row items-center mb-6">
        <motion.div 
          className={`w-24 h-24 rounded-full bg-gradient-to-br from-solo-purple to-solo-blue-glow p-1 mb-4 md:mb-0 md:mr-6`}
          animate={isLevelingUp ? { 
            scale: [1, 1.2, 1],
            boxShadow: ["0px 0px 0px rgba(130, 94, 254, 0)", "0px 0px 30px rgba(130, 94, 254, 0.8)", "0px 0px 0px rgba(130, 94, 254, 0)"]
          } : {}}
          transition={{ duration: 1, repeat: isLevelingUp ? 2 : 0 }}
        >
          <div className="w-full h-full bg-solo-dark-bg rounded-full flex items-center justify-center">
            <Award className="text-solo-purple w-12 h-12" />
          </div>
        </motion.div>
        
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-white">{displayedUser.name}</h2>
          <div className="flex items-center justify-center md:justify-start">
            <div className={`${displayedUser.rankClassName} px-3 py-1 rounded-full text-xs font-medium`}>
              {displayedUser.rank}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <motion.span 
            className="text-gray-400"
            key={`level-${displayedUser.level}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Level {displayedUser.level}
          </motion.span>
          <div className="flex items-center">
            <motion.span 
              className="text-gray-400"
              key={`xp-${displayedUser.xp}`}
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {displayedUser.xp}
            </motion.span>
            <span className="text-gray-400">/{displayedUser.xpToNextLevel} XP</span>
          </div>
        </div>
        
        <ProgressBar 
          current={displayedUser.xp} 
          max={displayedUser.xpToNextLevel} 
          color="purple"
          showXpGain={true}
          recentGain={recentXpGain}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          className="bg-solo-dark-purple/50 p-4 rounded-lg"
          key={`tasks-${displayedUser.tasksCompleted}`}
          animate={{ scale: [1, displayedUser.tasksCompleted > 0 ? 1.05 : 1, 1] }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-2">
            <Star className="text-solo-blue-glow w-5 h-5 mr-2" />
            <span className="text-sm text-gray-400">Tasks Completed</span>
          </div>
          <motion.p 
            className="text-2xl font-bold text-white"
            key={`tasks-count-${displayedUser.tasksCompleted}`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {displayedUser.tasksCompleted}
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="bg-solo-dark-purple/50 p-4 rounded-lg"
          key={`missions-${displayedUser.missionsCompleted}`}
          animate={{ scale: [1, displayedUser.missionsCompleted > 0 ? 1.05 : 1, 1] }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-2">
            <Trophy className="text-solo-purple w-5 h-5 mr-2" />
            <span className="text-sm text-gray-400">Missions Completed</span>
          </div>
          <motion.p 
            className="text-2xl font-bold text-white"
            key={`missions-count-${displayedUser.missionsCompleted}`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {displayedUser.missionsCompleted}
          </motion.p>
        </motion.div>
      </div>
      
      <AnimatePresence>
        {isLevelingUp && (
          <motion.div 
            className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gradient-to-r from-solo-purple to-solo-blue-glow p-1 rounded-lg"
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <div className="bg-solo-dark-bg p-6 rounded-lg">
                <motion.h3 
                  className="text-2xl font-bold text-white mb-2 text-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: 2, duration: 0.6 }}
                >
                  Level Up!
                </motion.h3>
                <p className="text-solo-purple text-center text-lg">
                  You are now level {displayedUser.level}
                </p>
                <div className="flex justify-center mt-4">
                  <motion.div 
                    className="w-16 h-16 bg-solo-purple/20 rounded-full flex items-center justify-center"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 15, 0, -15, 0]
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Award className="text-solo-purple w-10 h-10" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileCard;
