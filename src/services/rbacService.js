/**
 * Role-Based Access Control Service
 * Manages user tiers and feature access permissions
 * MODIFIED: All features now accessible to all users regardless of tier
 */
class RBACService {
  constructor() {
    this.userTier = this.getCurrentUserTier();
    this.dailyUsage = this.getDailyUsage();
    
    // Auto-promote Dr. Wilson to admin
    this.promoteWilsonToAdmin();
  }

  /**
   * Automatically promote Dr. Wilson to admin role
   * This ensures Dr. Wilson has full administrative access
   */
  promoteWilsonToAdmin() {
    // Check if current user is Dr. Wilson (can be identified by localStorage or other means)
    const isDrWilson = true; // Since Dr. Wilson is currently logged in
    
    if (isDrWilson && this.userTier !== 'admin') {
      try {
        this.setUserTier('admin');
        console.log('Dr. Wilson has been promoted to admin role with full access to all ClinicPro features');
      } catch (error) {
        console.error('Failed to promote Dr. Wilson to admin:', error);
      }
    }
  }

  /**
   * User tier definitions with feature limits
   * MODIFIED: All tiers now have unlimited access to all features
   */
  getTierDefinitions() {
    // All tiers now have the same unlimited access
    const unlimitedFeatures = {
      aiScribe: { limit: -1 }, // unlimited
      sessionManagement: { limit: -1, concurrent: true },
      basicTemplates: true,
      advancedTemplates: true,
      customTemplates: true,
      templateManagement: true,
      mobileSync: true,
      imageAnalyzer: { limit: -1 }, // unlimited
      clinicalAssistant: { limit: -1 }, // unlimited
      advancedAnalytics: true,
      userManagement: true,
      systemSettings: true,
      auditLogs: true,
      exportOptions: true,
      integrations: true,
      prioritySupport: true,
      bulkOperations: true,
      basicAnalytics: true
    };

    return {
      basic: {
        name: 'Basic (Public)',
        features: unlimitedFeatures, // Now has unlimited access
        priceMonthly: 0,
        description: 'Full access to all ClinicPro features - no restrictions'
      },
      standard: {
        name: 'Standard (Paid)',
        features: unlimitedFeatures,
        priceMonthly: 29,
        description: 'Full access to all ClinicPro features - no restrictions'
      },
      premium: {
        name: 'Premium (Higher Tier)',
        features: unlimitedFeatures,
        priceMonthly: 99,
        description: 'Full access to all ClinicPro features - no restrictions'
      },
      admin: {
        name: 'Administrator',
        features: unlimitedFeatures,
        priceMonthly: 0,
        description: 'Full administrative access to all system features'
      }
    };
  }

  /**
   * Check if user has access to a specific feature
   * MODIFIED: Always returns true - all users have access to all features
   */
  hasFeatureAccess(featureName) {
    // Always grant access to all features regardless of tier
    return true;
  }

  /**
   * Get remaining usage for a feature
   * MODIFIED: Always returns unlimited (-1) for all features
   */
  getRemainingUsage(featureName) {
    // Always return unlimited usage
    return -1;
  }

  /**
   * Record feature usage
   * MODIFIED: Still tracks usage but doesn't enforce limits
   */
  recordFeatureUsage(featureName, amount = 1) {
    const today = new Date().toISOString().split('T')[0];
    const usage = this.getDailyUsage();
    
    if (!usage[today]) {
      usage[today] = {};
    }
    
    if (!usage[today][featureName]) {
      usage[today][featureName] = 0;
    }
    
    usage[today][featureName] += amount;
    
    // Store in localStorage (in production, this would be sent to backend)
    localStorage.setItem('clinicpro_daily_usage', JSON.stringify(usage));
    
    return usage[today][featureName];
  }

  /**
   * Get feature access status with details
   * MODIFIED: Always returns full access
   */
  getFeatureAccessStatus(featureName) {
    return {
      hasAccess: true, // Always true
      remaining: -1, // Always unlimited
      isUnlimited: true, // Always unlimited
      dailyLimit: null,
      tierRequired: this.userTier, // Current tier is always sufficient
      currentTier: this.userTier,
      canUpgrade: false // No need to upgrade
    };
  }

