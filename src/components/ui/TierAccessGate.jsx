import React from 'react';




const TierAccessGate = ({ 
  featureName, 
  children, 
  showUpgrade = true,
  fallbackMessage,
  onUpgrade 
}) => {
  // MODIFIED: Always allow access - return children directly
  // All features are now accessible to all users
  return children;
};

export default TierAccessGate;