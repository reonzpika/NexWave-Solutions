import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const NavigationItem = ({
  id,
  label,
  path,
  icon,
  description,
  tierRequired,
  isActive,
  userTier,
  onUpgrade,
  isCollapsed = false,
  isMobile = false
}) => {
  const navigate = useNavigate();

  const tierLevels = {
    basic: 1,
    premium: 2,
    enterprise: 3
  };

  const hasAccess = tierLevels[userTier] >= tierLevels[tierRequired];
  const isPremiumFeature = tierRequired !== 'basic';

  const handleClick = () => {
    if (!hasAccess) {
      onUpgrade();
      return;
    }
    navigate(path);
  };

  if (isMobile) {
    return (
      <button
        onClick={handleClick}
        className={`flex flex-col items-center justify-center touch-target transition-colors duration-150 ${
          isActive 
            ? 'text-primary' 
            : hasAccess 
              ? 'text-muted-foreground hover:text-foreground' 
              : 'text-muted-foreground/50'
        }`}
        disabled={!hasAccess}
      >
        <div className="relative">
          <Icon name={icon} size={20} />
          {isPremiumFeature && !hasAccess && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-warning rounded-full flex items-center justify-center">
              <Icon name="Lock" size={8} />
            </div>
          )}
        </div>
        <span className="text-xs mt-1 truncate max-w-16">{label}</span>
      </button>
    );
  }

  return (
    <div className="relative group">
      <button
        onClick={handleClick}
        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-150 ease-out touch-target ${
          isActive
            ? 'bg-primary/10 text-primary border border-primary/20'
            : hasAccess
              ? 'text-foreground hover:bg-muted hover:text-foreground'
              : 'text-muted-foreground/50 cursor-not-allowed'
        }`}
        disabled={!hasAccess}
      >
        <div className="relative flex-shrink-0">
          <Icon name={icon} size={20} />
          {isPremiumFeature && !hasAccess && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-warning rounded-full flex items-center justify-center">
              <Icon name="Lock" size={8} />
            </div>
          )}
        </div>
        
        {!isCollapsed && (
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium truncate">{label}</span>
              {isPremiumFeature && (
                <span className="text-xs bg-warning/20 text-warning px-2 py-0.5 rounded-full ml-2 flex-shrink-0">
                  {tierRequired}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {description}
              </p>
            )}
          </div>
        )}
      </button>

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-popover text-popover-foreground px-3 py-2 rounded-lg shadow-clinical-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-1200 whitespace-nowrap">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{label}</span>
            {isPremiumFeature && (
              <span className="text-xs bg-warning/20 text-warning px-2 py-0.5 rounded-full">
                {tierRequired}
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1 max-w-48">
              {description}
            </p>
          )}
          {!hasAccess && (
            <p className="text-xs text-warning mt-1">
              Upgrade to access this feature
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default NavigationItem;