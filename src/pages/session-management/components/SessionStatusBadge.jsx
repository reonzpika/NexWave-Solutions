import React from 'react';
import Icon from '../../../components/AppIcon';

const SessionStatusBadge = ({ status }) => {
  const statusConfig = {
    recording: {
      label: 'Recording',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
      icon: 'Mic',
      pulse: true
    },
    processing: {
      label: 'Processing',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      icon: 'Loader',
      pulse: false
    },
    paused: {
      label: 'Paused',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
      icon: 'Pause',
      pulse: false
    },
    completed: {
      label: 'Completed',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/50',
      borderColor: 'border-muted',
      icon: 'CheckCircle',
      pulse: false
    },
    error: {
      label: 'Error',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/20',
      icon: 'AlertCircle',
      pulse: false
    }
  };

  const config = statusConfig[status] || statusConfig.completed;

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border ${config.bgColor} ${config.borderColor}`}>
      <div className="relative">
        <Icon 
          name={config.icon} 
          size={14} 
          className={`${config.color} ${config.pulse ? 'animate-pulse' : ''}`} 
        />
        {config.pulse && (
          <div className="absolute inset-0 w-3.5 h-3.5 bg-success/20 rounded-full animate-ping"></div>
        )}
      </div>
      <span className={`text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    </div>
  );
};

export default SessionStatusBadge;