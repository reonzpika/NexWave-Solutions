import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ComparisonWidget = ({ userStats, peerData, historicalData }) => {
  const [activeTab, setActiveTab] = useState('peer');

  const comparisonMetrics = [
    {
      key: 'avgSessionDuration',
      label: 'Avg Session Duration',
      unit: 'min',
      icon: 'Clock'
    },
    {
      key: 'transcriptionAccuracy',
      label: 'Transcription Accuracy',
      unit: '%',
      icon: 'Target'
    },
    {
      key: 'timeSaved',
      label: 'Time Saved per Session',
      unit: 'min',
      icon: 'Zap'
    },
    {
      key: 'sessionsPerDay',
      label: 'Sessions per Day',
      unit: '',
      icon: 'Calendar'
    }
  ];

  const getComparisonColor = (userValue, compareValue, isHigherBetter = true) => {
    const diff = userValue - compareValue;
    if (Math.abs(diff) < 0.1) return 'text-muted-foreground';
    
    if (isHigherBetter) {
      return diff > 0 ? 'text-success' : 'text-destructive';
    } else {
      return diff < 0 ? 'text-success' : 'text-destructive';
    }
  };

  const getComparisonIcon = (userValue, compareValue, isHigherBetter = true) => {
    const diff = userValue - compareValue;
    if (Math.abs(diff) < 0.1) return 'Minus';
    
    if (isHigherBetter) {
      return diff > 0 ? 'TrendingUp' : 'TrendingDown';
    } else {
      return diff < 0 ? 'TrendingUp' : 'TrendingDown';
    }
  };

  const formatDifference = (userValue, compareValue) => {
    const diff = Math.abs(userValue - compareValue);
    return diff.toFixed(1);
  };

  const tabs = [
    { id: 'peer', label: 'vs Peers', icon: 'Users' },
    { id: 'historical', label: 'vs Historical', icon: 'TrendingUp' }
  ];

  const activeData = activeTab === 'peer' ? peerData : historicalData;

  return (
    <div className="bg-card border border-border rounded-lg shadow-clinical">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Performance Comparison</h3>
          <Button variant="outline" size="sm" iconName="BarChart3" iconPosition="left">
            Detailed Report
          </Button>
        </div>
        
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {comparisonMetrics.map((metric) => {
            const userValue = userStats[metric.key];
            const compareValue = activeData[metric.key];
            const isHigherBetter = metric.key !== 'avgSessionDuration';
            
            return (
              <div key={metric.key} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Icon name={metric.icon} size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{metric.label}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {userValue}{metric.unit}
                    </p>
                    <p className="text-xs text-muted-foreground">Your performance</p>
                  </div>
                  
                  <div className="text-right">
                    <div className={`flex items-center space-x-1 ${getComparisonColor(userValue, compareValue, isHigherBetter)}`}>
                      <Icon 
                        name={getComparisonIcon(userValue, compareValue, isHigherBetter)} 
                        size={16} 
                      />
                      <span className="text-sm font-medium">
                        {formatDifference(userValue, compareValue)}{metric.unit}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      vs {activeTab === 'peer' ? 'peers' : 'last month'}
                    </p>
                  </div>
                </div>
                
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min((userValue / (compareValue * 1.5)) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Info" size={16} />
            <span>
              {activeTab === 'peer' ?'Comparison based on anonymized data from similar practices in New Zealand' :'Historical comparison shows your improvement over the past 3 months'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonWidget;