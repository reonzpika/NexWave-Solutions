import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const RealTimeWidget = ({ activeSessions }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-NZ', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getSessionDuration = (startTime) => {
    const start = new Date(startTime);
    const duration = Math.floor((currentTime - start) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'recording': return 'text-destructive';
      case 'processing': return 'text-warning';
      case 'transcribing': return 'text-primary';
      case 'paused': return 'text-muted-foreground';
      default: return 'text-success';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'recording': return 'Mic';
      case 'processing': return 'Loader';
      case 'transcribing': return 'FileText';
      case 'paused': return 'Pause';
      default: return 'CheckCircle';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-clinical">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Real-Time Activity</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={16} />
          <span>{formatTime(currentTime)}</span>
        </div>
      </div>

      {activeSessions.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Activity" size={24} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No active sessions</p>
          <p className="text-sm text-muted-foreground mt-1">Start a consultation to see real-time updates</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  session.status === 'recording' ? 'bg-destructive/10' : 
                  session.status === 'processing'? 'bg-warning/10' : 'bg-primary/10'
                }`}>
                  <Icon 
                    name={getStatusIcon(session.status)} 
                    size={16} 
                    className={`${getStatusColor(session.status)} ${
                      session.status === 'processing' ? 'animate-spin' : ''
                    }`}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{session.patientName}</p>
                  <p className="text-xs text-muted-foreground capitalize">{session.status}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {getSessionDuration(session.startTime)}
                </p>
                {session.transcriptionAccuracy && (
                  <p className="text-xs text-muted-foreground">
                    {session.transcriptionAccuracy}% accuracy
                  </p>
                )}
              </div>
            </div>
          ))}
          
          <div className="pt-4 border-t border-border">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{activeSessions.length}</p>
                <p className="text-xs text-muted-foreground">Active Sessions</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-success">
                  {activeSessions.filter(s => s.status === 'recording').length}
                </p>
                <p className="text-xs text-muted-foreground">Recording</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">
                  {activeSessions.filter(s => s.status === 'processing').length}
                </p>
                <p className="text-xs text-muted-foreground">Processing</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeWidget;