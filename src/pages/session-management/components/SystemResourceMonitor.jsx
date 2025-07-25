import React from 'react';
import Icon from '../../../components/AppIcon';

const SystemResourceMonitor = ({ resources }) => {
  const getResourceColor = (percentage) => {
    if (percentage >= 90) return 'text-destructive';
    if (percentage >= 70) return 'text-warning';
    return 'text-success';
  };

  const getResourceBgColor = (percentage) => {
    if (percentage >= 90) return 'bg-destructive';
    if (percentage >= 70) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-clinical">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">System Resources</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Live Monitoring</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU Usage */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Cpu" size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">CPU</span>
            </div>
            <span className={`text-sm font-bold ${getResourceColor(resources.cpu)}`}>
              {resources.cpu}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getResourceBgColor(resources.cpu)}`}
              style={{ width: `${resources.cpu}%` }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground">
            {resources.cpu < 50 ? 'Optimal' : resources.cpu < 80 ? 'Moderate' : 'High Usage'}
          </p>
        </div>
        
        {/* Memory Usage */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="HardDrive" size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Memory</span>
            </div>
            <span className={`text-sm font-bold ${getResourceColor(resources.memory)}`}>
              {resources.memory}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getResourceBgColor(resources.memory)}`}
              style={{ width: `${resources.memory}%` }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground">
            {resources.memoryUsed}GB / {resources.memoryTotal}GB
          </p>
        </div>
        
        {/* Network Usage */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Wifi" size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Network</span>
            </div>
            <span className="text-sm font-bold text-primary">
              {resources.networkSpeed} Mbps
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Icon name="ArrowUp" size={12} className="text-success" />
              <span className="text-xs text-muted-foreground">{resources.uploadSpeed}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="ArrowDown" size={12} className="text-primary" />
              <span className="text-xs text-muted-foreground">{resources.downloadSpeed}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Connection: {resources.connectionQuality}
          </p>
        </div>
        
        {/* Storage Usage */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Database" size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Storage</span>
            </div>
            <span className={`text-sm font-bold ${getResourceColor(resources.storage)}`}>
              {resources.storage}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getResourceBgColor(resources.storage)}`}
              style={{ width: `${resources.storage}%` }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground">
            {resources.storageUsed}GB / {resources.storageTotal}GB
          </p>
        </div>
      </div>
      
      {/* System Alerts */}
      {(resources.cpu > 80 || resources.memory > 80 || resources.storage > 90) && (
        <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-sm font-medium text-warning">System Alert</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            High resource usage detected. Consider optimizing active sessions or upgrading system resources.
          </p>
        </div>
      )}
    </div>
  );
};

export default SystemResourceMonitor;