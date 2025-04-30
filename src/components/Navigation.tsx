
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handleNavClick = (path: string) => {
    if (location.pathname === path) {
      // If we're already on this page, scroll to top
      window.scrollTo(0, 0);
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/70 to-transparent backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            onClick={() => handleNavClick('/')} 
            className="flex items-center cursor-pointer"
          >
            <span className="text-2xl font-bold text-white">
              Solo<span className="text-solo-purple">Leveling</span>
            </span>
          </div>
          
          {isMobile ? (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-400 hover:text-white">Menu</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[200px] p-2 gap-2">
                      <div 
                        onClick={() => handleNavClick('/')} 
                        className="nav-link p-2 block cursor-pointer"
                      >
                        Home
                      </div>
                      <Link to="/tasks" className="nav-link p-2 block">Daily Tasks</Link>
                      <Link to="/missions" className="nav-link p-2 block">Missions</Link>
                      <Link to="/profile" className="nav-link p-2 block">Profile</Link>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleSignOut}
                        className="text-gray-400 hover:text-white w-full flex items-center justify-start p-2"
                      >
                        Sign Out
                      </Button>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          ) : (
            <div className="flex items-center space-x-8">
              <div 
                onClick={() => handleNavClick('/')} 
                className="nav-link cursor-pointer"
              >
                Home
              </div>
              <Link to="/tasks" className="nav-link">Daily Tasks</Link>
              <Link to="/missions" className="nav-link">Missions</Link>
              <Link to="/profile" className="nav-link">Profile</Link>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleSignOut}
                className="text-gray-400 hover:text-white"
              >
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
