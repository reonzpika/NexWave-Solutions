import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import SessionStatusBadge from './SessionStatusBadge';

const SessionTableRow = ({ session, onSessionAction, onToggleExpand }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    onToggleExpand(session.id, !isExpanded);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getProgressPercentage = () => {
    if (session.status === 'completed') return 100;
    if (session.status === 'processing') return session.transcriptionProgress || 0;
    if (session.status === 'recording') return Math.min((session.duration / 30) * 100, 95);
    return 0;
  };

  return (
    <>
      <tr className="border-b border-border hover:bg-muted/50 transition-colors duration-150">
        <td className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleToggleExpand}
              className="p-1 hover:bg-muted rounded transition-colors duration-150"
            >
              <Icon 
                name={isExpanded ? "ChevronDown" : "ChevronRight"} 
                size={16} 
                className="text-muted-foreground"
              />
            </button>
            <div>
              <p className="font-medium text-foreground">{session.patientName}</p>
              <p className="text-sm text-muted-foreground">ID: {session.patientId}</p>
            </div>
          </div>
        </td>
        
        <td className="px-6 py-4">
          <div>
            <p className="text-sm font-medium text-foreground">{session.startTime}</p>
            <p className="text-xs text-muted-foreground">{session.date}</p>
          </div>
        </td>
        
        <td className="px-6 py-4">
          <span className="text-sm font-medium text-foreground">
            {formatDuration(session.duration)}
          </span>
        </td>
        
        <td className="px-6 py-4">
          <SessionStatusBadge status={session.status} />
        </td>
        
        <td className="px-6 py-4">
          <div className="flex items-center space-x-2">
            {session.status === 'recording' && (
              <Button
                variant="outline"
                size="sm"
                iconName="Pause"
                iconPosition="left"
                onClick={() => onSessionAction(session.id, 'pause')}
              >
                Pause
              </Button>
            )}
            
            {session.status === 'paused' && (
              <Button
                variant="outline"
                size="sm"
                iconName="Play"
                iconPosition="left"
                onClick={() => onSessionAction(session.id, 'resume')}
              >
                Resume
              </Button>
            )}
            
            {(session.status === 'recording' || session.status === 'paused') && (
              <Button
                variant="destructive"
                size="sm"
                iconName="Square"
                iconPosition="left"
                onClick={() => onSessionAction(session.id, 'stop')}
              >
                Stop
              </Button>
            )}
            
            {session.status === 'completed' && (
              <Button
                variant="outline"
                size="sm"
                iconName="Eye"
                iconPosition="left"
                onClick={() => onSessionAction(session.id, 'view')}
              >
                View
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              iconName="MoreHorizontal"
              onClick={() => onSessionAction(session.id, 'menu')}
            />
          </div>
        </td>
      </tr>
      
      {isExpanded && (
        <tr className="border-b border-border bg-muted/20">
          <td colSpan="5" className="px-6 py-4">
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">Progress</span>
                  <span className="text-sm text-muted-foreground">{getProgressPercentage()}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      session.status === 'recording' ? 'bg-success' :
                      session.status === 'processing' ? 'bg-primary' :
                      session.status === 'completed' ? 'bg-success' : 'bg-warning'
                    }`}
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Session Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Session Info</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Type: {session.consultationType}</p>
                    <p>Template: {session.template}</p>
                    <p>Audio Quality: {session.audioQuality}%</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">AI Processing</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Transcription: {session.transcriptionProgress || 0}%</p>
                    <p>Note Generation: {session.noteProgress || 0}%</p>
                    <p>Confidence: {session.confidenceScore || 0}%</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Clinical Data</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Images: {session.imageCount || 0}</p>
                    <p>Attachments: {session.attachmentCount || 0}</p>
                    <p>Guidelines: {session.guidelineCount || 0}</p>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex items-center space-x-2 pt-2 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                  iconPosition="left"
                >
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Share"
                  iconPosition="left"
                >
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Copy"
                  iconPosition="left"
                >
                  Duplicate
                </Button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default SessionTableRow;