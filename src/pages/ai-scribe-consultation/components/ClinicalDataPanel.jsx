import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ClinicalDataPanel = ({ 
  extractedData, 
  onDataUpdate, 
  isProcessing,
  selectedTemplate,
  onGenerateNote 
}) => {
  const [activeSection, setActiveSection] = useState('symptoms');
  const [localData, setLocalData] = useState(extractedData);

  useEffect(() => {
    setLocalData(extractedData);
  }, [extractedData]);

  const sections = [
    { id: 'symptoms', label: 'Symptoms', icon: 'Stethoscope' },
    { id: 'examination', label: 'Examination', icon: 'Search' },
    { id: 'diagnosis', label: 'Diagnosis', icon: 'FileText' },
    { id: 'treatment', label: 'Treatment', icon: 'Pill' },
    { id: 'followup', label: 'Follow-up', icon: 'Calendar' }
  ];

  const severityOptions = [
    { value: 'mild', label: 'Mild' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'severe', label: 'Severe' }
  ];

  const urgencyOptions = [
    { value: 'routine', label: 'Routine' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'emergency', label: 'Emergency' }
  ];

  const handleFieldUpdate = (section, field, value) => {
    const updatedData = {
      ...localData,
      [section]: {
        ...localData[section],
        [field]: value
      }
    };
    setLocalData(updatedData);
    onDataUpdate(updatedData);
  };

  const handleArrayFieldUpdate = (section, field, index, value) => {
    const updatedArray = [...localData[section][field]];
    updatedArray[index] = value;
    handleFieldUpdate(section, field, updatedArray);
  };

  const addArrayItem = (section, field) => {
    const currentArray = localData[section][field] || [];
    handleFieldUpdate(section, field, [...currentArray, '']);
  };

  const removeArrayItem = (section, field, index) => {
    const updatedArray = localData[section][field].filter((_, i) => i !== index);
    handleFieldUpdate(section, field, updatedArray);
  };

  const renderSymptoms = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Chief Complaint
        </label>
        <Input
          type="text"
          placeholder="Primary reason for visit"
          value={localData.symptoms?.chief_complaint || ''}
          onChange={(e) => handleFieldUpdate('symptoms', 'chief_complaint', e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          History of Present Illness
        </label>
        <textarea
          className="w-full p-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          rows={4}
          placeholder="Detailed description of current symptoms..."
          value={localData.symptoms?.history || ''}
          onChange={(e) => handleFieldUpdate('symptoms', 'history', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Duration
          </label>
          <Input
            type="text"
            placeholder="e.g., 3 days, 2 weeks"
            value={localData.symptoms?.duration || ''}
            onChange={(e) => handleFieldUpdate('symptoms', 'duration', e.target.value)}
          />
        </div>
        <div>
          <Select
            label="Severity"
            options={severityOptions}
            value={localData.symptoms?.severity || ''}
            onChange={(value) => handleFieldUpdate('symptoms', 'severity', value)}
            placeholder="Select severity"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-foreground">
            Associated Symptoms
          </label>
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={() => addArrayItem('symptoms', 'associated')}
          >
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {(localData.symptoms?.associated || []).map((symptom, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Associated symptom"
                value={symptom}
                onChange={(e) => handleArrayFieldUpdate('symptoms', 'associated', index, e.target.value)}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => removeArrayItem('symptoms', 'associated', index)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderExamination = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Vital Signs
        </label>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="text"
            placeholder="BP (e.g., 120/80)"
            value={localData.examination?.vitals?.bp || ''}
            onChange={(e) => handleFieldUpdate('examination', 'vitals', { 
              ...localData.examination?.vitals, 
              bp: e.target.value 
            })}
          />
          <Input
            type="text"
            placeholder="HR (e.g., 72 bpm)"
            value={localData.examination?.vitals?.hr || ''}
            onChange={(e) => handleFieldUpdate('examination', 'vitals', { 
              ...localData.examination?.vitals, 
              hr: e.target.value 
            })}
          />
          <Input
            type="text"
            placeholder="Temp (e.g., 36.5°C)"
            value={localData.examination?.vitals?.temp || ''}
            onChange={(e) => handleFieldUpdate('examination', 'vitals', { 
              ...localData.examination?.vitals, 
              temp: e.target.value 
            })}
          />
          <Input
            type="text"
            placeholder="RR (e.g., 16/min)"
            value={localData.examination?.vitals?.rr || ''}
            onChange={(e) => handleFieldUpdate('examination', 'vitals', { 
              ...localData.examination?.vitals, 
              rr: e.target.value 
            })}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Physical Examination
        </label>
        <textarea
          className="w-full p-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          rows={6}
          placeholder="Detailed physical examination findings..."
          value={localData.examination?.physical || ''}
          onChange={(e) => handleFieldUpdate('examination', 'physical', e.target.value)}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-foreground">
            Key Findings
          </label>
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={() => addArrayItem('examination', 'findings')}
          >
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {(localData.examination?.findings || []).map((finding, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Examination finding"
                value={finding}
                onChange={(e) => handleArrayFieldUpdate('examination', 'findings', index, e.target.value)}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => removeArrayItem('examination', 'findings', index)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDiagnosis = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Primary Diagnosis
        </label>
        <Input
          type="text"
          placeholder="Primary diagnosis with ICD-10 code if applicable"
          value={localData.diagnosis?.primary || ''}
          onChange={(e) => handleFieldUpdate('diagnosis', 'primary', e.target.value)}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-foreground">
            Differential Diagnoses
          </label>
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={() => addArrayItem('diagnosis', 'differential')}
          >
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {(localData.diagnosis?.differential || []).map((diagnosis, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Differential diagnosis"
                value={diagnosis}
                onChange={(e) => handleArrayFieldUpdate('diagnosis', 'differential', index, e.target.value)}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => removeArrayItem('diagnosis', 'differential', index)}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Clinical Reasoning
        </label>
        <textarea
          className="w-full p-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          rows={4}
          placeholder="Clinical reasoning and diagnostic process..."
          value={localData.diagnosis?.reasoning || ''}
          onChange={(e) => handleFieldUpdate('diagnosis', 'reasoning', e.target.value)}
        />
      </div>
    </div>
  );

  const renderTreatment = () => (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-foreground">
            Medications
          </label>
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={() => addArrayItem('treatment', 'medications')}
          >
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {(localData.treatment?.medications || []).map((medication, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Medication name, dose, frequency"
                value={medication}
                onChange={(e) => handleArrayFieldUpdate('treatment', 'medications', index, e.target.value)}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => removeArrayItem('treatment', 'medications', index)}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-foreground">
            Non-Pharmacological Interventions
          </label>
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={() => addArrayItem('treatment', 'interventions')}
          >
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {(localData.treatment?.interventions || []).map((intervention, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Non-pharmacological intervention"
                value={intervention}
                onChange={(e) => handleArrayFieldUpdate('treatment', 'interventions', index, e.target.value)}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => removeArrayItem('treatment', 'interventions', index)}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Patient Education
        </label>
        <textarea
          className="w-full p-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          rows={3}
          placeholder="Patient education and advice provided..."
          value={localData.treatment?.education || ''}
          onChange={(e) => handleFieldUpdate('treatment', 'education', e.target.value)}
        />
      </div>
    </div>
  );

  const renderFollowUp = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Follow-up Timeframe
          </label>
          <Input
            type="text"
            placeholder="e.g., 1 week, 2 months"
            value={localData.followup?.timeframe || ''}
            onChange={(e) => handleFieldUpdate('followup', 'timeframe', e.target.value)}
          />
        </div>
        <div>
          <Select
            label="Urgency"
            options={urgencyOptions}
            value={localData.followup?.urgency || ''}
            onChange={(value) => handleFieldUpdate('followup', 'urgency', value)}
            placeholder="Select urgency"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-foreground">
            Required Tests/Investigations
          </label>
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={() => addArrayItem('followup', 'tests')}
          >
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {(localData.followup?.tests || []).map((test, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Test or investigation"
                value={test}
                onChange={(e) => handleArrayFieldUpdate('followup', 'tests', index, e.target.value)}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => removeArrayItem('followup', 'tests', index)}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Special Instructions
        </label>
        <textarea
          className="w-full p-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          rows={3}
          placeholder="Special instructions for follow-up care..."
          value={localData.followup?.instructions || ''}
          onChange={(e) => handleFieldUpdate('followup', 'instructions', e.target.value)}
        />
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'symptoms': return renderSymptoms();
      case 'examination': return renderExamination();
      case 'diagnosis': return renderDiagnosis();
      case 'treatment': return renderTreatment();
      case 'followup': return renderFollowUp();
      default: return renderSymptoms();
    }
  };

  return (
    <div className="h-full flex flex-col bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="FileText" size={20} className="text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Clinical Data</h3>
            <p className="text-xs text-muted-foreground">
              AI-extracted and structured consultation data
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isProcessing && (
            <div className="flex items-center space-x-2 text-primary">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Processing...</span>
            </div>
          )}
          <Button
            variant="default"
            size="sm"
            iconName="Wand2"
            iconPosition="left"
            onClick={onGenerateNote}
            disabled={!selectedTemplate || isProcessing}
          >
            Generate Note
          </Button>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex items-center space-x-1 p-4 border-b border-border bg-muted/30">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeSection === section.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Icon name={section.icon} size={16} />
            <span>{section.label}</span>
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderSection()}
      </div>
    </div>
  );
};

export default ClinicalDataPanel;