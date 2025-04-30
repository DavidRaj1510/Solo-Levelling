
import React from 'react';
import Navigation from '../components/Navigation';
import { useUser } from '../context/UserContext';
import ProfileCard from '../components/ProfileCard';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ProgressBar from '../components/ProgressBar';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const { user, ranks } = useUser();
  const navigate = useNavigate();
  
  // Find next rank
  const currentRankIndex = ranks.findIndex(rank => rank.name === user.rank);
  const nextRank = currentRankIndex < ranks.length - 1 ? ranks[currentRankIndex + 1] : null;
  
  // Calculate progress to next rank
  const currentRankMinLevel = ranks[currentRankIndex].requiredLevel;
  const nextRankMinLevel = nextRank ? nextRank.requiredLevel : ranks[ranks.length - 1].requiredLevel + 10;
  const levelsToNextRank = nextRankMinLevel - currentRankMinLevel;
  const currentProgress = user.level - currentRankMinLevel;
  const rankProgressPercentage = (currentProgress / levelsToNextRank) * 100;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Successfully signed out');
    navigate('/auth');
  };
  
  return (
    <div className="min-h-screen bg-solo-dark-bg">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <motion.h1 
            className="text-3xl font-bold text-white mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Your <span className="text-solo-purple">Profile</span>
          </motion.h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <ProfileCard user={user} />
              
              <div className="solo-card mt-4">
                <Button 
                  onClick={handleSignOut}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  variant="destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <motion.div 
                className="solo-card mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-xl font-bold text-white mb-4">Rank Progress</h2>
                
                {nextRank ? (
                  <>
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${user.rankClassName} mr-2`}></div>
                        <span className="text-gray-400">{user.rank}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-400">{nextRank.name}</span>
                        <div className={`w-3 h-3 rounded-full ${nextRank.className} ml-2`}></div>
                      </div>
                    </div>
                    
                    <ProgressBar 
                      current={currentProgress} 
                      max={levelsToNextRank}
                      color="purple"
                    />
                    
                    <motion.p 
                      className="mt-2 text-sm text-gray-400 text-center"
                      key={`levels-${levelsToNextRank - currentProgress}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {levelsToNextRank - currentProgress} more levels until {nextRank.name}
                    </motion.p>
                  </>
                ) : (
                  <motion.p 
                    className="text-center text-gray-400"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ yoyo: 5, duration: 2 }}
                  >
                    You've reached the highest rank: God of Monarchs!
                  </motion.p>
                )}
              </motion.div>
              
              <motion.div 
                className="solo-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-xl font-bold text-white mb-4">Rank Overview</h2>
                
                <div className="space-y-4">
                  {ranks.map((rank, index) => (
                    <motion.div 
                      key={rank.name} 
                      className={`p-4 rounded-lg border ${
                        user.rank === rank.name 
                          ? 'border-solo-purple bg-solo-purple/10' 
                          : 'border-gray-800 bg-gray-900/50'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                    >
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${rank.className}`}>
                          <span className="text-xs font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{rank.name}</h3>
                          <p className="text-xs text-gray-400">Required Level: {rank.requiredLevel}</p>
                        </div>
                        {user.rank === rank.name && (
                          <motion.span 
                            className="ml-auto text-xs bg-solo-purple/20 text-solo-purple px-2 py-1 rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 10, delay: 0.5 + (0.1 * index) }}
                          >
                            Current
                          </motion.span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
