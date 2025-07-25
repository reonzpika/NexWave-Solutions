import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const TemplateMetadata = ({ 
  template, 
  onUpdate, 
  onDelete, 
  onDuplicate, 
  onShare,
  onExport 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!template) {
    return (
      <div className="w-80 bg-card border-l border-border p-4">
        <div className="text-center text-muted-foreground">
          <Icon name="Info" size={48} className="mx-auto mb-3" />
          <p>Select a template to view details</p>
        </div>
      </div>
    );
  }

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-NZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const usageStats = [
    { label: 'Total Uses', value: template.usageCount, icon: 'BarChart3' },
    { label: 'This Month', value: template.monthlyUsage || 12, icon: 'Calendar' },
    { label: 'Avg. Time Saved', value: '3.2 min', icon: 'Clock' },
    { label: 'Success Rate', value: '94%', icon: 'CheckCircle' }
  ];

  const recentVersions = [
    {
      version: '1.3',
      date: new Date('2025-07-20T14:30:00'),
      author: 'Dr. Sarah Wilson',
      changes: 'Updated medication section formatting'
    },
    {
      version: '1.2',
      date: new Date('2025-07-15T09:15:00'),
      author: 'Dr. Sarah Wilson',
      changes: 'Added allergy information placeholder'
    },
    {
      version: '1.1',
      date: new Date('2025-07-10T16:45:00'),
      author: 'Dr. Sarah Wilson',
      changes: 'Initial template creation'
    }
  ];

  return (
    <div className="w-80 bg-card border-l border-border h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground">Template Details</h3>
          <Button
            variant="ghost"
            size="sm"
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            onClick={() => setIsExpanded(!isExpanded)}
          />
        </div>
        
        {isExpanded && (
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Category</p>
              <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                {template.category}
              </span>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Created</p>
              <p className="text-sm text-foreground">{formatDate(template.createdAt)}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Last Modified</p>
              <p className="text-sm text-foreground">{formatDate(template.lastModified)}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Author</p>
              <p className="text-sm text-foreground">{template.author}</p>
            </div>
          </div>
        )}
      </div>

      {/* Usage Statistics */}
      <div className="p-4 border-b border-border">
        <h4 className="text-sm font-medium text-foreground mb-3">Usage Statistics</h4>
        <div className="grid grid-cols-2 gap-3">
          {usageStats.map((stat, index) => (
            <div key={index} className="bg-muted/30 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name={stat.icon} size={14} className="text-primary" />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-lg font-semibold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sharing Options */}
      <div className="p-4 border-b border-border">
        <h4 className="text-sm font-medium text-foreground mb-3">Sharing & Access</h4>
        <div className="space-y-3">
          <Checkbox
            label="Share with practice"
            description="Allow other doctors to use this template"
            checked={template.isShared}
            onChange={(e) => onUpdate({ ...template, isShared: e.target.checked })}
          />
          
          <Checkbox
            label="Allow modifications"
            description="Others can edit and improve this template"
            checked={template.allowModifications || false}
            onChange={(e) => onUpdate({ ...template, allowModifications: e.target.checked })}
            disabled={!template.isShared}
          />
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Share"
              iconPosition="left"
              onClick={() => onShare(template)}
              className="flex-1"
            >
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={() => onExport(template)}
              className="flex-1"
            >
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Version History */}
      <div className="p-4 border-b border-border">
        <h4 className="text-sm font-medium text-foreground mb-3">Version History</h4>
        <div className="space-y-3">
          {recentVersions.map((version, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary">v{version.version}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground">Version {version.version}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(version.date)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{version.author}</p>
                <p className="text-xs text-muted-foreground">{version.changes}</p>
              </div>
            </div>
          ))}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          iconName="History"
          iconPosition="left"
          className="w-full mt-3"
        >
          View Full History
        </Button>
      </div>

      {/* Actions */}
      <div className="p-4">
        <h4 className="text-sm font-medium text-foreground mb-3">Actions</h4>
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Copy"
            iconPosition="left"
            onClick={() => onDuplicate(template)}
            className="w-full"
          >
            Duplicate Template
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            iconName="TestTube"
            iconPosition="left"
            className="w-full"
          >
            Test with Sample Data
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            iconName="FileDown"
            iconPosition="left"
            onClick={() => onExport(template)}
            className="w-full"
          >
            Export as PDF
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            iconName="Trash2"
            iconPosition="left"
            onClick={() => onDelete(template)}
            className="w-full"
          >
            Delete Template
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplateMetadata;