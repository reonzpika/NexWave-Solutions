import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import { cn } from '../../utils/cn';

const RealTimeDashboard = ({ 
  sessionId, 
  isRecording, 
  sessionDuration, 
  onSessionControl,
  className 
}) => {
  const [metrics, setMetrics] = useState({
    noteGenerationTime: 0,
    sessionTimer: 0,
    wordCount: 0,
    avgConfidence: 0,
    estimatedTimeSaved: 0,
    processingStatus: 'idle'
  });

  const [noteGenerationStart, setNoteGenerationStart] = useState(null);

  // Update session timer
  useEffect(() => {
    setMetrics(prev => ({
      ...prev,
      sessionTimer: sessionDuration
    }));
  }, [sessionDuration]);

  // Mock real-time metrics updates
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setMetrics(prev => ({
          ...prev,
          wordCount: prev.wordCount + Math.floor(Math.random() * 3),
          avgConfidence: 85 + Math.floor(Math.random() * 10),
          estimatedTimeSaved: Math.floor(sessionDuration * 0.65 / 60) // 65% efficiency gain
        }));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isRecording, sessionDuration]);

  // Track note generation time
  const startNoteGeneration = () => {
    setNoteGenerationStart(Date.now());
    setMetrics(prev => ({
      ...prev,
      processingStatus: 'generating'
    }));
  };

  const completeNoteGeneration = () => {
    if (noteGenerationStart) {
      const generationTime = (Date.now() - noteGenerationStart) / 1000;
      setMetrics(prev => ({
        ...prev,
        noteGenerationTime: generationTime,
        processingStatus: 'completed'
      }));
      setNoteGenerationStart(null);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'generating': return 'text-warning';
      case 'completed': return 'text-success';
      case 'error': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'generating': return 'Loader';
      case 'completed': return 'CheckCircle';
      case 'error': return 'AlertCircle';
      default: return 'Clock';
    }
  };

  return (
    <div className={cn("bg-card border border-border rounded-lg p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Real-Time Metrics</h3>
        <div className={`flex items-center space-x-1 ${isRecording ? 'text-success' : 'text-muted-foreground'}`}>
          <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`}></div>
          <span className="text-xs">{isRecording ? 'Live' : 'Idle'}</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Session Timer */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Session Duration</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-mono font-bold text-foreground">
              {formatTime(metrics.sessionTimer)}
            </div>
          </div>
        </div>

        {/* Note Generation Time */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon 
              name={getStatusIcon(metrics.processingStatus)} 
              size={16} 
              className={cn(
                getStatusColor(metrics.processingStatus),
                metrics.processingStatus === 'generating' && 'animate-spin'
              )} 
            />
            <span className="text-sm font-medium text-foreground">Note Generation</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-mono text-foreground">
              {metrics.noteGenerationTime > 0 ? `${metrics.noteGenerationTime.toFixed(1)}s` : '--'}
            </div>
            <div className="text-xs text-muted-foreground">Processing Time</div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-2 bg-muted/20 rounded">
            <div className="flex items-center space-x-1 mb-1">
              <Icon name="FileText" size={12} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Words</span>
            </div>
            <div className="text-sm font-semibold text-foreground">{metrics.wordCount}</div>
          </div>

          <div className="p-2 bg-muted/20 rounded">
            <div className="flex items-center space-x-1 mb-1">
              <Icon name="Zap" size={12} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Confidence</span>
            </div>
            <div className="text-sm font-semibold text-foreground">{metrics.avgConfidence}%</div>
          </div>

          <div className="p-2 bg-muted/20 rounded col-span-2">
            <div className="flex items-center space-x-1 mb-1">
              <Icon name="TrendingUp" size={12} className="text-success" />
              <span className="text-xs text-muted-foreground">Est. Time Saved</span>
            </div>
            <div className="text-sm font-semibold text-success">
              {metrics.estimatedTimeSaved} minutes
            </div>
          </div>
        </div>

        {/* Session Controls */}
        <div className="pt-3 border-t border-border">
          <div className="flex space-x-2">
            <button
              onClick={() => onSessionControl?.('pause')}
              disabled={!isRecording}
              className="flex-1 flex items-center justify-center space-x-1 p-2 text-xs bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
            >
              <Icon name="Pause" size={12} />
              <span>Pause</span>
            </button>
            <button
              onClick={startNoteGeneration}
              disabled={metrics.processingStatus === 'generating'}
              className="flex-1 flex items-center justify-center space-x-1 p-2 text-xs bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
            >
              <Icon 
                name={metrics.processingStatus === 'generating' ? 'Loader' : 'FileText'} 
                size={12}
                className={metrics.processingStatus === 'generating' ? 'animate-spin' : ''}
              />
              <span>{metrics.processingStatus === 'generating' ? 'Processing...' : 'Generate Note'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeDashboard;