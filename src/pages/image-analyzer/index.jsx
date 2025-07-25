import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ImageUploadArea from './components/ImageUploadArea';
import ImageViewer from './components/ImageViewer';
import PatientContextPanel from './components/PatientContextPanel';
import AnalysisResultsPanel from './components/AnalysisResultsPanel';
import AnnotationToolbar from './components/AnnotationToolbar';

const ImageAnalyzer = () => {
  const navigate = useNavigate();
  const [userTier, setUserTier] = useState('basic');
  const [currentImage, setCurrentImage] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [selectedAnnotationTool, setSelectedAnnotationTool] = useState('point');
  const [activeSession, setActiveSession] = useState(null);

  useEffect(() => {
    // Get user tier from localStorage or API
    const tier = localStorage.getItem('userTier') || 'basic';
    setUserTier(tier);

    // Mock active session
    setActiveSession({
      id: 'session-001',
      patientName: 'Sarah Mitchell',
      startTime: new Date(),
      type: 'Dermatological Assessment'
    });
  }, []);

  const handleImageUpload = async (file) => {
    setIsUploading(true);
    
    try {
      // Simulate file upload and processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create object URL for display
      const imageUrl = URL.createObjectURL(file);
      setCurrentImage({
        url: imageUrl,
        file: file,
        metadata: {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: new Date(file.lastModified),
          dimensions: { width: 2048, height: 1536 } // Mock dimensions
        }
      });
      
      // Auto-start analysis after upload
      setTimeout(() => {
        handleStartAnalysis();
      }, 500);
      
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartAnalysis = async () => {
    if (!currentImage) return;
    
    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock analysis results
      const mockResults = {
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
          }
        ],
        recommendations: [
          "Consider topical antifungal therapy (ketoconazole 2% cream)",
          "Recommend gentle cleansing with non-soap cleanser",
          "Follow-up in 2-3 weeks to assess treatment response"
        ],
        riskFactors: ["Oily skin type", "Stress", "Weather changes"]
      };
      
      setAnalysisResults(mockResults);
      
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnnotationAdd = (annotation) => {
    setAnnotations(prev => [...prev, annotation]);
  };

  const handleAnnotationUpdate = (id, updates) => {
    setAnnotations(prev => 
      prev.map(annotation => 
        annotation.id === id ? { ...annotation, ...updates } : annotation
      )
    );
  };

  const handleAnnotationDelete = (id) => {
    setAnnotations(prev => prev.filter(annotation => annotation.id !== id));
  };

  const handleClearAnnotations = () => {
    setAnnotations([]);
  };

  const handleExportAnnotations = () => {
    const exportData = {
      image: currentImage?.metadata,
      annotations: annotations,
      analysis: analysisResults,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `image-analysis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGenerateReport = (results) => {
    console.log('Generating clinical report:', results);
    // Implementation for report generation
  };

  const handleTransferToNotes = (results) => {
    console.log('Transferring to consultation notes:', results);
    navigate('/ai-scribe-consultation', { 
      state: { 
        imageAnalysis: results,
        imageUrl: currentImage?.url 
      }
    });
  };

  const handleUpgrade = () => {
    navigate('/upgrade');
  };

  const handleNewAnalysis = () => {
    setCurrentImage(null);
    setAnnotations([]);
    setAnalysisResults(null);
    setIsAnnotating(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar />
      
      <div className="ml-16 lg:ml-72 transition-all duration-300">
        <div className="h-screen flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0 p-4 sm:p-6 border-b border-border bg-card">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="Camera" size={18} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">Image Analyzer</h1>
                  <p className="text-muted-foreground text-sm truncate">
                    AI-powered dermatological assessment and clinical documentation
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 flex-shrink-0">
                {activeSession && (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-success/10 rounded-lg">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse flex-shrink-0" />
                    <span className="text-sm text-success font-medium truncate">
                      {activeSession.patientName}
                    </span>
                  </div>
                )}
                
                {currentImage && (
                  <Button
                    variant="outline"
                    onClick={handleNewAnalysis}
                    iconName="Plus"
                    iconPosition="left"
                    size="sm"
                  >
                    <span className="hidden sm:inline">New Analysis</span>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            {!currentImage ? (
              /* Upload State */
              <div className="h-full p-4 sm:p-6">
                <div className="h-full grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
                  <div className="lg:col-span-3">
                    <ImageUploadArea
                      onImageUpload={handleImageUpload}
                      isUploading={isUploading}
                    />
                  </div>
                  
                  <div className="space-y-4 lg:space-y-6">
                    <PatientContextPanel />
                    
                    <div className="bg-card rounded-lg border border-border p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Icon name="Lightbulb" size={16} className="text-warning flex-shrink-0" />
                        <span className="font-medium text-foreground">Quick Tips</span>
                      </div>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start space-x-2">
                          <Icon name="Check" size={14} className="text-success mt-0.5 flex-shrink-0" />
                          <span>Ensure good lighting and focus</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Icon name="Check" size={14} className="text-success mt-0.5 flex-shrink-0" />
                          <span>Include reference objects for scale</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Icon name="Check" size={14} className="text-success mt-0.5 flex-shrink-0" />
                          <span>Capture multiple angles if needed</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Analysis State */
              <div className="h-full p-4 sm:p-6">
                <div className="h-full grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
                  {/* Patient Context */}
                  <div className="xl:col-span-3 space-y-4 lg:space-y-6">
                    <PatientContextPanel />
                    <AnnotationToolbar
                      selectedTool={selectedAnnotationTool}
                      onToolSelect={setSelectedAnnotationTool}
                      annotations={annotations}
                      onClearAnnotations={handleClearAnnotations}
                      onExportAnnotations={handleExportAnnotations}
                      isAnnotating={isAnnotating}
                      onToggleAnnotating={setIsAnnotating}
                    />
                  </div>
                  
                  {/* Image Viewer */}
                  <div className="xl:col-span-6">
                    <ImageViewer
                      imageUrl={currentImage.url}
                      annotations={annotations}
                      onAnnotationAdd={handleAnnotationAdd}
                      onAnnotationUpdate={handleAnnotationUpdate}
                      onAnnotationDelete={handleAnnotationDelete}
                      isAnnotating={isAnnotating}
                      annotationTool={selectedAnnotationTool}
                    />
                  </div>
                  
                  {/* Analysis Results */}
                  <div className="xl:col-span-3">
                    <AnalysisResultsPanel
                      analysisResults={analysisResults}
                      isAnalyzing={isAnalyzing}
                      onGenerateReport={handleGenerateReport}
                      onTransferToNotes={handleTransferToNotes}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageAnalyzer;