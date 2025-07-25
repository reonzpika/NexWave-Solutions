import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';


const TierUsageIndicator = ({ userTier = 'basic' }) => {
  const navigate = useNavigate();

  const tierConfigs = {
    basic: {
      name: 'Basic Plan',
      color: 'text-success',
      bgColor: 'bg-success/5',
      borderColor: 'border-success/20',
      icon: 'Check',
      dailyLimit: 'Unlimited',
      features: ['Unlimited AI Scribe', 'All Premium Features', 'Full System Access']
    },
    standard: {
      name: 'Standard Plan',
      color: 'text-primary',
      bgColor: 'bg-primary/5',
      borderColor: 'border-primary/20',
      icon: 'Star',
      dailyLimit: 'Unlimited',
      features: ['Unlimited AI Scribe', 'All Premium Features', 'Full System Access']
    },
    premium: {
      name: 'Premium Plan',
      color: 'text-accent',
      bgColor: 'bg-accent/5',
      borderColor: 'border-accent/20',
      icon: 'Crown',
      dailyLimit: 'Unlimited',
      features: ['Unlimited AI Scribe', 'All Premium Features', 'Full System Access']
    },
    enterprise: {
      name: 'Enterprise Plan',
      color: 'text-warning',
      bgColor: 'bg-warning/5',
      borderColor: 'border-warning/20',
      icon: 'Building',
      dailyLimit: 'Unlimited',
      features: ['Unlimited AI Scribe', 'All Premium Features', 'Full System Access']
    }
  };

  const config = tierConfigs[userTier];

  return (
    <div className={`bg-card border ${config.borderColor} rounded-lg p-6 shadow-clinical ${config.bgColor}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 ${config.bgColor} rounded-lg flex items-center justify-center border ${config.borderColor}`}>
            <Icon name={config.icon} size={24} className={config.color} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{config.name}</h3>
            <p className="text-sm text-success font-medium">Full access to all features</p>
          </div>
        </div>
      </div>

      {/* Usage Indicators - MODIFIED to show unlimited access */}
      <div className="space-y-4">
        {/* Unlimited indicator for all tiers */}
        <div className="flex items-center justify-center py-3 bg-success/10 rounded-lg">
          <Icon name="Infinity" size={20} className="text-success mr-2" />
          <span className="text-sm font-medium text-success">Unlimited Access to All Features</span>
        </div>
      </div>

      {/* Features List - Updated to reflect full access */}
      <div className="mt-4 pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-2">Available Features</h4>
        <div className="space-y-1">
          {config.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Icon name="Check" size={14} className="text-success" />
              <span className="text-xs text-foreground font-medium">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Success message instead of upgrade CTA */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 text-success mb-2">
            <Icon name="CheckCircle" size={16} />
            <span className="text-sm font-medium">All Restrictions Removed</span>
          </div>
          <p className="text-xs text-muted-foreground">
            You now have full access to all ClinicPro features including Image Analyzer, Clinical Assistant, and unlimited AI Scribe usage.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TierUsageIndicator;