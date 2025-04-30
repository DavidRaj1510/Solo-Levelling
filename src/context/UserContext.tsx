
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

export interface Task {
  id: string;
  name: string;
  xp: number;
  completed: boolean;
  category: 'daily' | 'mission';
}

export interface Rank {
  name: string;
  requiredLevel: number;
  className: string;
}

export interface User {
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  tasksCompleted: number;
  missionsCompleted: number;
  rank: string;
  rankClassName: string;
  achievements: string[];
}

interface UserContextType {
  user: User;
  tasks: Task[];
  completeTask: (taskId: string) => void;
  resetDailyTasks: () => void;
  ranks: Rank[];
}

const ranks: Rank[] = [
  { name: 'E-Rank Hunter', requiredLevel: 1, className: 'rank-e' },
  { name: 'D-Rank Hunter', requiredLevel: 11, className: 'rank-d' },
  { name: 'C-Rank Hunter', requiredLevel: 21, className: 'rank-c' },
  { name: 'B-Rank Hunter', requiredLevel: 31, className: 'rank-b' },
  { name: 'A-Rank Hunter', requiredLevel: 41, className: 'rank-a' },
  { name: 'Elite Hunter', requiredLevel: 51, className: 'rank-s' },
  { name: 'High-Rank Hunter', requiredLevel: 61, className: 'rank-s' },
  { name: 'S-Rank Hunter', requiredLevel: 71, className: 'rank-s' },
  { name: "Monarch's Shadow", requiredLevel: 81, className: 'rank-monarch' },
  { name: 'God of Monarchs', requiredLevel: 91, className: 'rank-monarch' },
];

