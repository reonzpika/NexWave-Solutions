import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onQuickSearch, userTier }) => {
  const quickSearches = [
    {
      id: 'chest-pain',
      label: 'Chest Pain Assessment',
      query: 'chest pain assessment guidelines',
      icon: 'Heart',
      category: 'Emergency',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/20'
    },
    {
      id: 'diabetes-management',
      label: 'Diabetes Management',
      query: 'type 2 diabetes management',
      icon: 'Activity',
      category: 'Chronic Care',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    },
    {
      id: 'hypertension',
      label: 'Hypertension Guidelines',
      query: 'hypertension treatment guidelines',
      icon: 'TrendingUp',
      category: 'Cardiovascular',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20'
    },
    {
      id: 'mental-health',
      label: 'Mental Health Screening',
      query: 'depression anxiety screening tools',
      icon: 'Brain',
      category: 'Mental Health',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20'
    },
    {
      id: 'skin-lesions',
      label: 'Skin Lesion Assessment',
      query: 'skin lesion assessment dermatology',
      icon: 'Scan',
      category: 'Dermatology',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
      premium: true
    },
    {
      id: 'medication-interactions',
      label: 'Drug Interactions',
      query: 'medication interactions checker',
      icon: 'Pill',
      category: 'Pharmacy',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  const commonConditions = [
    { label: 'Upper Respiratory Infection', query: 'upper respiratory tract infection treatment' },
    { label: 'Urinary Tract Infection', query: 'UTI treatment guidelines' },
    { label: 'Gastroenteritis', query: 'gastroenteritis management' },
    { label: 'Migraine', query: 'migraine headache treatment' },
    { label: 'Asthma Exacerbation', query: 'asthma exacerbation management' },
    { label: 'Eczema Treatment', query: 'atopic dermatitis eczema treatment' }
  ];

  const emergencyProtocols = [
    { label: 'Anaphylaxis', query: 'anaphylaxis emergency protocol', urgent: true },
    { label: 'Acute MI', query: 'acute myocardial infarction protocol', urgent: true },
    { label: 'Stroke Assessment', query: 'stroke assessment FAST protocol', urgent: true },
    { label: 'Sepsis Screening', query: 'sepsis screening qSOFA', urgent: true }
  ];

  const hasAccess = (isPremium) => {
    const tierLevels = { basic: 1, premium: 2, enterprise: 3 };
    return !isPremium || tierLevels[userTier] >= 2;
  };

  return (
    <div className="space-y-8">
      {/* Featured Quick Searches */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Zap" size={20} />
          <span>Quick Clinical Searches</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickSearches.map((search) => {
            const canAccess = hasAccess(search.premium);
            return (
              <button
                key={search.id}
                onClick={() => canAccess && onQuickSearch(search.query)}
                disabled={!canAccess}
                className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-clinical-lg ${
                  canAccess
                    ? `${search.bgColor} ${search.borderColor} hover:scale-105`
                    : 'bg-muted/50 border-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    canAccess ? search.bgColor : 'bg-muted'
                  }`}>
                    <Icon 
                      name={search.icon} 
                      size={20} 
                      className={canAccess ? search.color : 'text-muted-foreground'} 
                    />
                  </div>
                  {search.premium && !canAccess && (
                    <div className="w-6 h-6 bg-warning rounded-full flex items-center justify-center">
                      <Icon name="Lock" size={12} className="text-white" />
                    </div>
                  )}
                </div>
                <h4 className={`font-semibold mb-2 ${canAccess ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {search.label}
                </h4>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    canAccess 
                      ? 'bg-muted/50 text-muted-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {search.category}
                  </span>
                  <Icon 
                    name="ArrowRight" 
                    size={14} 
                    className={canAccess ? search.color : 'text-muted-foreground'} 
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Common Conditions */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Stethoscope" size={20} />
          <span>Common Conditions</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {commonConditions.map((condition, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => onQuickSearch(condition.query)}
              className="h-auto p-3 text-xs font-medium text-center whitespace-normal"
            >
              {condition.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Emergency Protocols */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="AlertTriangle" size={20} className="text-destructive" />
          <span>Emergency Protocols</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {emergencyProtocols.map((protocol, index) => (
            <Button
              key={index}
              variant="destructive"
              size="sm"
              onClick={() => onQuickSearch(protocol.query)}
              iconName="AlertCircle"
              iconPosition="left"
              iconSize={14}
              className="justify-start"
            >
              {protocol.label}
            </Button>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      {userTier === 'premium' || userTier === 'enterprise' ? (
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Icon name="Sparkles" size={20} className="text-primary" />
            <span>AI-Powered Recommendations</span>
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Premium</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="TrendingUp" size={16} className="text-accent" />
                <h4 className="font-medium text-foreground">Trending Searches</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Based on current clinical patterns and seasonal trends
              </p>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                  Respiratory infections (↑15%)
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                  Mental health screening (↑8%)
                </Button>
              </div>
            </div>
            <div className="bg-card/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Target" size={16} className="text-warning" />
                <h4 className="font-medium text-foreground">Personalized Suggestions</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Based on your recent consultation patterns
              </p>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                  Diabetes management updates
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                  New hypertension guidelines
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-muted/50 border border-border rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Icon name="Sparkles" size={20} className="text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Unlock AI Recommendations</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Get personalized clinical insights and trending search suggestions with Premium
          </p>
          <Button variant="default" size="sm" iconName="ArrowRight" iconPosition="right">
            Upgrade to Premium
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuickActions;