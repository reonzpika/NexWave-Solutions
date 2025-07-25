import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import { cn } from '../../utils/cn';

const NavigationSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      path: '/dashboard',
      description: 'Overview and quick actions'
    },
    {
      id: 'ai-scribe',
      label: 'AI Scribe',
      icon: 'Mic',
      path: '/ai-scribe-consultation',
      description: 'Voice-to-text consultation recording'
    },
    {
      id: 'clinical-assistant',
      label: 'Clinical Assistant',
      icon: 'Stethoscope',
      path: '/context-aware-clinical-assistant',
      description: 'Intelligent clinical search and guidance'
    },
    {
      id: 'image-analyzer',
      label: 'Image Analyzer',
      icon: 'Camera',
      path: '/image-analyzer',
      description: 'AI-powered medical image analysis'
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: 'FileText',
      path: '/template-management',
      description: 'Manage consultation templates'
    },
    {
      id: 'sessions',
      label: 'Sessions',
      icon: 'Users',
      path: '/session-management',
      description: 'Active session monitoring'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'BarChart3',
      path: '/user-analytics-dashboard',
      description: 'Usage insights and performance metrics'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card border border-border rounded-lg shadow-clinical"
        aria-label="Toggle navigation menu"
      >
        <Icon name={isMobileOpen ? "X" : "Menu"} size={20} className="text-foreground" />
      </button>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={toggleMobileSidebar}
          aria-hidden="true"
        />
      )}

      {/* Navigation Sidebar */}
      <nav 
        className={cn(
          "fixed left-0 top-0 h-screen bg-card border-r border-border shadow-clinical-lg z-50 transition-all duration-300 ease-in-out",
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "w-16" : "w-72"
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Stethoscope" size={18} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground text-lg">ClinicPro</h1>
                <p className="text-xs text-muted-foreground">AI Medical Assistant</p>
              </div>
            </div>
          )}
          
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex p-1.5 hover:bg-muted rounded-md transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Icon 
              name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
              size={16} 
              className="text-muted-foreground" 
            />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col py-4 space-y-1 px-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path || 
                           (item.path === '/dashboard' && location.pathname === '/');
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "flex items-center w-full text-left transition-all duration-200 rounded-lg group",
                  "hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  isCollapsed ? "p-3 justify-center" : "p-3",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20" :"text-muted-foreground hover:text-foreground"
                )}
                title={isCollapsed ? item.label : item.description}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon 
                  name={item.icon} 
                  size={20} 
                  className={cn(
                    "transition-colors",
                    isCollapsed ? "" : "mr-3",
                    isActive ? "text-primary" : "group-hover:text-foreground"
                  )} 
                />
                
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.label}</div>
                    <div className="text-xs text-muted-foreground truncate mt-0.5">
                      {item.description}
                    </div>
                  </div>
                )}
                
                {!isCollapsed && isActive && (
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card">
          {!isCollapsed && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span>System Online</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Dr. Sarah Wilson • Standard Plan
              </div>
            </div>
          )}
          
          {isCollapsed && (
            <div className="flex justify-center">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default NavigationSidebar;