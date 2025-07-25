import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SessionTabs = ({ 
  sessions, 
  activeSessionId, 
  onSessionChange, 
  onNewSession, 
  onCloseSession 
}) => {
  const [draggedTab, setDraggedTab] = useState(null);

  const handleDragStart = (e, sessionId) => {
    setDraggedTab(sessionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetSessionId) => {
    e.preventDefault();
    if (draggedTab && draggedTab !== targetSessionId) {
      // Handle tab reordering logic here
      console.log(`Move session ${draggedTab} to position of ${targetSessionId}`);
    }
    setDraggedTab(null);
  };

  const getSessionStatusColor = (status) => {
    switch (status) {
      case 'recording': return 'bg-destructive';
      case 'paused': return 'bg-warning';
      case 'completed': return 'bg-success';
      case 'draft': return 'bg-muted-foreground';
      default: return 'bg-muted-foreground';
    }
  };

  const getSessionStatusIcon = (status) => {
    switch (status) {
      case 'recording': return 'Mic';
      case 'paused': return 'Pause';
      case 'completed': return 'Check';
      case 'draft': return 'Edit';
      default: return 'FileText';
    }
  };

  return (
    <div className="flex items-center space-x-2 p-4 bg-card border-b border-border">
      {/* Session Tabs */}
      <div className="flex items-center space-x-1 flex-1 overflow-x-auto">
        {sessions.map((session) => (
          <div
            key={session.id}
            draggable
            onDragStart={(e) => handleDragStart(e, session.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, session.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg border cursor-pointer transition-all duration-150 min-w-0 ${
              activeSessionId === session.id
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-background text-foreground border-border hover:bg-muted'
            } ${draggedTab === session.id ? 'opacity-50' : ''}`}
            onClick={() => onSessionChange(session.id)}
          >
            {/* Session Status Indicator */}
            <div className="relative flex-shrink-0">
              <Icon 
                name={getSessionStatusIcon(session.status)} 
                size={16} 
                className={session.status === 'recording' ? 'animate-pulse' : ''}
              />
              <div 
                className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${getSessionStatusColor(session.status)}`}
              ></div>
            </div>

            {/* Session Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium truncate">
                  {session.patientName || `Session ${session.id}`}
                </span>
                {session.hasUnsavedChanges && (
                  <div className="w-1.5 h-1.5 bg-warning rounded-full flex-shrink-0"></div>
                )}
              </div>
              <div className="text-xs opacity-75 truncate">
                {session.startTime} • {session.duration}
              </div>
            </div>

            {/* Close Button */}
            {sessions.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseSession(session.id);
                }}
                className={`p-1 rounded hover:bg-black/10 transition-colors duration-150 flex-shrink-0 ${
                  activeSessionId === session.id ? 'hover:bg-white/20' : ''
                }`}
              >
                <Icon name="X" size={12} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* New Session Button */}
      <Button
        variant="outline"
        size="sm"
        iconName="Plus"
        iconPosition="left"
        onClick={onNewSession}
        className="flex-shrink-0"
      >
        New Session
      </Button>

      {/* Session Actions */}
      <div className="flex items-center space-x-1 flex-shrink-0">
        <button
          className="p-2 hover:bg-muted rounded-lg transition-colors duration-150"
          title="Session settings"
        >
          <Icon name="Settings" size={16} />
        </button>
        <button
          className="p-2 hover:bg-muted rounded-lg transition-colors duration-150"
          title="Export session"
        >
          <Icon name="Download" size={16} />
        </button>
      </div>
    </div>
  );
};

export default SessionTabs;