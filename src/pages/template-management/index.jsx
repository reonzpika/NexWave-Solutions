import React, { useState, useEffect } from 'react';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import TemplateLibrary from './components/TemplateLibrary';
import TemplateEditor from './components/TemplateEditor';
import TemplateMetadata from './components/TemplateMetadata';
import BulkOperations from './components/BulkOperations';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const TemplateManagement = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showBulkOperations, setShowBulkOperations] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock templates data
  useEffect(() => {
    const mockTemplates = [
      {
        id: 1,
        name: 'General Consultation',
        description: 'Standard consultation template for routine visits',
        category: 'consultation',
        content: `Patient: {{patient.name}}
DOB: {{patient.dob}}
NHI: {{patient.nhi}}

Chief Complaint:
{{chief_complaint}}

History of Presenting Complaint:
{{history_presenting}}

Past Medical History:
{{history.medical}}

Current Medications:
{{medications.current}}

Known Allergies:
{{allergies.known}}

Examination:
General: Well appearing, no acute distress
Vital Signs: BP {{vitals.bp}}, HR {{vitals.hr}}, Temp {{vitals.temp}}
{{examination_findings}}

Assessment:
{{assessment}}

Plan:
{{management_plan}}

Follow-up: {{followup_plan}}

Dr. {{doctor.name}}
{{practice.name}}
Date: {{consultation.date}}`,
        tags: ['routine', 'general', 'consultation'],
        author: 'Dr. Sarah Wilson',
        createdAt: new Date('2025-06-15T10:30:00'),
        lastModified: new Date('2025-07-20T14:30:00'),
        lastUsed: new Date('2025-07-24T09:15:00'),
        usageCount: 45,
        monthlyUsage: 12,
        isShared: true,
        allowModifications: true
      },
      {
        id: 2,
        name: 'Diabetes Review',
        description: 'Comprehensive diabetes management review template',
        category: 'chronic',
        content: `Patient: {{patient.name}}
DOB: {{patient.dob}}
NHI: {{patient.nhi}}

DIABETES REVIEW - {{consultation.date}}

Current Medications:
{{medications.current}}

Recent HbA1c: {{lab.hba1c}} (Date: {{lab.hba1c_date}})
Target HbA1c: <53 mmol/mol

Blood Glucose Monitoring:
{{bgm_frequency}}
Recent readings: {{bgm_readings}}

Complications Screening:
Eyes: {{screening.eyes}} (Last: {{screening.eyes_date}})
Feet: {{screening.feet}}
Kidneys: eGFR {{lab.egfr}}, ACR {{lab.acr}}

Blood Pressure: {{vitals.bp}}
Weight: {{vitals.weight}} kg (BMI: {{vitals.bmi}})

Assessment:
{{diabetes_control}}

Plan:
{{management_plan}}

Next Review: {{next_review}}

Dr. {{doctor.name}}`,
        tags: ['diabetes', 'chronic', 'review'],
        author: 'Dr. Sarah Wilson',
        createdAt: new Date('2025-05-20T11:00:00'),
        lastModified: new Date('2025-07-18T16:45:00'),
        lastUsed: new Date('2025-07-23T14:20:00'),
        usageCount: 28,
        monthlyUsage: 8,
        isShared: true,
        allowModifications: false
      },
      {
        id: 3,
        name: 'Specialist Referral',
        description: 'Template for specialist referrals with comprehensive patient information',
        category: 'specialist',
        content: `SPECIALIST REFERRAL

To: {{referral.specialist}}
From: Dr. {{doctor.name}}, {{practice.name}}
Date: {{consultation.date}}

Patient Details:
Name: {{patient.name}}
DOB: {{patient.dob}}
NHI: {{patient.nhi}}
Address: {{patient.address}}
Phone: {{patient.phone}}

Reason for Referral:
{{referral.reason}}

Clinical History:
{{clinical_history}}

Current Medications:
{{medications.current}}

Relevant Investigations:
{{investigations}}

Examination Findings:
{{examination}}

Urgency: {{referral.urgency}}

Please see and advise on management.

Thank you for your assistance.

Dr. {{doctor.name}}
{{practice.name}}
Phone: {{practice.phone}}
Email: {{practice.email}}`,
        tags: ['referral', 'specialist', 'communication'],
        author: 'Dr. Sarah Wilson',
        createdAt: new Date('2025-04-10T09:30:00'),
        lastModified: new Date('2025-07-15T13:20:00'),
        lastUsed: new Date('2025-07-22T11:45:00'),
        usageCount: 67,
        monthlyUsage: 15,
        isShared: true,
        allowModifications: true
      },
      {
        id: 4,
        name: 'Mental Health Assessment',
        description: 'Comprehensive mental health screening and assessment template',
        category: 'mental-health',
        content: `MENTAL HEALTH ASSESSMENT

Patient: {{patient.name}}
DOB: {{patient.dob}}
Date: {{consultation.date}}

Presenting Concerns:
{{presenting_concerns}}

Mental State Examination:
Appearance: {{mse.appearance}}
Behaviour: {{mse.behaviour}}
Speech: {{mse.speech}}
Mood: {{mse.mood}}
Affect: {{mse.affect}}
Thought: {{mse.thought}}
Perception: {{mse.perception}}
Cognition: {{mse.cognition}}
Insight: {{mse.insight}}
Judgement: {{mse.judgement}}

Risk Assessment:
Suicide risk: {{risk.suicide}}
Self-harm risk: {{risk.selfharm}}
Risk to others: {{risk.others}}

PHQ-9 Score: {{phq9.score}}/27
GAD-7 Score: {{gad7.score}}/21

Current Medications:
{{medications.current}}

Assessment:
{{assessment}}

Management Plan:
{{management_plan}}

Follow-up: {{followup}}

Crisis contacts provided: {{crisis_contacts}}

Dr. {{doctor.name}}`,
        tags: ['mental-health', 'assessment', 'screening'],
        author: 'Dr. Sarah Wilson',
        createdAt: new Date('2025-03-25T14:15:00'),
        lastModified: new Date('2025-07-12T10:30:00'),
        lastUsed: new Date('2025-07-21T15:30:00'),
        usageCount: 23,
        monthlyUsage: 6,
        isShared: false,
        allowModifications: false
      },
      {
        id: 5,
        name: 'Pediatric Consultation',
        description: 'Child consultation template with growth and development tracking',
        category: 'pediatric',
        content: `PEDIATRIC CONSULTATION

Child: {{patient.name}}
DOB: {{patient.dob}} (Age: {{patient.age}})
Parent/Guardian: {{parent.name}}
Date: {{consultation.date}}

Chief Complaint:
{{chief_complaint}}

History of Presenting Complaint:
{{history_presenting}}

Birth History:
{{birth_history}}

Developmental History:
{{development_history}}

Immunization Status:
{{immunizations}}

Growth Parameters:
Weight: {{vitals.weight}} kg ({{percentile.weight}} percentile)
Height: {{vitals.height}} cm ({{percentile.height}} percentile)
Head Circumference: {{vitals.hc}} cm ({{percentile.hc}} percentile)

Examination:
General: {{examination.general}}
Systems: {{examination.systems}}

Assessment:
{{assessment}}

Plan:
{{management_plan}}

Parent Education:
{{parent_education}}

Next Review: {{next_review}}

Dr. {{doctor.name}}`,
        tags: ['pediatric', 'children', 'development'],
        author: 'Dr. Sarah Wilson',
        createdAt: new Date('2025-02-18T08:45:00'),
        lastModified: new Date('2025-07-10T12:15:00'),
        lastUsed: new Date('2025-07-20T10:20:00'),
        usageCount: 34,
        monthlyUsage: 9,
        isShared: true,
        allowModifications: true
      }
    ];

    setTimeout(() => {
      setTemplates(mockTemplates);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setIsPreviewMode(false);
  };

  const handleCreateNew = () => {
    const newTemplate = {
      id: Date.now(),
      name: 'New Template',
      description: '',
      category: 'consultation',
      content: '',
      tags: [],
      author: 'Dr. Sarah Wilson',
      createdAt: new Date(),
      lastModified: new Date(),
      lastUsed: new Date(),
      usageCount: 0,
      monthlyUsage: 0,
      isShared: false,
      allowModifications: false
    };
    setSelectedTemplate(newTemplate);
    setIsPreviewMode(false);
  };

  const handleSaveTemplate = (templateData) => {
    if (templateData.id && templates.find(t => t.id === templateData.id)) {
      // Update existing template
      setTemplates(prev => prev.map(t => 
        t.id === templateData.id 
          ? { ...templateData, lastModified: new Date() }
          : t
      ));
    } else {
      // Create new template
      const newTemplate = {
        ...templateData,
        id: Date.now(),
        createdAt: new Date(),
        lastModified: new Date(),
        lastUsed: new Date(),
        usageCount: 0,
        monthlyUsage: 0,
        author: 'Dr. Sarah Wilson'
      };
      setTemplates(prev => [newTemplate, ...prev]);
      setSelectedTemplate(newTemplate);
    }
  };

  const handleDeleteTemplate = (template) => {
    if (window.confirm(`Are you sure you want to delete "${template.name}"? This action cannot be undone.`)) {
      setTemplates(prev => prev.filter(t => t.id !== template.id));
      if (selectedTemplate?.id === template.id) {
        setSelectedTemplate(null);
      }
    }
  };

  const handleDuplicateTemplate = (template) => {
    const duplicatedTemplate = {
      ...template,
      id: Date.now(),
      name: `${template.name} (Copy)`,
      createdAt: new Date(),
      lastModified: new Date(),
      usageCount: 0,
      monthlyUsage: 0,
      isShared: false
    };
    setTemplates(prev => [duplicatedTemplate, ...prev]);
    setSelectedTemplate(duplicatedTemplate);
  };

  const handleShareTemplate = (template) => {
    // Simulate sharing functionality
    console.log('Sharing template:', template.name);
    alert(`Template "${template.name}" has been shared with your practice.`);
  };

  const handleExportTemplate = (template) => {
    // Simulate export functionality
    const dataStr = JSON.stringify(template, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${template.name.replace(/\s+/g, '_')}_template.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleBulkAction = (action, data) => {
    switch (action) {
      case 'import': console.log('Importing templates from:', data.file.name);
        alert(`Successfully imported templates from ${data.file.name}`);
        break;
      case 'export':
        console.log('Exporting templates in format:', data.format);
        alert(`Successfully exported ${data.templates.length} templates in ${data.format} format`);
        break;
      case 'delete':
        setTemplates(prev => prev.filter(t => !data.templates.some(dt => dt.id === t.id)));
        setSelectedTemplates([]);
        if (selectedTemplate && data.templates.some(dt => dt.id === selectedTemplate.id)) {
          setSelectedTemplate(null);
        }
        break;
      case 'share': console.log('Sharing templates:', data.templates.length);
        alert(`Successfully shared ${data.templates.length} templates with your practice`);
        break;
      default:
        break;
    }
    setShowBulkOperations(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationSidebar />
        <div className="ml-16 lg:ml-72 transition-all duration-300 flex items-center justify-center h-screen">
          <div className="text-center">
            <Icon name="Loader2" size={48} className="text-primary mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Loading templates...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar />
      
      <div className="ml-16 lg:ml-72 transition-all duration-300 flex h-screen">
        {/* Template Library */}
        <div className="flex-shrink-0 w-full sm:w-80 lg:w-96 border-r border-border bg-card overflow-y-auto">
          <TemplateLibrary
            templates={templates}
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
            onCreateNew={handleCreateNew}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Template Editor */}
        <div className="flex-1 min-w-0">
          <TemplateEditor
            template={selectedTemplate}
            onSave={handleSaveTemplate}
            onCancel={() => setSelectedTemplate(null)}
            isPreviewMode={isPreviewMode}
            onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
          />
        </div>

        {/* Template Metadata */}
        <div className="hidden xl:block flex-shrink-0 w-80 border-l border-border bg-card overflow-y-auto">
          <TemplateMetadata
            template={selectedTemplate}
            onUpdate={handleSaveTemplate}
            onDelete={handleDeleteTemplate}
            onDuplicate={handleDuplicateTemplate}
            onShare={handleShareTemplate}
            onExport={handleExportTemplate}
          />
        </div>
      </div>

      {/* Bulk Operations Modal */}
      <BulkOperations
        isVisible={showBulkOperations}
        onClose={() => setShowBulkOperations(false)}
        selectedTemplates={selectedTemplates}
        onBulkAction={handleBulkAction}
      />

      {/* Floating Action Button for Bulk Operations */}
      {templates.length > 0 && (
        <Button
          variant="default"
          size="lg"
          iconName="Settings"
          onClick={() => setShowBulkOperations(true)}
          className="fixed bottom-6 right-6 rounded-full shadow-clinical-lg z-50 touch-target"
          aria-label="Open bulk operations"
        >
          <span className="hidden sm:inline ml-2">Bulk Operations</span>
        </Button>
      )}
    </div>
  );
};

export default TemplateManagement;