import React, { useState, useEffect } from 'react';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import KPICard from './components/KPICard';
import UsageChart from './components/UsageChart';
import SessionBreakdownTable from './components/SessionBreakdownTable';
import TierUsageWidget from './components/TierUsageWidget';
import RealTimeWidget from './components/RealTimeWidget';
import ComparisonWidget from './components/ComparisonWidget';
import FilterControls from './components/FilterControls';
import Icon from '../../components/AppIcon';


const UserAnalyticsDashboard = () => {
  const [filters, setFilters] = useState({
    dateRange: '30d',
    consultationType: 'all',
    template: 'all',
    startDate: '',
    endDate: ''
  });

  const [userTier, setUserTier] = useState('standard');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Simulate data loading with error handling
    const timer = setTimeout(() => {
      try {
        // Simulate potential API error
        if (Math.random() > 0.9) {
          throw new Error('Failed to load analytics data');
        }
        setIsLoading(false);
        setError(null);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [filters]);

  // Mock data for KPI cards
  const kpiData = [
    {
      title: 'Total Sessions',
      value: '247',
      unit: '',
      trend: 'up',
      trendValue: '+12%',
      icon: 'Activity',
      color: 'primary'
    },
    {
      title: 'Avg Session Duration',
      value: '18.5',
      unit: 'min',
      trend: 'down',
      trendValue: '-8%',
      icon: 'Clock',
      color: 'success'
    },
    {
      title: 'Note Generation Time',
      value: '2.3',
      unit: 'min',
      trend: 'down',
      trendValue: '-15%',
      icon: 'FileText',
      color: 'accent'
    },
    {
      title: 'Time Saved',
      value: '42.7',
      unit: 'hrs',
      trend: 'up',
      trendValue: '+23%',
      icon: 'Zap',
      color: 'warning'
    }
  ];

  // Mock data for usage charts
  const usagePatternData = [
    { name: 'Mon', sessions: 12, duration: 18.5 },
    { name: 'Tue', sessions: 15, duration: 19.2 },
    { name: 'Wed', sessions: 18, duration: 17.8 },
    { name: 'Thu', sessions: 14, duration: 20.1 },
    { name: 'Fri', sessions: 16, duration: 18.9 },
    { name: 'Sat', sessions: 8, duration: 16.5 },
    { name: 'Sun', sessions: 5, duration: 15.2 }
  ];

  const peakHoursData = [
    { name: '8AM', value: 5 },
    { name: '9AM', value: 12 },
    { name: '10AM', value: 18 },
    { name: '11AM', value: 15 },
    { name: '12PM', value: 8 },
    { name: '1PM', value: 6 },
    { name: '2PM', value: 14 },
    { name: '3PM', value: 16 },
    { name: '4PM', value: 12 },
    { name: '5PM', value: 7 }
  ];

  // Mock session data
  const sessionData = [
    {
      id: 1,
      date: '25/07/2025',
      patientId: 'P001234',
      duration: '15:30',
      transcriptionAccuracy: 96,
      processingTime: 2.1,
      template: 'General',
      status: 'completed'
    },
    {
      id: 2,
      date: '25/07/2025',
      patientId: 'P001235',
      duration: '22:15',
      transcriptionAccuracy: 94,
      processingTime: 2.8,
      template: 'Mental Health',
      status: 'completed'
    },
    {
      id: 3,
      date: '24/07/2025',
      patientId: 'P001236',
      duration: '18:45',
      transcriptionAccuracy: 98,
      processingTime: 1.9,
      template: 'Chronic Care',
      status: 'completed'
    },
    {
      id: 4,
      date: '24/07/2025',
      patientId: 'P001237',
      duration: '12:30',
      transcriptionAccuracy: 92,
      processingTime: 2.3,
      template: 'General',
      status: 'processing'
    },
    {
      id: 5,
      date: '23/07/2025',
      patientId: 'P001238',
      duration: '25:10',
      transcriptionAccuracy: 89,
      processingTime: 3.1,
      template: 'Pediatric',
      status: 'failed'
    }
  ];

  // Mock tier usage data
  const tierUsageData = {
    aiScribe: {
      used: 45,
      limit: 100
    },
    premiumFeatures: {
      used: 3,
      limit: 5
    },
    resetDate: '1st August 2025'
  };

  // Mock active sessions
  const activeSessions = [
    {
      id: 1,
      patientName: 'John Smith',
      startTime: new Date(Date.now() - 900000), // 15 minutes ago
      status: 'recording',
      transcriptionAccuracy: 94
    },
    {
      id: 2,
      patientName: 'Sarah Johnson',
      startTime: new Date(Date.now() - 1800000), // 30 minutes ago
      status: 'processing'
    }
  ];

  // Mock comparison data
  const userStats = {
    avgSessionDuration: 18.5,
    transcriptionAccuracy: 95.2,
    timeSaved: 12.3,
    sessionsPerDay: 8.2
  };

  const peerData = {
    avgSessionDuration: 22.1,
    transcriptionAccuracy: 92.8,
    timeSaved: 9.7,
    sessionsPerDay: 7.5
  };

  const historicalData = {
    avgSessionDuration: 24.3,
    transcriptionAccuracy: 89.1,
    timeSaved: 8.2,
    sessionsPerDay: 6.8
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setIsLoading(true);
    setError(null);
  };

  const handleExport = () => {
    // Mock export functionality
    console.log('Exporting analytics data...');
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleUpgrade = () => {
    console.log('Redirecting to upgrade page...');
  };

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationSidebar isOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />
        <div className="lg:ml-72 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <Icon name="AlertTriangle" size={24} className="text-destructive" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Failed to Load Analytics</h2>
            <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
            <button
              onClick={handleRefresh}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationSidebar />
        <div className="ml-16 lg:ml-72 transition-all duration-300 p-4 sm:p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-80 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar />
      
      <div className="ml-16 lg:ml-72 transition-all duration-300 p-4 sm:p-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Comprehensive insights into your consultation efficiency and system usage
          </p>
        </div>

        {/* Filter Controls */}
        <div className="mb-6">
          <FilterControls
            filters={filters}
            onFilterChange={handleFilterChange}
            onExport={handleExport}
            onRefresh={handleRefresh}
          />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          {kpiData.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <UsageChart
            data={usagePatternData}
            type="line"
            title="Weekly Usage Patterns"
            height={300}
          />
          <UsageChart
            data={peakHoursData}
            type="bar"
            title="Peak Consultation Hours"
            height={300}
          />
        </div>

        {/* Widgets Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <TierUsageWidget
            userTier={userTier}
            usageData={tierUsageData}
            onUpgrade={handleUpgrade}
          />
          <RealTimeWidget activeSessions={activeSessions} />
          <div className="lg:col-span-1">
            <ComparisonWidget
              userStats={userStats}
              peerData={peerData}
              historicalData={historicalData}
            />
          </div>
        </div>

        {/* Session Breakdown Table */}
        <div className="mb-6 lg:mb-8">
          <SessionBreakdownTable sessions={sessionData} />
        </div>

        {/* Footer */}
        <div className="text-center text-xs sm:text-sm text-muted-foreground">
          <p>Data updated in real-time • Last refresh: {new Date().toLocaleTimeString('en-NZ')}</p>
          <p className="mt-1">© {new Date().getFullYear()} ClinicPro. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default UserAnalyticsDashboard;