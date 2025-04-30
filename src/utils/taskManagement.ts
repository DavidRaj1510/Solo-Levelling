
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define daily tasks for each level range
const getDailyTasksForLevel = (level: number) => {
  if (level >= 91) { // God of Monarchs (91-100)
    return [
      { name: '100 push-ups', xp: 50, category: 'daily' },
      { name: '60 squats', xp: 45, category: 'daily' },
      { name: 'Walk 15,000 steps', xp: 60, category: 'daily' },
      { name: 'Read 60 pages', xp: 40, category: 'daily' },
      { name: 'Meditate for 45 minutes', xp: 35, category: 'daily' }
    ];
  } else if (level >= 81) { // Monarch's Shadow (81-90)
    return [
      { name: '90 push-ups', xp: 45, category: 'daily' },
      { name: '50 squats', xp: 40, category: 'daily' },
      { name: 'Walk 14,000 steps', xp: 55, category: 'daily' },
      { name: 'Read 50 pages', xp: 35, category: 'daily' },
      { name: 'Meditate for 40 minutes', xp: 30, category: 'daily' }
    ];
  } else if (level >= 71) { // S-Rank Hunter (71-80)
    return [
      { name: '80 push-ups', xp: 40, category: 'daily' },
      { name: '40 squats', xp: 35, category: 'daily' },
      { name: 'Walk 12,000 steps', xp: 50, category: 'daily' },
      { name: 'Read 40 pages', xp: 30, category: 'daily' },
      { name: 'Meditate for 30 minutes', xp: 25, category: 'daily' }
    ];
  } else if (level >= 61) { // High-Rank Hunter (61-70)
    return [
      { name: '70 push-ups', xp: 35, category: 'daily' },
      { name: '35 squats', xp: 30, category: 'daily' },
      { name: 'Walk 10,000 steps', xp: 45, category: 'daily' },
      { name: 'Read 35 pages', xp: 25, category: 'daily' },
      { name: 'Meditate for 30 minutes', xp: 20, category: 'daily' }
    ];
  } else if (level >= 51) { // Elite Hunter (51-60)
    return [
      { name: '60 push-ups', xp: 30, category: 'daily' },
      { name: '30 squats', xp: 25, category: 'daily' },
      { name: 'Walk 9,000 steps', xp: 40, category: 'daily' },
      { name: 'Read 30 pages', xp: 20, category: 'daily' },
      { name: 'Meditate for 25 minutes', xp: 15, category: 'daily' }
    ];
  } else if (level >= 41) { // A-Rank Hunter (41-50)
    return [
      { name: '50 push-ups', xp: 25, category: 'daily' },
      { name: '25 squats', xp: 20, category: 'daily' },
      { name: 'Walk 8,000 steps', xp: 35, category: 'daily' },
      { name: 'Read 25 pages', xp: 15, category: 'daily' },
      { name: 'Meditate for 20 minutes', xp: 15, category: 'daily' }
    ];
  } else if (level >= 31) { // B-Rank Hunter (31-40)
    return [
      { name: '40 push-ups', xp: 20, category: 'daily' },
      { name: '15 squats', xp: 15, category: 'daily' },
      { name: 'Walk 7,000 steps', xp: 30, category: 'daily' },
      { name: 'Read 20 pages', xp: 15, category: 'daily' },
      { name: 'Meditate for 15 minutes', xp: 10, category: 'daily' }
    ];
  } else if (level >= 21) { // C-Rank Hunter (21-30)
    return [
      { name: '30 push-ups', xp: 20, category: 'daily' },
      { name: 'Drink 3L of water', xp: 15, category: 'daily' },
      { name: 'Walk 6,000 steps', xp: 25, category: 'daily' },
      { name: 'Read 15 pages', xp: 15, category: 'daily' },
      { name: 'Meditate for 10 minutes', xp: 10, category: 'daily' }
    ];
  } else if (level >= 11) { // D-Rank Hunter (11-20)
    return [
      { name: 'Drink 2.5L of water', xp: 15, category: 'daily' },
      { name: '20 push-ups', xp: 20, category: 'daily' },
      { name: 'Walk 4,000 steps', xp: 20, category: 'daily' },
      { name: 'Read 10 pages', xp: 10, category: 'daily' },
      { name: 'Meditate for 10 minutes', xp: 10, category: 'daily' }
    ];
  } else { // E-Rank Hunter (1-10)
    return [
      { name: 'Drink 2L of water', xp: 10, category: 'daily' },
      { name: '10 push-ups', xp: 15, category: 'daily' },
      { name: 'Walk 2,000 steps', xp: 15, category: 'daily' },
      { name: 'Read 5 pages', xp: 10, category: 'daily' },
      { name: 'Meditate for 5 minutes', xp: 5, category: 'daily' }
    ];
  }
};

// Define missions based on level ranges
const getMissionsForLevel = (level: number) => {
  if (level >= 91) { // God of Monarchs (91-100)
    return [
      { name: 'Create your Legacy Project (business, book, app, etc.)', xp: 1000, category: 'mission' },
      { name: 'Run a full marathon (42km) or equivalent life challenge', xp: 800, category: 'mission' },
      { name: 'Achieve a 60-day perfect habit streak', xp: 900, category: 'mission' },
      { name: 'Mentor and uplift someone else\'s journey', xp: 700, category: 'mission' },
      { name: 'Master a skill at the expert level', xp: 750, category: 'mission' }
    ];
  } else if (level >= 81) { // Monarch's Shadow (81-90)
    return [
      { name: 'Complete a major certification', xp: 700, category: 'mission' },
      { name: '30-day no social media detox', xp: 500, category: 'mission' },
      { name: 'Finish an ultra-long hike or endurance race', xp: 600, category: 'mission' },
      { name: 'Launch a side hustle attempt', xp: 800, category: 'mission' },
      { name: 'Create valuable content for others', xp: 550, category: 'mission' }
    ];
  } else if (level >= 71) { // S-Rank Hunter (71-80)
    return [
      { name: 'Run a half marathon (21km)', xp: 500, category: 'mission' },
      { name: 'Read 7 advanced books', xp: 400, category: 'mission' },
      { name: 'Build an online project', xp: 600, category: 'mission' },
      { name: 'Complete a 30-day 5AM challenge', xp: 450, category: 'mission' },
      { name: 'Write a comprehensive research article', xp: 350, category: 'mission' }
    ];
  } else if (level >= 61) { // High-Rank Hunter (61-70)
    return [
      { name: 'Complete an intermediate course', xp: 400, category: 'mission' },
      { name: '30 days of healthy eating', xp: 350, category: 'mission' },
      { name: 'Walk 150,000 steps in a month', xp: 300, category: 'mission' },
      { name: 'Publish a blog or creative project', xp: 450, category: 'mission' },
      { name: 'Commit to a daily cold shower for 2 weeks', xp: 250, category: 'mission' }
    ];
  } else if (level >= 51) { // Elite Hunter (51-60)
    return [
      { name: 'Finish 5 books', xp: 300, category: 'mission' },
      { name: '30-day no sugar challenge', xp: 250, category: 'mission' },
      { name: 'Run 10km', xp: 200, category: 'mission' },
      { name: 'Create a morning/evening ritual', xp: 350, category: 'mission' },
      { name: 'Learn 300 new words in a month', xp: 200, category: 'mission' }
    ];
  } else if (level >= 41) { // A-Rank Hunter (41-50)
    return [
      { name: 'Complete a 30-day mini habit challenge', xp: 250, category: 'mission' },
      { name: 'Complete a basic course', xp: 200, category: 'mission' },
      { name: 'Save $100 (or similar financial goal)', xp: 150, category: 'mission' },
      { name: 'Walk 100,000 steps in a month', xp: 300, category: 'mission' },
      { name: 'Journal every day for 21 days', xp: 180, category: 'mission' }
    ];
  } else if (level >= 31) { // B-Rank Hunter (31-40)
    return [
      { name: 'Run 7km', xp: 200, category: 'mission' },
      { name: 'Attend a live class', xp: 150, category: 'mission' },
      { name: '7-day 3L water streak', xp: 180, category: 'mission' },
      { name: 'Start a mini side project', xp: 250, category: 'mission' },
      { name: 'Learn 5 new words every day for 2 weeks', xp: 120, category: 'mission' }
    ];
  } else if (level >= 21) { // C-Rank Hunter (21-30)
    return [
      { name: 'Run 5km', xp: 150, category: 'mission' },
      { name: 'Finish 3 books', xp: 120, category: 'mission' },
      { name: 'Reflect on your journey', xp: 100, category: 'mission' },
      { name: 'Complete a 12-hour fast', xp: 180, category: 'mission' },
      { name: 'Journal for 10 minutes daily for 10 days', xp: 100, category: 'mission' }
    ];
  } else if (level >= 11) { // D-Rank Hunter (11-20)
    return [
      { name: 'Run 2km', xp: 120, category: 'mission' },
      { name: 'Finish 2 books', xp: 100, category: 'mission' },
      { name: 'Complete 10-day streak', xp: 150, category: 'mission' },
      { name: 'Learn something new (1-hour lecture)', xp: 80, category: 'mission' },
      { name: 'Practice mindfulness for a week', xp: 90, category: 'mission' }
    ];
  } else { // E-Rank Hunter (1-10)
    return [
      { name: 'Finish 1 book', xp: 100, category: 'mission' },
      { name: 'Walk 10,000 steps in a day', xp: 80, category: 'mission' },
      { name: 'Complete daily tasks for 7 days straight', xp: 150, category: 'mission' },
      { name: 'Try a new healthy recipe', xp: 50, category: 'mission' },
      { name: 'Declutter a space in your home', xp: 70, category: 'mission' }
    ];
  }
};

export const generateTasksForUser = async (userId: string, level: number) => {
  try {
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if there are already completed tasks for today (for each category)
    const { count: dailyCompletedCount, error: dailyError } = await supabase
      .from('tasks')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('category', 'daily')
      .eq('completed', true)
      .gte('completed_at', today.toISOString());
    
    if (dailyError) throw dailyError;
    
    const { count: missionsCompletedCount, error: missionsError } = await supabase
      .from('tasks')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('category', 'mission')
      .eq('completed', true)
      .gte('completed_at', today.toISOString());
    
    if (missionsError) throw missionsError;
    
    // If already 5 completed tasks for today in a category, don't generate new ones
    const generateDaily = dailyCompletedCount < 5;
    const generateMissions = missionsCompletedCount < 5;
    
    if (!generateDaily && !generateMissions) {
      console.log("All tasks completed for today, not generating new ones");
      return; // All tasks are completed for today, don't generate new ones
    }

    // Delete existing uncompleted tasks
    await supabase
      .from('tasks')
      .delete()
      .eq('user_id', userId)
      .eq('completed', false);

    // Get tasks for the current level
    const tasksToInsert = [];
    
    // Only add daily tasks if needed
    if (generateDaily) {
      const dailyTasks = getDailyTasksForLevel(level);
      tasksToInsert.push(...dailyTasks.map(task => ({ ...task, user_id: userId })));
    }
    
    // Only add missions if needed
    if (generateMissions) {
      const missions = getMissionsForLevel(level);
      tasksToInsert.push(...missions.map(task => ({ ...task, user_id: userId })));
    }
    
    // If we have tasks to insert, do so
    if (tasksToInsert.length > 0) {
      const { error } = await supabase
        .from('tasks')
        .insert(tasksToInsert);

      if (error) throw error;
    }
  } catch (error) {
    console.error('Error generating tasks:', error);
    toast.error('Failed to generate tasks');
  }
};

export const checkAndRefreshTasks = async (userId: string, level: number) => {
  try {
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if there are any tasks created today
    const { data: latestTasks, error } = await supabase
      .from('tasks')
      .select('created_at')
      .eq('user_id', userId)
      .gte('created_at', today.toISOString())
      .limit(1);

    if (error) throw error;
    
    // If no tasks have been created today, generate new ones
    if (!latestTasks || latestTasks.length === 0) {
      console.log("No tasks found for today, generating new tasks");
      await generateTasksForUser(userId, level);
      toast.success('New tasks available!');
    } else {
      console.log("Tasks already exist for today");
    }
  } catch (error) {
    console.error('Error checking tasks:', error);
  }
};

// Improve the completeTask function to better handle XP and leveling
export const completeTask = async (taskId: string, userId: string) => {
  try {
    // Get task info for XP
    const { data: task, error: fetchError } = await supabase
      .from('tasks')
      .select('xp, category')
      .eq('id', taskId)
      .single();
    
    if (fetchError) throw fetchError;

    // Mark task as completed
    const { error: updateError } = await supabase
      .from('tasks')
      .update({ 
        completed: true,
        completed_at: new Date().toISOString()
      })
      .eq('id', taskId);
    
    if (updateError) throw updateError;

    // Update user profile with earned XP
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('xp, level, xp_to_next_level, tasks_completed, missions_completed')
      .eq('id', userId)
      .single();
    
    if (profileError) throw profileError;
    
    // Calculate new XP and potential level up
    const newXp = profile.xp + task.xp;
    let newLevel = profile.level;
    let remainingXp = newXp;
    let newXpToNextLevel = profile.xp_to_next_level;
    
    // Check for level up
    while (remainingXp >= newXpToNextLevel) {
      newLevel++;
      remainingXp -= newXpToNextLevel;
      // Next level requires more XP (using an exponential formula)
      newXpToNextLevel = Math.floor(100 * Math.pow(1.5, newLevel - 1));
      toast.success(`Level up! You are now level ${newLevel}`);
      
      // Generate new tasks when leveling up to ensure appropriate difficulty
      await generateTasksForUser(userId, newLevel);
    }
    
    // Update tasks or missions completed count
    const isDaily = task.category === 'daily';
    const newTasksCompleted = isDaily ? profile.tasks_completed + 1 : profile.tasks_completed;
    const newMissionsCompleted = isDaily ? profile.missions_completed : profile.missions_completed + 1;
    
    // Update profile with new stats
    const { error: updateProfileError } = await supabase
      .from('profiles')
      .update({
        xp: remainingXp,
        level: newLevel,
        xp_to_next_level: newXpToNextLevel,
        tasks_completed: newTasksCompleted,
        missions_completed: newMissionsCompleted,
      })
      .eq('id', userId);
    
    if (updateProfileError) throw updateProfileError;
    
    toast.success(`Task completed! +${task.xp} XP`);
    return true;
  } catch (error) {
    console.error('Error completing task:', error);
    toast.error('Failed to complete task');
    return false;
  }
};

const isNewDay = (lastTaskDate: string) => {
  const last = new Date(lastTaskDate);
  const now = new Date();
  const lastMidnight = new Date(last.getFullYear(), last.getMonth(), last.getDate());
  const thisMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return thisMidnight > lastMidnight;
};
