import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const SessionControlPanel = ({ 
  isRecording, 
  onRecordingToggle, 
  onPause, 
  onStop,
  sessionDuration,
  selectedTemplate,
  onTemplateChange,
  qrCodeUrl,
  connectionStatus,
  realTimeMetrics
}) => {
  const [showQRCode, setShowQRCode] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  // Mock audio level animation
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [isRecording]);

  const templateOptions = [
    { value: 'general', label: 'General Consultation' },
    { value: 'follow-up', label: 'Follow-up Visit' },
    { value: 'acute', label: 'Acute Care' },
    { value: 'chronic', label: 'Chronic Disease Management' },
    { value: 'preventive', label: 'Preventive Care' },
    { value: 'mental-health', label: 'Mental Health' },
    { value: 'pediatric', label: 'Pediatric Consultation' },
    { value: 'geriatric', label: 'Geriatric Care' }
  ];

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-success';
      case 'connecting': return 'text-warning';
      case 'disconnected': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return 'Wifi';
      case 'connecting': return 'Loader';
      case 'disconnected': return 'WifiOff';
      default: return 'Wifi';
    }
  };

  return (
    <div className="h-full flex flex-col bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground">Session Control</h3>
          <div className={`flex items-center space-x-2 ${getConnectionStatusColor()}`}>
            <Icon 
              name={getConnectionStatusIcon()} 
              size={16} 
              className={connectionStatus === 'connecting' ? 'animate-spin' : ''} 
            />
            <span className="text-sm capitalize">{connectionStatus}</span>
          </div>
        </div>

        {/* Session Timer */}
        <div className="flex items-center justify-center p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-foreground mb-1">
              {formatDuration(sessionDuration)}
            </div>
            <div className="text-xs text-muted-foreground">Session Duration</div>
          </div>
        </div>
      </div>

      {/* Recording Controls */}
      <div className="p-4 border-b border-border">
        <div className="space-y-4">
          {/* Main Recording Button */}
          <div className="flex justify-center">
            <Button
              variant={isRecording ? "destructive" : "default"}
              size="lg"
              iconName={isRecording ? "Square" : "Mic"}
              iconPosition="left"
              onClick={onRecordingToggle}
              className="w-full"
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
          </div>

          {/* Secondary Controls */}
          {isRecording && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Pause"
                iconPosition="left"
                onClick={onPause}
                className="flex-1"
              >
                Pause
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Square"
                iconPosition="left"
                onClick={onStop}
                className="flex-1"
              >
                Stop
              </Button>
            </div>
          )}

          {/* Audio Level Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Audio Level</span>
              <span className="text-xs text-muted-foreground">{Math.round(audioLevel)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-100 ${
                  audioLevel > 80 ? 'bg-destructive' : 
                  audioLevel > 50 ? 'bg-warning' : 'bg-success'
                }`}
                style={{ width: `${audioLevel}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Selection */}
      <div className="p-4 border-b border-border">
        <Select
          label="Note Template"
          description="Choose template for AI note generation"
          options={templateOptions}
          value={selectedTemplate}
          onChange={onTemplateChange}
          placeholder="Select template..."
          searchable
        />
      </div>

      {/* Mobile Connection */}
      <div className="p-4 border-b border-border">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Mobile Sync</span>
            <Button
              variant="outline"
              size="sm"
              iconName="QrCode"
              onClick={() => setShowQRCode(!showQRCode)}
            >
              QR Code
            </Button>
          </div>

          {showQRCode && (
            <div className="flex flex-col items-center space-y-2 p-3 bg-muted/30 rounded-lg">
              <div className="w-32 h-32 bg-white p-2 rounded-lg border">
                <img 
                  src={qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent('https://clinicpro.app/mobile-sync/session-123')}`}
                  alt="Mobile sync QR code"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Scan with mobile app to sync recording
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="flex-1 p-4">
        <h4 className="text-sm font-medium text-foreground mb-3">Session Metrics</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={14} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Processing Time</span>
            </div>
            <span className="text-xs font-medium text-foreground">
              {realTimeMetrics?.processingTime || '0.0'}s
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Zap" size={14} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Avg Confidence</span>
            </div>
            <span className="text-xs font-medium text-foreground">
              {realTimeMetrics?.avgConfidence || '0'}%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="FileText" size={14} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Words Captured</span>
            </div>
            <span className="text-xs font-medium text-foreground">
              {realTimeMetrics?.wordCount || '0'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="TrendingUp" size={14} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Efficiency</span>
            </div>
            <span className="text-xs font-medium text-success">
              +{realTimeMetrics?.efficiencyGain || '0'}%
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 space-y-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Image"
            iconPosition="left"
            className="w-full"
          >
            Add Clinical Image
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="BookOpen"
            iconPosition="left"
            className="w-full"
          >
            Insert Guideline
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Save"
            iconPosition="left"
            className="w-full"
          >
            Save Session
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SessionControlPanel;