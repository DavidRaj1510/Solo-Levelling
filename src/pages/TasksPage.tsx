
import React, { useEffect } from 'react';
import Navigation from '../components/Navigation';
import { useUser } from '../context/UserContext';
import TaskCard from '../components/TaskCard';
import ProfileCard from '../components/ProfileCard';
import { supabase } from '@/integrations/supabase/client';
import { checkAndRefreshTasks, completeTask } from '@/utils/taskManagement';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ListCheck } from 'lucide-react';
import { toast } from 'sonner';

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

const TasksPage = () => {
  const queryClient = useQueryClient();
  const { user, completeTask: completeTaskContext } = useUser();
  const [activeTab, setActiveTab] = React.useState<'daily' | 'missions'>('daily');

  // Get user's session
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    }
  });

  const { data: tasks = [], refetch } = useQuery({
    queryKey: ['tasks', activeTab, session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      // First get all completed tasks for today to show "all tasks completed" message if needed
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: completedTasks, error: completedError } = await supabase
        .from('tasks')
        .select('id')
        .eq('category', activeTab)
        .eq('user_id', session.user.id)
        .eq('completed', true)
        .gte('completed_at', today.toISOString())
        .order('created_at', { ascending: true });
      
      if (completedError) throw completedError;
      
      // If we have 5 completed tasks already today, return empty array to show "come back tomorrow" message
      if (completedTasks.length >= 5) {
        return [];
      }
      
      // Otherwise get the available tasks (both completed and uncompleted)
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('category', activeTab)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: true })
        .limit(5); // Limit to only 5 tasks
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user?.id
  });

  // Count of completed tasks today
  const { data: completedTasksCount = 0, refetch: refetchCompleted } = useQuery({
    queryKey: ['completed-tasks-count', activeTab, session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return 0;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count, error } = await supabase
        .from('tasks')
        .select('id', { count: 'exact' })
        .eq('category', activeTab)
        .eq('user_id', session.user.id)
        .eq('completed', true)
        .gte('completed_at', today.toISOString());
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!session?.user?.id
  });

  useEffect(() => {
    const checkTasks = async () => {
      if (!session?.user?.id) return;
      
      try {
        const { data } = await supabase
          .from('profiles')
          .select('level')
          .eq('id', session.user.id)
          .single();
        
        await checkAndRefreshTasks(session.user.id, data?.level || 1);
        refetch();
      } catch (error) {
        console.error("Error checking tasks:", error);
      }
    };

    if (session?.user) {
      checkTasks();
    }
  }, [session?.user, refetch]);

  // Handle task completion
  const handleCompleteTask = async (taskId: string) => {
    if (!session?.user?.id) return;
    
    try {
      // Also update tasks in context if needed
      const taskInfo = tasks.find(t => t.id === taskId);
      if (taskInfo) {
        // Use the context method too for local state updates
        completeTaskContext(taskId);
      }
      
      const success = await completeTask(taskId, session.user.id);
      if (success) {
        // Invalidate queries to force refresh of affected data
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        queryClient.invalidateQueries({ queryKey: ['completed-tasks-count'] });
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        
        // Refresh the data
        refetch();
        refetchCompleted();
        toast.success("Task completed! XP added to your profile.");
      }
    } catch (error) {
      console.error("Error completing task:", error);
      toast.error("Failed to complete task.");
    }
  };
  
  const allTasksCompletedToday = completedTasksCount >= 5;
  
  return (
    <div className="min-h-screen bg-solo-dark-bg">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-8">
            {activeTab === 'daily' ? 'Daily Tasks' : 'Missions'}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <ProfileCard user={user} />
              
              <div className="solo-card mt-8">
                <div className="flex">
                  <button 
                    className={`flex-1 py-2 text-center rounded-l-md transition-all ${
                      activeTab === 'daily' 
                        ? 'bg-solo-purple text-white' 
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                    onClick={() => setActiveTab('daily')}
                  >
                    Daily
                  </button>
                  <button 
                    className={`flex-1 py-2 text-center rounded-r-md transition-all ${
                      activeTab === 'missions' 
                        ? 'bg-solo-purple text-white' 
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                    onClick={() => setActiveTab('missions')}
                  >
                    Missions
                  </button>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-3">
              {(tasks.length > 0 && !allTasksCompletedToday) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tasks.map((task: SupabaseTask) => (
                    <TaskCard 
                      key={task.id} 
                      task={{
                        id: task.id,
                        name: task.name,
                        xp: task.xp,
                        completed: task.completed,
                        category: task.category as 'daily' | 'mission'
                      }} 
                      onComplete={handleCompleteTask}
                    />
                  ))}
                </div>
              ) : (
                <div className="solo-card text-center py-12">
                  <div className="flex flex-col items-center justify-center">
                    <ListCheck className="w-12 h-12 text-gray-500 mb-4" />
                    <p className="text-gray-400">
                      {allTasksCompletedToday 
                        ? `All ${activeTab === 'daily' ? 'daily tasks' : 'missions'} completed! Come back tomorrow.` 
                        : `No ${activeTab === 'daily' ? 'daily tasks' : 'missions'} available right now. Check back later!`}
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

export default TasksPage;
