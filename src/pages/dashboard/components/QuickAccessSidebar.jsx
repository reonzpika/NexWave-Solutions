import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickAccessSidebar = ({ userTier = 'basic' }) => {
  const navigate = useNavigate();

  const premiumFeatures = [
    {
      id: 'image-analyzer',
      title: 'Image Analyzer',
      description: 'AI-powered skin lesion and rash analysis with standardized documentation',
      icon: 'Camera',
      path: '/image-analyzer',
      usageToday: 2,
      usageLimit: 5,
      tierRequired: 'premium'
    },
    {
      id: 'clinical-assistant',
      title: 'Clinical Assistant',
      description: 'Context-aware search across HealthPathways, NZ Formulary, and Healthify NZ',
      icon: 'Stethoscope',
      path: '/context-aware-clinical-assistant',
      usageToday: 1,
      usageLimit: 5,
      tierRequired: 'premium'
    }
  ];

  const quickActions = [
    {
      id: 'templates',
      title: 'Template Management',
      description: 'Manage consultation templates and note formatting',
      icon: 'FileText',
      path: '/template-management',
      available: true
    },
    {
      id: 'analytics',
      title: 'Analytics Dashboard',
      description: 'View detailed practice insights and performance metrics',
      icon: 'BarChart3',
      path: '/user-analytics-dashboard',
      available: true
    }
  ];

  const tierLevels = {
    basic: 1,
    standard: 2,
    premium: 3,
    enterprise: 4
  };

  const hasAccess = (requiredTier) => {
    return tierLevels[userTier] >= tierLevels[requiredTier];
  };

  const handleFeatureClick = (feature) => {
    if (!hasAccess(feature.tierRequired)) {
      navigate('/upgrade');
      return;
    }
    navigate(feature.path);
  };

  const getUsagePercentage = (used, limit) => {
    return Math.min((used / limit) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Premium Features */}
      <div className="bg-card border border-border rounded-lg p-4 lg:p-6 shadow-clinical">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base lg:text-lg font-semibold text-foreground">Premium Features</h3>
          {userTier === 'basic' && (
            <Button
              variant="outline"
              size="xs"
              onClick={() => navigate('/upgrade')}
              iconName="Crown"
              iconPosition="left"
              className="text-xs"
            >
              <span className="hidden sm:inline">Upgrade</span>
              <Icon name="Crown" size={12} className="sm:hidden" />
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {premiumFeatures.map((feature) => {
            const hasFeatureAccess = hasAccess(feature.tierRequired);
            const usagePercentage = getUsagePercentage(feature.usageToday, feature.usageLimit);
            
            return (
              <div key={feature.id} className="relative">
                <div className={`p-3 lg:p-4 rounded-lg border transition-all duration-200 ${
                  hasFeatureAccess 
                    ? 'border-border hover:border-primary/50 hover:shadow-sm cursor-pointer' 
                    : 'border-border bg-muted/30 cursor-not-allowed opacity-60'
                }`}
                onClick={() => handleFeatureClick(feature)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleFeatureClick(feature);
                  }
                }}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      hasFeatureAccess ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon name={feature.icon} size={16} className="lg:w-5 lg:h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1 gap-2">
                        <h4 className={`text-sm font-medium truncate ${
                          hasFeatureAccess ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {feature.title}
                        </h4>
                        {!hasFeatureAccess && (
                          <Icon name="Lock" size={14} className="text-muted-foreground flex-shrink-0" />
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                        {feature.description}
                      </p>

                      {hasFeatureAccess && userTier !== 'enterprise' && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Today's Usage</span>
                            <span className="text-foreground font-medium">
                              {feature.usageToday}/{feature.usageLimit}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-500 ${
                                usagePercentage >= 80 ? 'bg-warning' : 'bg-primary'
                              }`}
                              style={{ width: `${usagePercentage}%` }}
                              role="progressbar"
                              aria-valuenow={usagePercentage}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-label={`${feature.title} usage percentage`}
                            ></div>
                          </div>
                        </div>
                      )}

                      {hasFeatureAccess && userTier === 'enterprise' && (
                        <div className="flex items-center text-xs text-success">
                          <Icon name="Infinity" size={12} className="mr-1 flex-shrink-0" />
                          <span>Unlimited Usage</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {!hasFeatureAccess && (
                  <div className="absolute inset-0 bg-background/80 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center p-2">
                      <Icon name="Lock" size={20} className="text-muted-foreground mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground font-medium">
                        Upgrade to {feature.tierRequired}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-4 lg:p-6 shadow-clinical">
        <h3 className="text-base lg:text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        
        <div className="space-y-3">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => navigate(action.path)}
              className="w-full p-3 text-left rounded-lg border border-border hover:border-primary/50 hover:bg-muted/30 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={action.icon} size={14} className="text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground truncate">{action.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                    {action.description}
                  </p>
                </div>
                <Icon name="ChevronRight" size={16} className="text-muted-foreground flex-shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Analytics Widget */}
      <div className="bg-card border border-border rounded-lg p-4 lg:p-6 shadow-clinical">
        <h3 className="text-base lg:text-lg font-semibold text-foreground mb-4">Today's Insights</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse flex-shrink-0"></div>
              <span className="text-sm text-foreground">Active Sessions</span>
            </div>
            <span className="text-sm font-medium text-foreground">2</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Avg. Session Time</span>
            <span className="text-sm font-medium text-foreground">12.5 min</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Time Saved Today</span>
            <span className="text-sm font-medium text-success">2.3 hours</span>
          </div>
          
          <div className="pt-3 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              onClick={() => navigate('/user-analytics-dashboard')}
              iconName="TrendingUp"
              iconPosition="left"
              className="text-sm justify-start"
            >
              View Detailed Analytics
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickAccessSidebar;