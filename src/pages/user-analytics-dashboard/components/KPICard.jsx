import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ title, value, unit, trend, trendValue, icon, color = 'primary', className = '' }) => {
  const colorClasses = {
    primary: 'text-primary bg-primary/10 border-primary/20',
    success: 'text-success bg-success/10 border-success/20',
    warning: 'text-warning bg-warning/10 border-warning/20',
    accent: 'text-accent bg-accent/10 border-accent/20'
  };

  const trendColor = trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground';
  const trendIcon = trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus';

  return (
    <div className={`bg-card border border-border rounded-lg p-4 sm:p-6 shadow-clinical hover:shadow-clinical-lg transition-all duration-200 group ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground mb-3 truncate" title={title}>
            {title}
          </p>
          <div className="flex items-baseline space-x-2 mb-3">
            <span className="text-2xl sm:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-200">
              {value}
            </span>
            {unit && (
              <span className="text-sm text-muted-foreground flex-shrink-0">
                {unit}
              </span>
            )}
          </div>
          {trend && trendValue && (
            <div className={`flex items-center space-x-1 ${trendColor}`}>
              <Icon name={trendIcon} size={14} className="flex-shrink-0" />
              <span className="text-sm font-medium">{trendValue}</span>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                vs last month
              </span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0 border ${colorClasses[color]} group-hover:scale-105 transition-transform duration-200`}>
          <Icon name={icon} size={20} />
        </div>
      </div>
    </div>
  );
};

export default KPICard;