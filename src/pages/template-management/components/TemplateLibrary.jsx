import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TemplateLibrary = ({ 
  templates, 
  selectedTemplate, 
  onTemplateSelect, 
  onCreateNew,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange 
}) => {
  const [filteredTemplates, setFilteredTemplates] = useState(templates);

  const categories = [
    { value: 'all', label: 'All Templates' },
    { value: 'consultation', label: 'General Consultation' },
    { value: 'specialist', label: 'Specialist Referral' },
    { value: 'chronic', label: 'Chronic Conditions' },
    { value: 'acute', label: 'Acute Care' },
    { value: 'preventive', label: 'Preventive Care' },
    { value: 'mental-health', label: 'Mental Health' },
    { value: 'pediatric', label: 'Pediatric' },
    { value: 'geriatric', label: 'Geriatric' }
  ];

  useEffect(() => {
    let filtered = templates;

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredTemplates(filtered);
  }, [templates, selectedCategory, searchQuery]);

  const getTemplateIcon = (category) => {
    const iconMap = {
      consultation: 'FileText',
      specialist: 'UserCheck',
      chronic: 'Heart',
      acute: 'AlertTriangle',
      preventive: 'Shield',
      'mental-health': 'Brain',
      pediatric: 'Baby',
      geriatric: 'Users'
    };
    return iconMap[category] || 'FileText';
  };

  const formatLastUsed = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <div className="w-80 bg-card border-r border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Template Library</h2>
          <Button
            variant="default"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={onCreateNew}
          >
            New Template
          </Button>
        </div>

        {/* Search */}
        <Input
          type="search"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="mb-3"
        />

        {/* Category Filter */}
        <Select
          options={categories}
          value={selectedCategory}
          onChange={onCategoryChange}
          placeholder="Filter by category"
        />
      </div>

      {/* Template List */}
      <div className="flex-1 overflow-y-auto">
        {filteredTemplates.length === 0 ? (
          <div className="p-4 text-center">
            <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No templates found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or category filter
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => onTemplateSelect(template)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-150 border ${
                  selectedTemplate?.id === template.id
                    ? 'bg-primary/10 border-primary/20 text-primary' :'bg-background hover:bg-muted border-transparent'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    selectedTemplate?.id === template.id
                      ? 'bg-primary/20' :'bg-muted'
                  }`}>
                    <Icon 
                      name={getTemplateIcon(template.category)} 
                      size={16}
                      className={selectedTemplate?.id === template.id ? 'text-primary' : 'text-muted-foreground'}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium truncate">{template.name}</h3>
                      {template.isShared && (
                        <Icon name="Users" size={12} className="text-muted-foreground ml-2" />
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {template.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Used {template.usageCount} times
                      </span>
                      <span className="text-muted-foreground">
                        {formatLastUsed(template.lastUsed)}
                      </span>
                    </div>
                    
                    {template.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {template.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-0.5 bg-muted text-muted-foreground rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {template.tags.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{template.tags.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {filteredTemplates.length} templates
          </span>
          <Button
            variant="ghost"
            size="sm"
            iconName="Download"
            iconPosition="left"
          >
            Export All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplateLibrary;