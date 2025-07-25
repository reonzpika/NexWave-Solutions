import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TemplateEditor = ({ 
  template, 
  onSave, 
  onCancel, 
  isPreviewMode, 
  onTogglePreview 
}) => {
  const [templateData, setTemplateData] = useState(template || {
    name: '',
    description: '',
    category: '',
    content: '',
    tags: [],
    isShared: false
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [newTag, setNewTag] = useState('');
  const editorRef = useRef(null);

  const categories = [
    { value: 'consultation', label: 'General Consultation' },
    { value: 'specialist', label: 'Specialist Referral' },
    { value: 'chronic', label: 'Chronic Conditions' },
    { value: 'acute', label: 'Acute Care' },
    { value: 'preventive', label: 'Preventive Care' },
    { value: 'mental-health', label: 'Mental Health' },
    { value: 'pediatric', label: 'Pediatric' },
    { value: 'geriatric', label: 'Geriatric' }
  ];

  const placeholderFields = [
    { value: '{{patient.name}}', label: 'Patient Name' },
    { value: '{{patient.age}}', label: 'Patient Age' },
    { value: '{{patient.dob}}', label: 'Date of Birth' },
    { value: '{{patient.nhi}}', label: 'NHI Number' },
    { value: '{{patient.address}}', label: 'Patient Address' },
    { value: '{{consultation.date}}', label: 'Consultation Date' },
    { value: '{{consultation.time}}', label: 'Consultation Time' },
    { value: '{{doctor.name}}', label: 'Doctor Name' },
    { value: '{{practice.name}}', label: 'Practice Name' },
    { value: '{{medications.current}}', label: 'Current Medications' },
    { value: '{{allergies.known}}', label: 'Known Allergies' },
    { value: '{{history.medical}}', label: 'Medical History' }
  ];

  useEffect(() => {
    if (template) {
      setTemplateData(template);
      setHasChanges(false);
    }
  }, [template]);

  const handleInputChange = (field, value) => {
    setTemplateData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleContentChange = (e) => {
    handleInputChange('content', e.target.value);
  };

  const insertPlaceholder = (placeholder) => {
    const textarea = editorRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const content = templateData.content;
      const newContent = content.substring(0, start) + placeholder + content.substring(end);
      
      handleInputChange('content', newContent);
      
      // Reset cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + placeholder.length, start + placeholder.length);
      }, 0);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !templateData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...templateData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    handleInputChange('tags', templateData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    onSave(templateData);
    setHasChanges(false);
  };

  const formatPreviewContent = (content) => {
    // Replace placeholders with sample data for preview
    const sampleData = {
      '{{patient.name}}': 'John Smith',
      '{{patient.age}}': '45',
      '{{patient.dob}}': '15/03/1979',
      '{{patient.nhi}}': 'ABC1234',
      '{{patient.address}}': '123 Queen Street, Auckland',
      '{{consultation.date}}': '25/07/2025',
      '{{consultation.time}}': '10:30 AM',
      '{{doctor.name}}': 'Dr. Sarah Wilson',
      '{{practice.name}}': 'Auckland Medical Centre',
      '{{medications.current}}': 'Metformin 500mg BD, Lisinopril 10mg OD',
      '{{allergies.known}}': 'Penicillin, Shellfish',
      '{{history.medical}}': 'Type 2 Diabetes, Hypertension'
    };

    let previewContent = content;
    Object.entries(sampleData).forEach(([placeholder, value]) => {
      previewContent = previewContent.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value);
    });

    return previewContent;
  };

  if (!template && !templateData.name && !hasChanges) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <Icon name="FileText" size={64} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Template Selected</h3>
          <p className="text-muted-foreground mb-4">
            Select a template from the library or create a new one to get started
          </p>
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            onClick={() => handleInputChange('name', 'New Template')}
          >
            Create New Template
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Input
              type="text"
              value={templateData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Template name"
              className="text-lg font-semibold border-none bg-transparent p-0 focus:ring-0"
            />
            {hasChanges && (
              <span className="px-2 py-1 bg-warning/20 text-warning text-xs rounded-full">
                Unsaved changes
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName={isPreviewMode ? "Edit" : "Eye"}
              iconPosition="left"
              onClick={onTogglePreview}
            >
              {isPreviewMode ? 'Edit' : 'Preview'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="Save"
              iconPosition="left"
              onClick={handleSave}
              disabled={!hasChanges}
            >
              Save Template
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Description"
            type="text"
            value={templateData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Brief description of this template"
          />
          
          <Select
            label="Category"
            options={categories}
            value={templateData.category}
            onChange={(value) => handleInputChange('category', value)}
            placeholder="Select category"
          />
        </div>

        {/* Tags */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-foreground mb-2">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {templateData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-2 hover:text-destructive"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add tag"
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              iconName="Plus"
              onClick={addTag}
            >
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* Editor/Preview Content */}
      <div className="flex-1 flex">
        {/* Placeholder Fields Sidebar */}
        {!isPreviewMode && (
          <div className="w-64 bg-muted/30 border-r border-border p-4">
            <h3 className="text-sm font-medium text-foreground mb-3">Insert Fields</h3>
            <div className="space-y-1">
              {placeholderFields.map((field) => (
                <button
                  key={field.value}
                  onClick={() => insertPlaceholder(field.value)}
                  className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors duration-150"
                >
                  {field.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 p-4">
          {isPreviewMode ? (
            <div className="bg-card border border-border rounded-lg p-6 h-full overflow-y-auto">
              <h3 className="text-lg font-semibold text-foreground mb-4">Template Preview</h3>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm text-foreground leading-relaxed">
                  {formatPreviewContent(templateData.content)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="h-full">
              <label className="block text-sm font-medium text-foreground mb-2">
                Template Content
              </label>
              <textarea
                ref={editorRef}
                value={templateData.content}
                onChange={handleContentChange}
                placeholder={`Enter your template content here. Use placeholder fields from the sidebar to insert dynamic data.

Example:
Patient: {{patient.name}}
DOB: {{patient.dob}}
NHI: {{patient.nhi}}

Chief Complaint:
[Enter chief complaint here]

History of Presenting Complaint:
[Enter history here]

Examination:
[Enter examination findings here]

Assessment:
[Enter assessment here]

Plan:
[Enter management plan here]`}
                className="w-full h-full p-4 border border-border rounded-lg bg-card text-foreground resize-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm leading-relaxed"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;