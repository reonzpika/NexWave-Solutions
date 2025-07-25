import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TierAccessGate = ({ userTier, requiredTier, onUpgrade, children }) => {
  const tierLevels = {
    basic: 1,
    premium: 2,
    enterprise: 3
  };

  const hasAccess = tierLevels[userTier] >= tierLevels[requiredTier];

  if (hasAccess) {
    return children;
  }

  const tierConfig = {
    premium: {
      name: 'Premium',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      icon: 'Crown',
      features: [
        'AI-powered image analysis',
        'Dermatological assessment',
        'Differential diagnosis suggestions',
        'Standardized clinical reports',
        'Advanced annotation tools'
      ]
    },
    enterprise: {
      name: 'Enterprise',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20',
      icon: 'Building',
      features: [
        'All Premium features',
        'Custom analysis templates',
        'Bulk image processing',
        'API access',
        'Priority support'
      ]
    }
  };

  const config = tierConfig[requiredTier];

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className={`max-w-md w-full ${config.bgColor} ${config.borderColor} border rounded-xl p-8 text-center`}>
        <div className={`w-16 h-16 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
          <Icon name={config.icon} size={32} className={config.color} />
        </div>
        
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {config.name} Feature
        </h2>
        
        <p className="text-muted-foreground mb-6">
          The Image Analyzer requires a {config.name} subscription to access advanced 
          AI-powered dermatological analysis and clinical documentation tools.
        </p>
        
        <div className="space-y-4 mb-8">
          <h3 className="font-semibold text-foreground text-left">
            What you'll get with {config.name}:
          </h3>
          <ul className="space-y-2 text-left">
            {config.features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-3">
                <div className={`w-5 h-5 ${config.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <Icon name="Check" size={12} className={config.color} />
                </div>
                <span className="text-sm text-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="space-y-3">
          <Button
            variant="default"
            onClick={onUpgrade}
            iconName="ArrowRight"
            iconPosition="right"
            fullWidth
          >
            Upgrade to {config.name}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            iconName="ArrowLeft"
            iconPosition="left"
            fullWidth
          >
            Back to Dashboard
          </Button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Shield" size={12} />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={12} />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Zap" size={12} />
              <span>Instant Analysis</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TierAccessGate;