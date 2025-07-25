import React from 'react';
import Icon from '../AppIcon';

const UserTierIndicator = ({ userTier, isCollapsed, onUpgrade }) => {
  const tierConfig = {
    basic: {
      label: 'Basic Plan',
      color: 'text-success',
      bgColor: 'bg-success/10',
      icon: 'Check',
      usageLimit: 'Unlimited Access',
      features: ['All Features Unlocked', 'No Restrictions', 'Full Access']
    },
    premium: {
      label: 'Premium Plan',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      icon: 'Crown',
      usageLimit: 'Unlimited Access',
      features: ['All Features Unlocked', 'No Restrictions', 'Full Access']
    },
    enterprise: {
      label: 'Enterprise Plan',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      icon: 'Building',
      usageLimit: 'Unlimited Access',
      features: ['All Features Unlocked', 'No Restrictions', 'Full Access']
    }
  };

  const config = tierConfig[userTier];
  const isBasicTier = false;

  if (isCollapsed) {
    return (
      <div className="relative group">
        <div className={`w-8 h-8 ${config.bgColor} rounded-lg flex items-center justify-center`}>
          <Icon name={config.icon} size={16} className={config.color} />
        </div>
        
        {/* Tooltip */}
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-popover text-popover-foreground p-3 rounded-lg shadow-clinical-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-1200 whitespace-nowrap">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name={config.icon} size={16} className={config.color} />
            <span className="font-medium">{config.label}</span>
          </div>
          <p className="text-xs text-success font-medium">{config.usageLimit}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-3 ${config.bgColor} rounded-lg`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon name={config.icon} size={16} className={config.color} />
          <span className="text-sm font-medium">{config.label}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Access</span>
          <span className="text-xs font-medium text-success">{config.usageLimit}</span>
        </div>
        
        <div className="flex items-center justify-center py-1">
          <Icon name="Infinity" size={16} className={`${config.color} mr-1`} />
          <span className="text-xs font-medium text-success">Full Access</span>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-border/50">
        <p className="text-xs text-success font-medium">
          All ClinicPro features are now available to all users
        </p>
      </div>
    </div>
  );
};

export default UserTierIndicator;