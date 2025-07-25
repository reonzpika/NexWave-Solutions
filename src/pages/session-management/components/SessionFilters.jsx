import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SessionFilters = ({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange,
  dateFilter,
  onDateFilterChange,
  onClearFilters,
  onBulkAction
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Sessions' },
    { value: 'recording', label: 'Recording' },
    { value: 'processing', label: 'Processing' },
    { value: 'paused', label: 'Paused' },
    { value: 'completed', label: 'Completed' },
    { value: 'error', label: 'Error' }
  ];

  const dateOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'this-week', label: 'This Week' },
    { value: 'last-week', label: 'Last Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const bulkActions = [
    { value: 'pause-all', label: 'Pause All Active' },
    { value: 'resume-all', label: 'Resume All Paused' },
    { value: 'export-selected', label: 'Export Selected' },
    { value: 'delete-selected', label: 'Delete Selected' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-clinical">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
          <div className="flex-1 min-w-0">
            <Input
              type="search"
              placeholder="Search by patient name, ID, or consultation type..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex space-x-4">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={onStatusFilterChange}
              placeholder="Filter by status"
              className="w-48"
            />
            
            <Select
              options={dateOptions}
              value={dateFilter}
              onChange={onDateFilterChange}
              placeholder="Filter by date"
              className="w-48"
            />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            iconName="RotateCcw"
            iconPosition="left"
            onClick={onClearFilters}
          >
            Clear Filters
          </Button>
          
          <Select
            options={bulkActions}
            value=""
            onChange={(value) => onBulkAction(value)}
            placeholder="Bulk Actions"
            className="w-48"
          />
          
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
          >
            Export All
          </Button>
          
          <Button
            variant="default"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
          >
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Active Filters Display */}
      {(searchTerm || statusFilter !== 'all' || dateFilter !== 'today') && (
        <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {searchTerm && (
            <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
              <Icon name="Search" size={12} />
              <span>"{searchTerm}"</span>
              <button
                onClick={() => onSearchChange('')}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <Icon name="X" size={10} />
              </button>
            </div>
          )}
          
          {statusFilter !== 'all' && (
            <div className="flex items-center space-x-1 bg-success/10 text-success px-2 py-1 rounded-full text-xs">
              <Icon name="Filter" size={12} />
              <span>{statusOptions.find(opt => opt.value === statusFilter)?.label}</span>
              <button
                onClick={() => onStatusFilterChange('all')}
                className="hover:bg-success/20 rounded-full p-0.5"
              >
                <Icon name="X" size={10} />
              </button>
            </div>
          )}
          
          {dateFilter !== 'today' && (
            <div className="flex items-center space-x-1 bg-warning/10 text-warning px-2 py-1 rounded-full text-xs">
              <Icon name="Calendar" size={12} />
              <span>{dateOptions.find(opt => opt.value === dateFilter)?.label}</span>
              <button
                onClick={() => onDateFilterChange('today')}
                className="hover:bg-warning/20 rounded-full p-0.5"
              >
                <Icon name="X" size={10} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SessionFilters;