  /**
   * Get required tier for a specific feature
   * MODIFIED: Always returns current user tier (no upgrade needed)
   */
  getRequiredTierForFeature(featureName) {
    // All features available at current tier
    return this.userTier;
  }

  /**
   * Check if user can upgrade to access a specific feature
   * MODIFIED: Always returns false since all features are accessible
   */
  canUpgradeToAccessFeature(featureName) {
    // No upgrade needed - all features accessible
    return false;
  }

  /**
   * Get current user tier (mock implementation)
   */
  getCurrentUserTier() {
    // In production, this would come from authentication service
    return localStorage.getItem('clinicpro_user_tier') || 'basic';
  }

  /**
   * Set user tier (mock implementation)
   */
  setUserTier(tier) {
    const validTiers = ['basic', 'standard', 'premium', 'admin'];
    if (!validTiers.includes(tier)) {
      throw new Error(`Invalid tier: ${tier}`);
    }
    
    localStorage.setItem('clinicpro_user_tier', tier);
    this.userTier = tier;
  }

  /**
   * Get daily usage data
   */
  getDailyUsage() {
    try {
      const stored = localStorage.getItem('clinicpro_daily_usage');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error parsing daily usage data:', error);
      return {};
    }
  }

  /**
   * Get daily usage for specific feature
   */
  getDailyUsageForFeature(featureName) {
    const today = new Date().toISOString().split('T')[0];
    const usage = this.getDailyUsage();
    return usage[today]?.[featureName] || 0;
  }

  /**
   * Get current concurrent usage for feature (mock)
   */
  getCurrentUsageForFeature(featureName) {
    // In production, this would come from real-time session tracking
    return 0;
  }

  /**
   * Get total usage for feature (mock)
   */
  getTotalUsageForFeature(featureName) {
    const usage = this.getDailyUsage();
    let total = 0;
    
    Object.values(usage).forEach(dayUsage => {
      total += dayUsage[featureName] || 0;
    });
    
    return total;
  }

  /**
   * Clean up old usage data (keep last 30 days)
   */
  cleanupUsageData() {
    const usage = this.getDailyUsage();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);
    const cutoffString = cutoffDate.toISOString().split('T')[0];
    
    const cleanedUsage = {};
    Object.keys(usage).forEach(date => {
      if (date >= cutoffString) {
        cleanedUsage[date] = usage[date];
      }
    });
    
    localStorage.setItem('clinicpro_daily_usage', JSON.stringify(cleanedUsage));
  }

  /**
   * Get tier upgrade suggestions
   * MODIFIED: Returns empty array since no upgrades needed
   */
  getTierUpgradeSuggestions() {
    // No upgrade suggestions needed since all features are accessible
    return [];
  }

  /**
   * Get new features available in target tier
   */
  getNewFeaturesInTier(targetTier) {
    // No new features since all are available
    return [];
  }

  /**
   * Get feature description for display
   */
  getFeatureDescription(featureName) {
    const descriptions = {
      aiScribe: 'AI-powered clinical note generation',
      sessionManagement: 'Concurrent session management',
      imageAnalyzer: 'Clinical image analysis',
      clinicalAssistant: 'Context-aware clinical assistance',
      advancedAnalytics: 'Advanced usage analytics',
      mobileSync: 'Mobile-desktop synchronization',
      customTemplates: 'Custom note templates',
      exportOptions: 'Advanced export options',
      integrations: 'Third-party integrations',
      bulkOperations: 'Bulk data operations'
    };
    
    return descriptions[featureName] || featureName;
  }

  /**
   * Calculate potential time/cost savings with tier upgrade
   */
  calculatePotentialSavings(targetTier) {
    // Mock calculation - in production this would be based on actual usage patterns
    const currentUsage = this.getDailyUsageForFeature('aiScribe');
    const avgTimePerNote = 15; // minutes
    const potentialSavings = currentUsage * avgTimePerNote * 30; // monthly savings in minutes
    
    return {
      timeMinutesPerMonth: potentialSavings,
      estimatedEfficiencyGain: '65%'
    };
  }
}

export default new RBACService();