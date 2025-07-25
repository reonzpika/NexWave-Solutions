import React from 'react';
import Icon from '../AppIcon';

const SessionStatusWidget = ({ activeSessions, isCollapsed, onSessionControl }) => {
  const activeCount = activeSessions.filter(session => session.status === 'active').length;
  const pausedCount = activeSessions.filter(session => session.status === 'paused').length;

  if (isCollapsed) {
    return (
      <div className="relative group">
        <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
          <div className="flex space-x-0.5">
            <div className="w-1.5 h-1.5 bg-success rounded-full animate-status-dot"></div>
            <div className="w-1.5 h-1.5 bg-success rounded-full animate-status-dot-delay-1"></div>
            <div className="w-1.5 h-1.5 bg-success rounded-full animate-status-dot-delay-2"></div>
          </div>
        </div>
        
        {/* Tooltip */}
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-popover text-popover-foreground p-3 rounded-lg shadow-clinical-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-1200 min-w-64">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="Clock" size={16} className="text-success" />
            <span className="font-medium">Active Sessions</span>
          </div>
          
          <div className="space-y-2">
            {activeSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-medium">{session.patientName}</p>
                  <p className="text-muted-foreground">{session.startTime}</p>
                </div>
                <div className={`flex items-center space-x-1 ${
                  session.status === 'active' ? 'text-success' : 'text-warning'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    session.status === 'active' ? 'bg-success animate-pulse' : 'bg-warning'
                  }`}></div>
                  <span className="capitalize">{session.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Clock" size={16} className="text-success" />
          <span className="text-sm font-medium">Active Sessions</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-success rounded-full animate-status-dot"></div>
          <div className="w-2 h-2 bg-success rounded-full animate-status-dot-delay-1"></div>
          <div className="w-2 h-2 bg-success rounded-full animate-status-dot-delay-2"></div>
        </div>
      </div>
      
      <div className="space-y-2">
        {activeSessions.map((session) => (
          <div key={session.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session.patientName}</p>
              <p className="text-xs text-muted-foreground">{session.startTime}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`flex items-center space-x-1 ${
                session.status === 'active' ? 'text-success' : 'text-warning'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  session.status === 'active' ? 'bg-success animate-pulse' : 'bg-warning'
                }`}></div>
                <span className="text-xs capitalize">{session.status}</span>
              </div>
              
              <button
                onClick={() => onSessionControl(session.id, session.status === 'active' ? 'pause' : 'resume')}
                className="p-1 hover:bg-muted rounded transition-colors duration-150"
              >
                <Icon 
                  name={session.status === 'active' ? 'Pause' : 'Play'} 
                  size={12} 
                />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
        <span>{activeCount} active, {pausedCount} paused</span>
        <button className="text-primary hover:underline">
          View All Sessions
        </button>
      </div>
    </div>
  );
};

export default SessionStatusWidget;