// Calculate XP required for a given level
const calculateXpForLevel = (level: number): number => {
  // Exponential growth formula
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize user from localStorage or set defaults
  const [user, setUser] = useState<User>(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      return JSON.parse(savedUser);
    }
    return {
      name: 'Hunter',
      level: 1,
      xp: 0,
      xpToNextLevel: calculateXpForLevel(1),
      tasksCompleted: 0,
      missionsCompleted: 0,
      rank: 'E-Rank Hunter',
      rankClassName: 'rank-e',
      achievements: []
    };
  });

  // Initialize tasks based on user's level
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      return JSON.parse(savedTasks);
    }
    return generateTasksForLevel(1);
  });

  // Save to localStorage when user or tasks change
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Generate tasks based on user level
  function generateTasksForLevel(level: number): Task[] {
    // Default tasks for E-Rank (levels 1-10)
    let dailyTasks = [
      { id: 'd1', name: 'Drink 2L of water', xp: 20, completed: false, category: 'daily' as const },
      { id: 'd2', name: '10 push-ups', xp: 30, completed: false, category: 'daily' as const },
      { id: 'd3', name: 'Walk 2,000 steps', xp: 25, completed: false, category: 'daily' as const },
      { id: 'd4', name: 'Read 5 pages', xp: 20, completed: false, category: 'daily' as const },
      { id: 'd5', name: 'Meditate for 5 minutes', xp: 15, completed: false, category: 'daily' as const }
    ];
    
    let missions = [
      { id: 'm1', name: 'Finish 1 book', xp: 100, completed: false, category: 'mission' as const },
      { id: 'm2', name: 'Walk 10,000 steps in a day', xp: 80, completed: false, category: 'mission' as const },
      { id: 'm3', name: 'Complete daily tasks for 7 days straight', xp: 150, completed: false, category: 'mission' as const }
    ];
    
    // Adjust tasks based on level range
    if (level >= 11 && level <= 20) {
      // D-Rank Hunter
      dailyTasks = [
        { id: 'd1', name: 'Drink 2.5L of water', xp: 25, completed: false, category: 'daily' as const },
        { id: 'd2', name: '20 push-ups', xp: 40, completed: false, category: 'daily' as const },
        { id: 'd3', name: 'Walk 4,000 steps', xp: 35, completed: false, category: 'daily' as const },
        { id: 'd4', name: 'Read 10 pages', xp: 30, completed: false, category: 'daily' as const },
        { id: 'd5', name: 'Meditate for 10 minutes', xp: 25, completed: false, category: 'daily' as const }
      ];
      
      missions = [
        { id: 'm1', name: 'Run 2km', xp: 120, completed: false, category: 'mission' as const },
        { id: 'm2', name: 'Finish 2 books', xp: 150, completed: false, category: 'mission' as const },
        { id: 'm3', name: 'Complete 10-day streak', xp: 200, completed: false, category: 'mission' as const },
        { id: 'm4', name: 'Learn something new (1-hour lecture)', xp: 100, completed: false, category: 'mission' as const }
      ];
    } 
    else if (level >= 21 && level <= 30) {
      // C-Rank Hunter
      dailyTasks = [
        { id: 'd1', name: 'Drink 3L of water', xp: 30, completed: false, category: 'daily' as const },
        { id: 'd2', name: '30 push-ups', xp: 50, completed: false, category: 'daily' as const },
        { id: 'd3', name: 'Walk 6,000 steps', xp: 45, completed: false, category: 'daily' as const },
        { id: 'd4', name: 'Read 15 pages', xp: 40, completed: false, category: 'daily' as const },
        { id: 'd5', name: 'Meditate for 10 minutes', xp: 35, completed: false, category: 'daily' as const },
        { id: 'd6', name: 'Journal for 10 minutes', xp: 35, completed: false, category: 'daily' as const }
      ];
      
      missions = [
        { id: 'm1', name: 'Run 5km', xp: 200, completed: false, category: 'mission' as const },
        { id: 'm2', name: 'Finish 3 books', xp: 250, completed: false, category: 'mission' as const },
        { id: 'm3', name: 'Reflect on your journey', xp: 100, completed: false, category: 'mission' as const },
        { id: 'm4', name: 'Complete a 12-hour fast', xp: 150, completed: false, category: 'mission' as const }
      ];
    }
    
    // Continue for higher levels...
    // Only showing three level ranges in this implementation for brevity
    
    return [...dailyTasks, ...missions];
  }
  
  // Calculate user's rank based on level
  const calculateRank = (level: number) => {
    for (let i = ranks.length - 1; i >= 0; i--) {
      if (level >= ranks[i].requiredLevel) {
        return { name: ranks[i].name, className: ranks[i].className };
      }
    }
    return { name: 'E-Rank Hunter', className: 'rank-e' };
  };

  // Handle completing a task
  const completeTask = (taskId: string) => {
    const taskToComplete = tasks.find(task => task.id === taskId);
    if (!taskToComplete || taskToComplete.completed) return;

    // Mark task as completed
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed: true } : task
      )
    );

    // Update user stats
    const earnedXp = taskToComplete.xp;
    const isTaskDaily = taskToComplete.category === 'daily';
    
    setUser(prevUser => {
      const newXp = prevUser.xp + earnedXp;
      const xpForNextLevel = calculateXpForLevel(prevUser.level);
      
      // Check if user should level up
      if (newXp >= xpForNextLevel) {
        const newLevel = prevUser.level + 1;
        const rank = calculateRank(newLevel);
        
        // Update tasks if user reaches a new rank
        if (rank.name !== prevUser.rank) {
          setTasks(generateTasksForLevel(newLevel));
        }
        
        return {
          ...prevUser,
          level: newLevel,
          xp: newXp - xpForNextLevel, // Carry over excess XP
          xpToNextLevel: calculateXpForLevel(newLevel),
          tasksCompleted: isTaskDaily ? prevUser.tasksCompleted + 1 : prevUser.tasksCompleted,
          missionsCompleted: isTaskDaily ? prevUser.missionsCompleted : prevUser.missionsCompleted + 1,
          rank: rank.name,
          rankClassName: rank.className
        };
      }
      
      // No level up
      return {
        ...prevUser,
        xp: newXp,
        tasksCompleted: isTaskDaily ? prevUser.tasksCompleted + 1 : prevUser.tasksCompleted,
        missionsCompleted: isTaskDaily ? prevUser.missionsCompleted : prevUser.missionsCompleted + 1
      };
    });
  };

  // Reset daily tasks (typically called at the start of a new day)
  const resetDailyTasks = () => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.category === 'daily' ? { ...task, completed: false } : task
      )
    );
  };

  return (
    <UserContext.Provider value={{ user, tasks, completeTask, resetDailyTasks, ranks }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
