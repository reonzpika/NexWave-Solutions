import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, subtitle, icon, trend, trendValue, color = 'primary' }) => {
  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    accent: 'text-accent bg-accent/10'
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 shadow-clinical hover:shadow-clinical-lg transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground mb-1 truncate" title={title}>
            {title}
          </p>
          <p className="text-xl sm:text-2xl font-semibold text-foreground mb-1 break-words">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">
              {subtitle}
            </p>
          )}
          {trend && trendValue && (
            <div className={`flex items-center text-xs sm:text-sm ${
              trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              <Icon 
                name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
                size={14}
                className="mr-1 flex-shrink-0" 
              />
              <span className="truncate" title={trendValue}>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ml-3 group-hover:scale-105 transition-transform duration-200 ${colorClasses[color]}`}>
          <Icon name={icon} size={20} className="sm:w-6 sm:h-6" />
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;