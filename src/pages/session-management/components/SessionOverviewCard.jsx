import React from 'react';
import Icon from '../../../components/AppIcon';

const SessionOverviewCard = ({ title, value, subtitle, icon, color = 'text-foreground', bgColor = 'bg-card' }) => {
  return (
    <div className={`${bgColor} border border-border rounded-lg p-6 shadow-clinical`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`w-10 h-10 ${color === 'text-success' ? 'bg-success/10' : color === 'text-warning' ? 'bg-warning/10' : color === 'text-primary' ? 'bg-primary/10' : 'bg-muted'} rounded-lg flex items-center justify-center`}>
              <Icon name={icon} size={20} className={color} />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionOverviewCard;