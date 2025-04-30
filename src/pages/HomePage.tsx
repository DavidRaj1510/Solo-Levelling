
import React, { useEffect, useRef } from 'react';
import ImageCarousel from '../components/ImageCarousel';
import VideoCarousel from '../components/VideoCarousel';
import AiAssistant from '../components/AiAssistant';
import Navigation from '../components/Navigation';
import { useUser } from '../context/UserContext';
import ProfileCard from '../components/ProfileCard';
import TaskCard from '../components/TaskCard';
import { Star, Trophy, Award } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { completeTask } from '@/utils/taskManagement';
import { toast } from 'sonner';

const HomePage = () => {
  const { user } = useUser();
  const location = useLocation();
  const heroRef = useRef<HTMLElement>(null);
  
  // Get user's session
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    }
  });

  // Get tasks from Supabase directly
  const { data: tasks = [], refetch } = useQuery({
    queryKey: ['homepage-tasks'],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('category', 'daily')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: true })
        .limit(3);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user?.id
  });
  
  // Show welcome notification only once when the app is first loaded
  useEffect(() => {
    // Check if this is a new session (not just navigating between pages)
    // Use localStorage to track if the welcome message has been shown in this browser session
    const hasShownWelcome = localStorage.getItem('welcomeShown');
    
    if (!hasShownWelcome) {
      setTimeout(() => {
        toast("King, Tell me how can I help you today", {
          icon: <img src="https://i.redd.it/8zmpaofxyx271.png" alt="Beru" className="w-8 h-8 rounded-full" />,
          duration: 5000,
        });
        localStorage.setItem('welcomeShown', 'true');
      }, 2000);
    }
  }, []);
  
  // Scroll to top when navigating to home page
  useEffect(() => {
    if (location.pathname === '/') {
      window.scrollTo(0, 0);
      
      // Focus on hero section when navigating to home
      if (heroRef.current) {
        heroRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    }
  }, [location.pathname]);
  const images = [
    'https://wallpapercave.com/wp/wp10311762.png',
    'https://staticg.sportskeeda.com/editor/2024/05/b4751-17159410592278-1920.jpg',
    'https://i.pinimg.com/736x/1e/35/70/1e3570e8a88afe3c0f9eebfdfc01b27b.jpg',
    'https://i.pinimg.com/736x/1c/28/c5/1c28c55385715094e257e657732c680f.jpg',
    'https://wallpapercave.com/wp/wp10311799.jpg',
    'https://wallpapercave.com/wp/wp9048248.jpg',
    'https://static0.gamerantimages.com/wordpress/wp-content/uploads/2025/02/jinwoo-and-shadow-army-solo-leveling-cropped-1.jpg?q=70&fit=crop&w=1140&h=&dpr=1',
  ];
  
  const videoUrls = [
    'https://drive.google.com/file/d/1qkabPjfjVxPr8gumLC3_bSaJEQnlRmoS/view?usp=sharing',
    'https://drive.google.com/file/d/1XBmwGlbaSVb9LhZHIaQQUJ9bsXY4tiHP/view?usp=sharing',
    'https://drive.google.com/file/d/1HDVTaWuw6Ec8hx0F351q4tlive5t9k4v/view?usp=sharing',
    'https://drive.google.com/file/d/133CxBG-hFHjuC_uDTx8NlWZ3Bgx-HNbv/view?usp=sharing',
    'https://drive.google.com/file/d/1xCehInPVaZG2wBwQE5C7ll36Ksx5Jcxq/view?usp=sharing',
    'https://drive.google.com/file/d/1Xl_AoQL0BwxLLG-NPH4E3HIsNa7SftH_/view?usp=sharing',
    'https://drive.google.com/file/d/1TbEleHfRn9y_SPw9Thy4s9CrgOO3CKrR/view?usp=sharing',
  ];


  // Handle task completion directly with Supabase
  const handleCompleteTask = async (taskId: string) => {
    if (!session?.user?.id) return;
    
    const success = await completeTask(taskId, session.user.id);
    if (success) {
      refetch();
      toast.success("Task completed! XP added to your profile.");
    }
  };
  
  return (
    <>
      <Navigation />
      
      <section id="hero" ref={heroRef} className="relative">
        <ImageCarousel images={images} />
      </section>

      <section id="dashboard" className="py-16 bg-solo-dark-bg relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <ProfileCard user={user} />
            </div>
            
            <div className="md:col-span-2">
              <div className="solo-card">
                <h2 className="text-xl font-bold text-white mb-4">Today's Tasks</h2>
                <div className="space-y-4">
                  {tasks.map(task => (
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
                  <Link to="/tasks" className="text-solo-purple hover:text-solo-light-purple text-sm flex justify-center mt-4">
                    View all tasks →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="videos">
        <VideoCarousel videoUrls={videoUrls} />
      </section>
      
      <section id="ai-assistant">
        <AiAssistant />
      </section>
      
      <section id="features" className="py-16 bg-solo-dark-bg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Your Path to <span className="text-solo-purple">Becoming Stronger</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="solo-card flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-solo-purple/20 flex items-center justify-center mb-4">
                <Star className="text-solo-purple w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Daily Tasks</h3>
              <p className="text-gray-400">Complete simple daily tasks to earn XP and build consistent habits.</p>
            </div>
            
            <div className="solo-card flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-solo-purple/20 flex items-center justify-center mb-4">
                <Trophy className="text-solo-purple w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Missions</h3>
              <p className="text-gray-400">Take on bigger challenges to gain substantial XP boosts and level up faster.</p>
            </div>
            
            <div className="solo-card flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-solo-purple/20 flex items-center justify-center mb-4">
                <Award className="text-solo-purple w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Rank Progression</h3>
              <p className="text-gray-400">Rise from E-Rank Hunter to God of Monarchs as you level up your real-life stats.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
