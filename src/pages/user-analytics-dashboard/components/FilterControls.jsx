import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilterControls = ({ filters, onFilterChange, onExport, onRefresh }) => {
  const dateRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' },
    { value: 'custom', label: 'Custom range' }
  ];

  const consultationTypes = [
    { value: 'all', label: 'All consultations' },
    { value: 'routine', label: 'Routine check-up' },
    { value: 'followup', label: 'Follow-up' },
    { value: 'urgent', label: 'Urgent care' },
    { value: 'chronic', label: 'Chronic disease' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 shadow-clinical">
      <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
        {/* Filters - Mobile-first responsive design */}
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4">
          {/* Date Range Filter */}
          <div className="flex items-center space-x-2 min-w-0">
            <Icon name="Calendar" size={16} className="text-muted-foreground flex-shrink-0" />
            <select
              value={filters.dateRange}
              onChange={(e) => onFilterChange('dateRange', e.target.value)}
              className="bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-w-0 flex-1 sm:flex-initial sm:w-40"
              aria-label="Select date range"
            >
              {dateRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Consultation Type Filter */}
          <div className="flex items-center space-x-2 min-w-0">
            <Icon name="Stethoscope" size={16} className="text-muted-foreground flex-shrink-0" />
            <select
              value={filters.consultationType}
              onChange={(e) => onFilterChange('consultationType', e.target.value)}
              className="bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-w-0 flex-1 sm:flex-initial sm:w-44"
              aria-label="Select consultation type"
            >
              {consultationTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Template Filter */}
          <div className="flex items-center space-x-2 min-w-0">
            <Icon name="FileText" size={16} className="text-muted-foreground flex-shrink-0" />
            <select
              value={filters.template}
              onChange={(e) => onFilterChange('template', e.target.value)}
              className="bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-w-0 flex-1 sm:flex-initial sm:w-44"
              aria-label="Select template"
            >
              <option value="all">All templates</option>
              <option value="general">General consultation</option>
              <option value="mental-health">Mental health</option>
              <option value="pediatric">Pediatric</option>
              <option value="chronic-care">Chronic care</option>
            </select>
          </div>
        </div>

        {/* Action Buttons - Improved mobile layout */}
        <div className="flex items-center justify-center sm:justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            iconName="RefreshCw"
            iconPosition="left"
            className="flex-1 sm:flex-initial"
            aria-label="Refresh data"
          >
            <span className="hidden sm:inline">Refresh</span>
            <span className="sm:hidden">Refresh</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            iconName="Download"
            iconPosition="left"
            className="flex-1 sm:flex-initial"
            aria-label="Export data"
          >
            <span className="hidden sm:inline">Export</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </div>

      {/* Custom Date Range Inputs - Enhanced mobile design */}
      {filters.dateRange === 'custom' && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <label className="text-sm font-medium text-foreground whitespace-nowrap">From:</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => onFilterChange('startDate', e.target.value)}
                className="bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full sm:w-auto"
                aria-label="Start date"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <label className="text-sm font-medium text-foreground whitespace-nowrap">To:</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => onFilterChange('endDate', e.target.value)}
                className="bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full sm:w-auto"
                aria-label="End date"
              />
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display - Enhanced mobile design */}
      {(filters.consultationType !== 'all' || filters.template !== 'all') && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Active filters:</span>
            <div className="flex flex-wrap gap-2">
              {filters.consultationType !== 'all' && (
                <span className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs border border-primary/20">
                  <span>{consultationTypes.find(t => t.value === filters.consultationType)?.label}</span>
                  <button
                    onClick={() => onFilterChange('consultationType', 'all')}
                    className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                    aria-label="Remove consultation type filter"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </span>
              )}
              {filters.template !== 'all' && (
                <span className="inline-flex items-center space-x-1 bg-accent/10 text-accent px-3 py-1 rounded-full text-xs border border-accent/20">
                  <span className="capitalize">{filters.template.replace('-', ' ')}</span>
                  <button
                    onClick={() => onFilterChange('template', 'all')}
                    className="hover:bg-accent/20 rounded-full p-0.5 transition-colors"
                    aria-label="Remove template filter"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterControls;