import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TierUsageWidget = ({ userTier, usageData, onUpgrade }) => {
  const tierConfig = {
    basic: {
      label: 'Basic Plan',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/50',
      borderColor: 'border-muted',
      icon: 'User',
      limits: {
        aiScribe: 5,
        premiumFeatures: 0
      }
    },
    standard: {
      label: 'Standard Plan',
      color: 'text-primary',
      bgColor: 'bg-primary/5',
      borderColor: 'border-primary/20',
      icon: 'Crown',
      limits: {
        aiScribe: 'unlimited',
        premiumFeatures: 5
      }
    },
    premium: {
      label: 'Premium Plan',
      color: 'text-accent',
      bgColor: 'bg-accent/5',
      borderColor: 'border-accent/20',
      icon: 'Zap',
      limits: {
        aiScribe: 'unlimited',
        premiumFeatures: 'unlimited'
      }
    }
  };

  const config = tierConfig[userTier];
  const canUpgrade = userTier !== 'premium';

  const getUsagePercentage = (used, limit) => {
    if (limit === 'unlimited') return 0;
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'bg-destructive';
    if (percentage >= 75) return 'bg-warning';
    return 'bg-primary';
  };

  return (
    <div className={`bg-card border ${config.borderColor} rounded-lg p-6 shadow-clinical ${config.bgColor}`}>
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.bgColor} border ${config.borderColor}`}>
            <Icon name={config.icon} size={20} className={config.color} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{config.label}</h3>
            <p className="text-sm text-muted-foreground">Current subscription tier</p>
          </div>
        </div>
        {canUpgrade && (
          <Button variant="outline" size="sm" onClick={onUpgrade}>
            Upgrade
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* AI Scribe Usage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">AI Scribe Sessions</span>
            <span className="text-sm text-muted-foreground">
              {usageData.aiScribe.used} / {config.limits.aiScribe === 'unlimited' ? '∞' : config.limits.aiScribe}
            </span>
          </div>
          {config.limits.aiScribe !== 'unlimited' && (
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(getUsagePercentage(usageData.aiScribe.used, config.limits.aiScribe))}`}
                style={{ width: `${getUsagePercentage(usageData.aiScribe.used, config.limits.aiScribe)}%` }}
              />
            </div>
          )}
        </div>

        {/* Premium Features Usage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Premium Features</span>
            <span className="text-sm text-muted-foreground">
              {usageData.premiumFeatures.used} / {config.limits.premiumFeatures === 'unlimited' ? '∞' : config.limits.premiumFeatures}
            </span>
          </div>
          {config.limits.premiumFeatures !== 'unlimited' && config.limits.premiumFeatures > 0 && (
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(getUsagePercentage(usageData.premiumFeatures.used, config.limits.premiumFeatures))}`}
                style={{ width: `${getUsagePercentage(usageData.premiumFeatures.used, config.limits.premiumFeatures)}%` }}
              />
            </div>
          )}
          {config.limits.premiumFeatures === 0 && (
            <div className="text-xs text-muted-foreground">
              Upgrade to access premium features
            </div>
          )}
        </div>

        {/* Reset Information */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="RotateCcw" size={14} />
            <span>Usage resets on {usageData.resetDate}</span>
          </div>
        </div>

        {/* Upgrade Recommendations */}
        {canUpgrade && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-start space-x-2">
              <Icon name="Lightbulb" size={16} className="text-warning mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Upgrade Benefits</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {userTier === 'basic' && (
                    <>
                      <li>• Unlimited AI Scribe sessions</li>
                      <li>• 5 premium feature uses daily</li>
                      <li>• Advanced analytics</li>
                    </>
                  )}
                  {userTier === 'standard' && (
                    <>
                      <li>• Unlimited premium features</li>
                      <li>• Priority support</li>
                      <li>• Custom templates</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TierUsageWidget;