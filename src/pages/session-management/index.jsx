import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import SessionOverviewCard from './components/SessionOverviewCard';
import SessionFilters from './components/SessionFilters';
import SessionTableRow from './components/SessionTableRow';
import SystemResourceMonitor from './components/SystemResourceMonitor';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const SessionManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [systemResources, setSystemResources] = useState({});

  // Mock data for sessions
  useEffect(() => {
    const mockSessions = [
      {
        id: 'sess_001',
        patientName: 'John Smith',
        patientId: 'PAT_12345',
        startTime: '09:30 AM',
        date: '25/07/2025',
        duration: 23,
        status: 'recording',
        consultationType: 'General Consultation',
        template: 'Standard GP Template',
        audioQuality: 95,
        transcriptionProgress: 85,
        noteProgress: 0,
        confidenceScore: 92,
        imageCount: 2,
        attachmentCount: 1,
        guidelineCount: 3
      },
      {
        id: 'sess_002',
        patientName: 'Sarah Johnson',
        patientId: 'PAT_12346',
        startTime: '10:15 AM',
        date: '25/07/2025',
        duration: 18,
        status: 'processing',
        consultationType: 'Follow-up',
        template: 'Follow-up Template',
        audioQuality: 88,
        transcriptionProgress: 100,
        noteProgress: 65,
        confidenceScore: 89,
        imageCount: 0,
        attachmentCount: 2,
        guidelineCount: 1
      },
      {
        id: 'sess_003',
        patientName: 'Michael Brown',
        patientId: 'PAT_12347',
        startTime: '11:00 AM',
        date: '25/07/2025',
        duration: 15,
        status: 'paused',
        consultationType: 'Skin Check',
        template: 'Dermatology Template',
        audioQuality: 92,
        transcriptionProgress: 45,
        noteProgress: 0,
        confidenceScore: 87,
        imageCount: 5,
        attachmentCount: 0,
        guidelineCount: 2
      },
      {
        id: 'sess_004',
        patientName: 'Emma Wilson',
        patientId: 'PAT_12348',
        startTime: '08:45 AM',
        date: '25/07/2025',
        duration: 32,
        status: 'completed',
        consultationType: 'Annual Check-up',
        template: 'Comprehensive Template',
        audioQuality: 96,
        transcriptionProgress: 100,
        noteProgress: 100,
        confidenceScore: 94,
        imageCount: 1,
        attachmentCount: 3,
        guidelineCount: 4
      },
      {
        id: 'sess_005',
        patientName: 'David Lee',
        patientId: 'PAT_12349',
        startTime: '02:30 PM',
        date: '24/07/2025',
        duration: 28,
        status: 'completed',
        consultationType: 'Chronic Care',
        template: 'Chronic Disease Template',
        audioQuality: 91,
        transcriptionProgress: 100,
        noteProgress: 100,
        confidenceScore: 91,
        imageCount: 0,
        attachmentCount: 1,
        guidelineCount: 5
      },
      {
        id: 'sess_006',
        patientName: 'Lisa Chen',
        patientId: 'PAT_12350',
        startTime: '03:15 PM',
        date: '24/07/2025',
        duration: 0,
        status: 'error',
        consultationType: 'Emergency',
        template: 'Emergency Template',
        audioQuality: 0,
        transcriptionProgress: 0,
        noteProgress: 0,
        confidenceScore: 0,
        imageCount: 0,
        attachmentCount: 0,
        guidelineCount: 0
      }
    ];

    const mockResources = {
      cpu: 45,
      memory: 62,
      memoryUsed: 12.4,
      memoryTotal: 20,
      networkSpeed: 150,
      uploadSpeed: '25 Mbps',
      downloadSpeed: '125 Mbps',
      connectionQuality: 'Excellent',
      storage: 78,
      storageUsed: 156,
      storageTotal: 200
    };

    setTimeout(() => {
      setSessions(mockSessions);
      setFilteredSessions(mockSessions);
      setSystemResources(mockResources);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter sessions based on search and filters
  useEffect(() => {
    let filtered = sessions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(session =>
        session.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.consultationType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(session => session.status === statusFilter);
    }

    // Date filter (simplified for demo)
    if (dateFilter === 'today') {
      filtered = filtered.filter(session => session.date === '25/07/2025');
    } else if (dateFilter === 'yesterday') {
      filtered = filtered.filter(session => session.date === '24/07/2025');
    }

    setFilteredSessions(filtered);
  }, [sessions, searchTerm, statusFilter, dateFilter]);

  const handleSessionAction = (sessionId, action) => {
    setSessions(prevSessions =>
      prevSessions.map(session => {
        if (session.id === sessionId) {
          switch (action) {
            case 'pause':
              return { ...session, status: 'paused' };
            case 'resume':
              return { ...session, status: 'recording' };
            case 'stop':
              return { ...session, status: 'completed' };
            case 'view': console.log('Viewing session:', sessionId);
              return session;
            case 'menu': console.log('Opening menu for session:', sessionId);
              return session;
            default:
              return session;
          }
        }
        return session;
      })
    );
  };

  const handleToggleExpand = (sessionId, isExpanded) => {
    console.log(`Session ${sessionId} expanded: ${isExpanded}`);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('today');
  };

  const handleBulkAction = (action) => {
    console.log('Bulk action:', action);
    // Implement bulk actions here
  };

  const getOverviewStats = () => {
    const activeSessions = sessions.filter(s => s.status === 'recording' || s.status === 'processing').length;
    const pausedSessions = sessions.filter(s => s.status === 'paused').length;
    const completedToday = sessions.filter(s => s.status === 'completed' && s.date === '25/07/2025').length;
    const avgDuration = sessions.length > 0 
      ? Math.round(sessions.reduce((acc, s) => acc + s.duration, 0) / sessions.length)
      : 0;

    return {
      activeSessions,
      pausedSessions,
      completedToday,
      avgDuration
    };
  };

  const stats = getOverviewStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationSidebar />
        <div className="ml-16 lg:ml-72 transition-all duration-300">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-3">
                <Icon name="Loader2" size={24} className="animate-spin text-primary" />
                <span className="text-lg text-muted-foreground">Loading session data...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Session Management - ClinicPro</title>
        <meta name="description" content="Manage multiple concurrent consultations with comprehensive session oversight and real-time monitoring." />
      </Helmet>

      <NavigationSidebar />
      
      <div className="ml-16 lg:ml-72 transition-all duration-300">
        <div className="p-4 sm:p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Session Management</h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Monitor and manage multiple concurrent consultations with real-time oversight
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="Settings"
                iconPosition="left"
                size="sm"
              >
                <span className="hidden sm:inline">Settings</span>
              </Button>
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                size="sm"
              >
                <span className="hidden sm:inline">New Session</span>
              </Button>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <SessionOverviewCard
              title="Active Sessions"
              value={stats.activeSessions}
              subtitle="Currently recording or processing"
              icon="Activity"
              color="text-success"
            />
            <SessionOverviewCard
              title="Paused Sessions"
              value={stats.pausedSessions}
              subtitle="Temporarily paused consultations"
              icon="Pause"
              color="text-warning"
            />
            <SessionOverviewCard
              title="Completed Today"
              value={stats.completedToday}
              subtitle="Successfully processed sessions"
              icon="CheckCircle"
              color="text-primary"
            />
            <SessionOverviewCard
              title="Average Duration"
              value={`${stats.avgDuration}m`}
              subtitle="Mean consultation length"
              icon="Clock"
            />
          </div>

          {/* System Resources Monitor */}
          <SystemResourceMonitor resources={systemResources} />

          {/* Session Filters */}
          <SessionFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            onClearFilters={handleClearFilters}
            onBulkAction={handleBulkAction}
          />

          {/* Sessions Table */}
          <div className="bg-card border border-border rounded-lg shadow-clinical overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-border">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Active Sessions ({filteredSessions.length})
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    <span className="text-sm text-muted-foreground">Live Updates</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Start Time
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {filteredSessions.length > 0 ? (
                    filteredSessions.map((session) => (
                      <SessionTableRow
                        key={session.id}
                        session={session}
                        onSessionAction={handleSessionAction}
                        onToggleExpand={handleToggleExpand}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 sm:px-6 py-12 text-center">
                        <div className="flex flex-col items-center space-y-3">
                          <Icon name="Search" size={48} className="text-muted-foreground/50" />
                          <div>
                            <h3 className="text-lg font-medium text-foreground">No sessions found</h3>
                            <p className="text-muted-foreground text-sm">
                              {searchTerm || statusFilter !== 'all' || dateFilter !== 'today' ?'Try adjusting your filters to see more results.' :'Start a new consultation session to see it here.'}
                            </p>
                          </div>
                          {(searchTerm || statusFilter !== 'all' || dateFilter !== 'today') && (
                            <Button
                              variant="outline"
                              onClick={handleClearFilters}
                              iconName="RotateCcw"
                              iconPosition="left"
                              size="sm"
                            >
                              Clear Filters
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions Footer */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6 shadow-clinical">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {selectedSessions.length} session(s) selected
                </span>
                {selectedSessions.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Pause"
                      iconPosition="left"
                    >
                      Pause Selected
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Download"
                      iconPosition="left"
                    >
                      Export Selected
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Clock" size={16} />
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionManagement;