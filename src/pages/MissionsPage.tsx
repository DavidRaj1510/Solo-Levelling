
import React, { useEffect } from 'react';
import Navigation from '../components/Navigation';
import { useUser } from '../context/UserContext';
import TaskCard from '../components/TaskCard';
import ProfileCard from '../components/ProfileCard';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { completeTask, checkAndRefreshTasks } from '@/utils/taskManagement';
import { toast } from 'sonner';
import { Trophy } from 'lucide-react';

// Define a type that matches Supabase's task structure
interface SupabaseTask {
  id: string;
  name: string;
  xp: number;
  completed: boolean;
  category: string;
  created_at: string;
  completed_at: string | null;
  user_id: string;
}

const MissionsPage = () => {
  // Get the user session instead of the user object from context
  const { user } = useUser();
  
  // Get user's session
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    }
  });
  
  // Count of completed missions today
  const { data: completedMissionsCount = 0 } = useQuery({
    queryKey: ['completed-missions-count'],
    queryFn: async () => {
      if (!session?.user?.id) return 0;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count, error } = await supabase
        .from('tasks')
        .select('id', { count: 'exact' })
        .eq('category', 'mission')
        .eq('user_id', session.user.id)
        .eq('completed', true)
        .gte('completed_at', today.toISOString());
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!session?.user?.id
  });

  const allMissionsCompletedToday = completedMissionsCount >= 5;
  
  const { data: missions = [], refetch: refetchMissions } = useQuery({
    queryKey: ['missions', allMissionsCompletedToday],
    queryFn: async () => {
      if (!session?.user?.id || allMissionsCompletedToday) return [];
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('category', 'mission')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: true })
        .limit(5); // Limit to 5 missions
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user?.id && !allMissionsCompletedToday
  });

  // Check for new tasks when the page loads
  useEffect(() => {
    const checkTasks = async () => {
      if (!session?.user?.id) return;
      
      const { data } = await supabase
        .from('profiles')
        .select('level')
        .eq('id', session.user.id)
        .single();
      
      await checkAndRefreshTasks(session.user.id, data?.level || 1);
      refetchMissions();
    };
    
    if (session?.user) {
      checkTasks();
    }
  }, [session?.user, refetchMissions]);

  const handleCompleteTask = async (taskId: string) => {
    if (!session?.user?.id) return;
    
    const success = await completeTask(taskId, session.user.id);
    if (success) {
      refetchMissions();
      toast.success("Mission completed! XP added to your profile.");
    }
  };

  return (
    <div className="min-h-screen bg-solo-dark-bg">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-8">
            Your <span className="text-solo-purple">Missions</span>
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <ProfileCard user={user} />
              
              <div className="solo-card mt-8">
                <h3 className="text-lg font-semibold text-white mb-4">Mission Info</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Complete missions to earn more XP and rank up faster! Missions provide significant XP boosts.
                </p>
                <div className="bg-solo-dark-purple/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-400">
                    Level Required: <span className="text-white">1</span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-3">
              {(missions.length > 0 && !allMissionsCompletedToday) ? (
                <div className="grid grid-cols-1 gap-4">
                  {missions.map((mission: SupabaseTask) => (
                    <TaskCard 
                      key={mission.id} 
                      task={{
                        id: mission.id,
                        name: mission.name,
                        xp: mission.xp,
                        completed: mission.completed,
                        category: mission.category as 'daily' | 'mission'
                      }} 
                      onComplete={handleCompleteTask} 
                    />
                  ))}
                </div>
              ) : (
                <div className="solo-card text-center py-12">
                  <div className="flex flex-col items-center justify-center">
                    <Trophy className="w-12 h-12 text-gray-500 mb-4" />
                    <p className="text-gray-400">
                      {allMissionsCompletedToday 
                        ? 'All missions completed! Come back tomorrow.' 
                        : 'No missions available right now. Check back later!'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionsPage;
