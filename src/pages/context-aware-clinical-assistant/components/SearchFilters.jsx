import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SearchFilters = ({ activeFilters, onFilterChange, onClearFilters }) => {
  const filterOptions = [
    {
      id: 'resource',
      label: 'Resource Type',
      options: [
        { value: 'healthpathways', label: 'HealthPathways', icon: 'FileText', color: 'text-primary' },
        { value: 'formulary', label: 'NZ Formulary', icon: 'Pill', color: 'text-accent' },
        { value: 'healthify', label: 'Healthify NZ', icon: 'BookOpen', color: 'text-warning' }
      ]
    },
    {
      id: 'condition',
      label: 'Condition Type',
      options: [
        { value: 'cardiovascular', label: 'Cardiovascular', icon: 'Heart' },
        { value: 'respiratory', label: 'Respiratory', icon: 'Wind' },
        { value: 'dermatology', label: 'Dermatology', icon: 'Scan' },
        { value: 'endocrine', label: 'Endocrine', icon: 'Activity' },
        { value: 'mental-health', label: 'Mental Health', icon: 'Brain' },
        { value: 'musculoskeletal', label: 'Musculoskeletal', icon: 'Bone' }
      ]
    },
    {
      id: 'urgency',
      label: 'Clinical Priority',
      options: [
        { value: 'emergency', label: 'Emergency', icon: 'AlertTriangle', color: 'text-destructive' },
        { value: 'urgent', label: 'Urgent', icon: 'Clock', color: 'text-warning' },
        { value: 'routine', label: 'Routine', icon: 'Calendar', color: 'text-muted-foreground' }
      ]
    }
  ];

  const hasActiveFilters = Object.values(activeFilters).some(filters => filters.length > 0);

  const handleFilterToggle = (filterId, value) => {
    const currentFilters = activeFilters[filterId] || [];
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter(f => f !== value)
      : [...currentFilters, value];
    
    onFilterChange(filterId, newFilters);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-clinical">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
          <Icon name="Filter" size={20} />
          <span>Search Filters</span>
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
            iconSize={14}
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {filterOptions.map((filterGroup) => (
          <div key={filterGroup.id}>
            <h4 className="text-sm font-medium text-foreground mb-3">
              {filterGroup.label}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {filterGroup.options.map((option) => {
                const isActive = (activeFilters[filterGroup.id] || []).includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => handleFilterToggle(filterGroup.id, option.value)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-primary/10 text-primary border border-primary/20' :'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent'
                    }`}
                  >
                    <Icon 
                      name={option.icon} 
                      size={16} 
                      className={isActive ? 'text-primary' : option.color || 'text-muted-foreground'} 
                    />
                    <span className="truncate">{option.label}</span>
                    {isActive && (
                      <Icon name="Check" size={14} className="text-primary ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {hasActiveFilters && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([filterId, filters]) =>
              filters.map((filter) => {
                const filterGroup = filterOptions.find(g => g.id === filterId);
                const option = filterGroup?.options.find(o => o.value === filter);
                return option ? (
                  <div
                    key={`${filterId}-${filter}`}
                    className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-xs"
                  >
                    <Icon name={option.icon} size={12} />
                    <span>{option.label}</span>
                    <button
                      onClick={() => handleFilterToggle(filterId, filter)}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <Icon name="X" size={10} />
                    </button>
                  </div>
                ) : null;
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;