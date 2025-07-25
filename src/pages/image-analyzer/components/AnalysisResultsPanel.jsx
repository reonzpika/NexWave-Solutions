import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AnalysisResultsPanel = ({ 
  analysisResults, 
  isAnalyzing, 
  onGenerateReport, 
  onTransferToNotes 
}) => {
  const [activeTab, setActiveTab] = useState('analysis');
  const [reportGenerated, setReportGenerated] = useState(false);

  const mockAnalysisResults = {
    confidence: 87,
    primaryDiagnosis: {
      condition: "Seborrheic Dermatitis",
      confidence: 87,
      icd10: "L21.9",
      description: "Inflammatory skin condition characterized by scaly, flaky, itchy, and red skin"
    },
    morphology: {
      lesionType: "Papulosquamous",
      distribution: "Bilateral symmetric",
      configuration: "Confluent patches",
      color: "Erythematous with yellowish scales",
      size: "2-4 cm diameter",
      borders: "Well-demarcated"
    },
    differentialDiagnosis: [
      {
        condition: "Psoriasis",
        confidence: 72,
        reasoning: "Similar scaling pattern but typically thicker plaques"
      },
      {
        condition: "Atopic Dermatitis",
        confidence: 65,
        reasoning: "Erythematous appearance but different distribution pattern"
      },
      {
        condition: "Contact Dermatitis",
        confidence: 58,
        reasoning: "Inflammatory changes but lacks typical contact pattern"
      }
    ],
    recommendations: [
      "Consider topical antifungal therapy (ketoconazole 2% cream)",
      "Recommend gentle cleansing with non-soap cleanser",
      "Advise patient to avoid harsh scrubbing",
      "Follow-up in 2-3 weeks to assess treatment response",
      "Consider dermatology referral if no improvement"
    ],
    riskFactors: [
      "Oily skin type",
      "Stress",
      "Weather changes",
      "Hormonal fluctuations"
    ]
  };

  const results = analysisResults || mockAnalysisResults;

  const handleGenerateReport = () => {
    setReportGenerated(true);
    onGenerateReport?.(results);
  };

  const handleTransferToNotes = () => {
    onTransferToNotes?.(results);
  };

  const tabs = [
    { id: 'analysis', label: 'Analysis', icon: 'Search' },
    { id: 'morphology', label: 'Morphology', icon: 'Microscope' },
    { id: 'differential', label: 'Differential', icon: 'List' },
    { id: 'recommendations', label: 'Recommendations', icon: 'Lightbulb' }
  ];

  if (isAnalyzing) {
    return (
      <div className="h-full bg-card rounded-lg border border-border flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Analyzing Image
            </h3>
            <p className="text-sm text-muted-foreground">
              AI is processing the clinical image and generating analysis...
            </p>
          </div>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span>Extracting visual features</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse animation-delay-200"></div>
              <span>Comparing with medical database</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse animation-delay-400"></div>
              <span>Generating clinical insights</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-card rounded-lg border border-border overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                <Icon name="Brain" size={20} className="text-success" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">AI Analysis Results</h2>
                <p className="text-sm text-muted-foreground">
                  Confidence: {results.confidence}% • Generated at {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              results.confidence >= 80 ? 'bg-success/10 text-success' :
              results.confidence >= 60 ? 'bg-warning/10 text-warning': 'bg-destructive/10 text-destructive'
            }`}>
              {results.confidence >= 80 ? 'High Confidence' :
               results.confidence >= 60 ? 'Moderate Confidence': 'Low Confidence'}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon name={tab.icon} size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'analysis' && (
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Target" size={16} className="text-primary" />
                  <span className="font-medium text-foreground">Primary Diagnosis</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {results.primaryDiagnosis.condition}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  ICD-10: {results.primaryDiagnosis.icd10} • {results.primaryDiagnosis.confidence}% confidence
                </p>
                <p className="text-sm text-foreground">
                  {results.primaryDiagnosis.description}
                </p>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <Icon name="AlertTriangle" size={16} className="text-warning" />
                  <span className="font-medium text-foreground">Risk Factors</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {results.riskFactors.map((factor, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <span className="text-sm text-foreground">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'morphology' && (
            <div className="space-y-4">
              {Object.entries(results.morphology).map(([key, value]) => (
                <div key={key} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="text-sm text-foreground text-right flex-1 ml-4">
                      {value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'differential' && (
            <div className="space-y-3">
              {results.differentialDiagnosis.map((diagnosis, index) => (
                <div key={index} className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{diagnosis.condition}</span>
                    <span className="text-sm text-muted-foreground">{diagnosis.confidence}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${diagnosis.confidence}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-muted-foreground">{diagnosis.reasoning}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-3">
              {results.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-accent">{index + 1}</span>
                  </div>
                  <p className="text-sm text-foreground">{recommendation}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-border bg-muted/20">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="default"
              onClick={handleGenerateReport}
              iconName="FileText"
              iconPosition="left"
              className="flex-1"
              disabled={reportGenerated}
            >
              {reportGenerated ? 'Report Generated' : 'Generate Report'}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleTransferToNotes}
              iconName="ArrowRight"
              iconPosition="left"
              className="flex-1"
            >
              Transfer to Notes
            </Button>
          </div>
          
          <div className="mt-3 flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Shield" size={12} />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={12} />
              <span>Analysis time: 2.3s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResultsPanel;