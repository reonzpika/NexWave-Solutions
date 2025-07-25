import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import MetricsCard from './components/MetricsCard';
import StartConsultationCard from './components/StartConsultationCard';
import RecentConsultationsTable from './components/RecentConsultationsTable';
import QuickAccessSidebar from './components/QuickAccessSidebar';
import TierUsageIndicator from './components/TierUsageIndicator';

const Dashboard = () => {
  const [userTier, setUserTier] = useState('basic');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Simulate user tier detection with loading state
    const initializeDashboard = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        const tier = localStorage.getItem('userTier') || 'basic';
        setUserTier(tier);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDashboard();

    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Mock metrics data
  const todayMetrics = {
    consultationsToday: 8,
    totalTimeSaved: '2.3 hours',
    averageSessionTime: '12.5 min',
    completionRate: '94%'
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-NZ', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-NZ', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Dashboard - ClinicPro</title>
        <meta name="description" content="Clinical consultation management dashboard for New Zealand general practitioners" />
      </Helmet>

      <div className="relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:mr-80">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 lg:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground mb-2 truncate">
                    Good {getGreeting()}, Dr. Wilson
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {formatDate(currentTime)} • {formatTime(currentTime)}
                  </p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="flex items-center space-x-2 text-sm text-success">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    <span className="hidden sm:inline">System Online</span>
                    <span className="sm:hidden">Online</span>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2 rounded-md border border-border hover:bg-muted/50 transition-colors"
                  >
                    <Icon name="Menu" size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6 lg:mb-8">
              <Icon name="Home" size={16} />
              <span>Dashboard</span>
            </nav>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
              <MetricsCard
                title="Today's Consultations"
                value={todayMetrics.consultationsToday}
                subtitle="Active sessions: 2"
                icon="Users"
                trend="up"
                trendValue="+12% from yesterday"
                color="primary"
              />
              <MetricsCard
                title="Time Saved Today"
                value={todayMetrics.totalTimeSaved}
                subtitle="Documentation efficiency"
                icon="Clock"
                trend="up"
                trendValue="+18 min from avg"
                color="success"
              />
              <MetricsCard
                title="Avg Session Time"
                value={todayMetrics.averageSessionTime}
                subtitle="Including note generation"
                icon="Timer"
                trend="down"
                trendValue="-2.3 min improvement"
                color="accent"
              />
              <MetricsCard
                title="Completion Rate"
                value={todayMetrics.completionRate}
                subtitle="Sessions with notes"
                icon="CheckCircle"
                trend="up"
                trendValue="+2% this week"
                color="success"
              />
            </div>

            {/* Main Action Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-6 lg:mb-8">
              <div className="lg:col-span-1">
                <StartConsultationCard />
              </div>
              <div className="lg:col-span-2">
                <TierUsageIndicator userTier={userTier} />
              </div>
            </div>

            {/* Recent Consultations */}
            <div className="mb-6 lg:mb-8">
              <RecentConsultationsTable />
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <div className={`fixed right-0 top-0 w-80 h-screen bg-background border-l border-border z-50 transform transition-transform duration-300 lg:hidden ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Quick Access</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-muted/50 rounded-md transition-colors"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
          </div>
          <div className="p-4 overflow-y-auto">
            <QuickAccessSidebar userTier={userTier} />
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block fixed right-0 top-0 w-80 h-screen bg-background border-l border-border overflow-y-auto">
          <div className="p-6">
            <QuickAccessSidebar userTier={userTier} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;