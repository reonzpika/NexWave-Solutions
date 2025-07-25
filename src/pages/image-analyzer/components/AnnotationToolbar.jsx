import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AnnotationToolbar = ({ 
  selectedTool, 
  onToolSelect, 
  annotations, 
  onClearAnnotations,
  onExportAnnotations,
  isAnnotating,
  onToggleAnnotating 
}) => {
  const tools = [
    {
      id: 'point',
      name: 'Point Marker',
      icon: 'MapPin',
      description: 'Mark specific areas of interest'
    },
    {
      id: 'measurement',
      name: 'Measurement',
      icon: 'Ruler',
      description: 'Measure lesion dimensions'
    },
    {
      id: 'area',
      name: 'Area Selection',
      icon: 'Square',
      description: 'Select regions for analysis'
    },
    {
      id: 'text',
      name: 'Text Label',
      icon: 'Type',
      description: 'Add descriptive labels'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Edit3" size={16} className="text-primary" />
            <span className="font-medium text-foreground">Annotation Tools</span>
          </div>
          
          <Button
            variant={isAnnotating ? "default" : "outline"}
            size="sm"
            onClick={onToggleAnnotating}
            iconName={isAnnotating ? "Square" : "Edit3"}
            iconSize={14}
          >
            {isAnnotating ? 'Exit' : 'Annotate'}
          </Button>
        </div>

        {/* Tools */}
        <div className="grid grid-cols-2 gap-2">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onToolSelect(tool.id)}
              disabled={!isAnnotating}
              className={`p-3 rounded-lg border transition-all duration-150 text-left ${
                selectedTool === tool.id && isAnnotating
                  ? 'border-primary bg-primary/10 text-primary'
                  : isAnnotating
                    ? 'border-border hover:border-primary/50 hover:bg-muted/50' :'border-border bg-muted/20 text-muted-foreground cursor-not-allowed'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <Icon name={tool.icon} size={16} />
                <span className="text-sm font-medium">{tool.name}</span>
              </div>
              <p className="text-xs opacity-80">{tool.description}</p>
            </button>
          ))}
        </div>

        {/* Annotation Stats */}
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Annotations</span>
            <span className="text-sm text-muted-foreground">{annotations.length} total</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">
                Points: {annotations.filter(a => a.type === 'point').length}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span className="text-muted-foreground">
                Measurements: {annotations.filter(a => a.type === 'measurement').length}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onExportAnnotations}
            iconName="Download"
            iconPosition="left"
            disabled={annotations.length === 0}
            fullWidth
          >
            Export Annotations
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={onClearAnnotations}
            iconName="Trash2"
            iconPosition="left"
            disabled={annotations.length === 0}
            fullWidth
          >
            Clear All
          </Button>
        </div>

        {/* Instructions */}
        <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={14} className="text-primary mt-0.5" />
            <div className="text-xs text-primary">
              <p className="font-medium mb-1">How to annotate:</p>
              <ul className="space-y-1 opacity-90">
                <li>• Select a tool and click on the image</li>
                <li>• Drag to create measurements or areas</li>
                <li>• Click annotations to edit or delete</li>
                <li>• Use zoom for precise placement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnotationToolbar;