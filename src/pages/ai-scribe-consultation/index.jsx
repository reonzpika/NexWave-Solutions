import React, { useState, useEffect } from 'react';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import TranscriptionPanel from './components/TranscriptionPanel';
import ClinicalDataPanel from './components/ClinicalDataPanel';
import SessionControlPanel from './components/SessionControlPanel';
import SessionTabs from './components/SessionTabs';
import GeneratedNoteModal from './components/GeneratedNoteModal';
import RealTimeDashboard from '../../components/ui/RealTimeDashboard';
import openaiService from '../../services/openaiService';
import ablyService from '../../services/ablyService';
import deepgramService from '../../services/deepgramService';
import rbacService from '../../services/rbacService';

const AIScribeConsultation = () => {
  const [sessions, setSessions] = useState([
    {
      id: 1,
      patientName: 'John Smith',
      startTime: '10:30 AM',
      duration: '00:00',
      status: 'draft',
      hasUnsavedChanges: false
    }
  ]);
  const [activeSessionId, setActiveSessionId] = useState(1);
  const [sessionDuration, setSessionDuration] = useState(0);

  // Recording State with real integrations
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  // Transcription Data with confidence scores
  const [transcriptionData, setTranscriptionData] = useState([]);
  const [realTimeTranscription, setRealTimeTranscription] = useState('');

  // Clinical Data
  const [extractedData, setExtractedData] = useState({
    symptoms: {
      chief_complaint: '',
      history: '',
      duration: '',
      severity: '',
      associated: []
    },
    examination: {
      vitals: { bp: '', hr: '', temp: '', rr: '' },
      physical: '',
      findings: []
    },
    diagnosis: {
      primary: '',
      differential: [],
      reasoning: ''
    },
    treatment: {
      medications: [],
      interventions: [],
      education: ''
    }
  });

  // Template and Note Generation with OpenAI
  const [selectedTemplate, setSelectedTemplate] = useState('general');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGeneratedNote, setShowGeneratedNote] = useState(false);
  const [generatedNote, setGeneratedNote] = useState('');

  // Real-time Metrics
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    processingTime: '0.0',
    avgConfidence: '0',
    wordCount: '0',
    efficiencyGain: '0'
  });

  // RBAC Access Control - Modified to always allow access
  const [hasAIScribeAccess, setHasAIScribeAccess] = useState(true); // Always true now
  const [remainingUsage, setRemainingUsage] = useState(-1); // Always unlimited

  // Initialize services
  useEffect(() => {
    initializeServices();
    checkFeatureAccess();
    
    return () => {
      cleanupServices();
    };
  }, []);

  const initializeServices = async () => {
    try {
      // Initialize Ably for mobile sync
      await ablyService.initialize();
      ablyService.onConnectionChange(setConnectionStatus);
      
      // Subscribe to current session
      ablyService.subscribeToSession(activeSessionId, {
        onTranscription: handleRemoteTranscription,
        onAudioData: handleRemoteAudio,
        onSessionControl: handleRemoteSessionControl
      });

      // Initialize Deepgram for transcription
      await deepgramService.initializeRealTimeTranscription({
        interim_results: true,
        confidence: true,
        diarize: true
      });

      deepgramService.setCallback('onTranscription', handleTranscription);
      deepgramService.setCallback('onLowConfidence', handleLowConfidenceTranscription);
      
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Failed to initialize services:', error);
      setConnectionStatus('disconnected');
    }
  };

  const cleanupServices = () => {
    ablyService.disconnect();
    deepgramService.disconnect();
  };

  const checkFeatureAccess = () => {
    // MODIFIED: Always grant access and unlimited usage
    setHasAIScribeAccess(true);
    setRemainingUsage(-1); // Unlimited usage
  };

  // Session Timer
  useEffect(() => {
    let interval;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  // Real-time transcription handlers
  const handleTranscription = (transcriptionData) => {
    const newEntry = {
      id: Date.now(),
      speaker: transcriptionData.speaker || 'Unknown',
      text: transcriptionData.text,
      timestamp: new Date().toLocaleTimeString(),
      confidence: transcriptionData.confidence,
      is_final: transcriptionData.is_final
    };

    if (transcriptionData.is_final) {
      setTranscriptionData(prev => [...prev, newEntry]);
      
      // Sync with mobile devices
      ablyService.publishTranscription(activeSessionId, newEntry);
      
      // Update metrics
      setRealTimeMetrics(prev => ({
        ...prev,
        wordCount: (parseInt(prev.wordCount) + transcriptionData.text.split(' ').length).toString(),
        avgConfidence: Math.round((parseFloat(prev.avgConfidence) + transcriptionData.confidence * 100) / 2).toString()
      }));
    } else {
      setRealTimeTranscription(transcriptionData.text);
    }
  };

  const handleLowConfidenceTranscription = (transcriptionData) => {
    // Handle segments that need review
    console.log('Low confidence transcription:', transcriptionData);
    // You could flag these for manual review
  };

  const handleRemoteTranscription = (data) => {
    if (data.source === 'mobile') {
      // Handle transcription from mobile device
      setTranscriptionData(prev => [...prev, data.data]);
    }
  };

  const handleRemoteAudio = (data) => {
    if (data.source === 'mobile' && data.processingRequired) {
      // Send mobile audio to Deepgram for processing
      try {
        deepgramService.sendAudioData(data.audioData);
      } catch (error) {
        console.error('Error processing mobile audio:', error);
      }
    }
  };

  const handleRemoteSessionControl = (data) => {
    if (data.source === 'mobile') {
      switch (data.action) {
        case 'pause':
          handlePause();
          break;
        case 'resume':
          handleRecordingToggle();
          break;
        case 'stop':
          handleStop();
          break;
        default:
          console.log('Unknown session control action:', data.action);
      }
    }
  };

  const handleRecordingToggle = () => {
    if (!hasAIScribeAccess) return;

    if (isRecording) {
      setIsRecording(false);
      setIsPaused(false);
      setSessions(prev => prev.map(session => 
        session.id === activeSessionId 
          ? { ...session, status: 'completed', duration: formatDuration(sessionDuration) }
          : session
      ));
      
      // Stop Deepgram transcription
      deepgramService.disconnect();
      
      // Sync session state
      ablyService.syncSessionState(activeSessionId, { status: 'completed' });
    } else {
      // Check usage limits
      if (remainingUsage === 0) {
        alert('Daily usage limit reached. Please upgrade your plan.');
        return;
      }

      setIsRecording(true);
      setIsPaused(false);
      setSessions(prev => prev.map(session => 
        session.id === activeSessionId 
          ? { ...session, status: 'recording' }
          : session
      ));

      // Initialize Deepgram transcription
      deepgramService.initializeRealTimeTranscription();
      
      // Record usage
      rbacService.recordFeatureUsage('aiScribe');
      checkFeatureAccess();
      
      // Sync session state
      ablyService.syncSessionState(activeSessionId, { status: 'recording' });
    }
  };

  const handleSessionChange = (sessionId) => {
    if (sessions.find(session => session.id === sessionId)) {
      setActiveSessionId(sessionId);
      
      // Reset session-specific state when switching sessions
      setSessionDuration(0);
      setTranscriptionData([]);
      setRealTimeTranscription('');
      setExtractedData({
        symptoms: {
          chief_complaint: '',
          history: '',
          duration: '',
          severity: '',
          associated: []
        },
        examination: {
          vitals: { bp: '', hr: '', temp: '', rr: '' },
          physical: '',
          findings: []
        },
        diagnosis: {
          primary: '',
          differential: [],
          reasoning: ''
        },
        treatment: {
          medications: [],
          interventions: [],
          education: ''
        }
      });
      
      // Update Ably subscription for new session
      ablyService.subscribeToSession(sessionId, {
        onTranscription: handleRemoteTranscription,
        onAudioData: handleRemoteAudio,
        onSessionControl: handleRemoteSessionControl
      });
    }
  };

  const handleNewSession = () => {
    const newSessionId = Math.max(...sessions.map(s => s.id)) + 1;
    const newSession = {
      id: newSessionId,
      patientName: `Patient ${newSessionId}`,
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: '00:00',
      status: 'draft',
      hasUnsavedChanges: false
    };
    
    setSessions(prev => [...prev, newSession]);
    setActiveSessionId(newSessionId);
  };

  const handleCloseSession = (sessionId) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    
    // If closing active session, switch to first available session
    if (sessionId === activeSessionId) {
      const remainingSessions = sessions.filter(session => session.id !== sessionId);
      if (remainingSessions.length > 0) {
        setActiveSessionId(remainingSessions[0].id);
      }
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    
    // Sync pause state
    ablyService.syncSessionState(activeSessionId, { 
      status: isPaused ? 'recording' : 'paused' 
    });
  };

  const handleStop = () => {
    setIsRecording(false);
    setIsPaused(false);
    setSessions(prev => prev.map(session => 
      session.id === activeSessionId 
        ? { ...session, status: 'completed', duration: formatDuration(sessionDuration) }
        : session
    ));
    
    // Stop Deepgram transcription
    deepgramService.disconnect();
    
    // Sync session state
    ablyService.syncSessionState(activeSessionId, { status: 'completed' });
  };

  const handleDataUpdate = (field, value) => {
    setExtractedData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Mark session as having unsaved changes
    setSessions(prev => prev.map(session => 
      session.id === activeSessionId 
        ? { ...session, hasUnsavedChanges: true }
        : session
    ));
  };

  const handleSessionControl = (action) => {
    switch (action) {
      case 'record':
        handleRecordingToggle();
        break;
      case 'pause':
        handlePause();
        break;
      case 'stop':
        handleStop();
        break;
      default:
        console.log('Unknown session control action:', action);
    }
  };

  const handleGenerateNote = async () => {
    setIsProcessing(true);
    
    try {
      const startTime = Date.now();
      
      // Use OpenAI service for actual note generation
      const result = await openaiService.generateClinicalNote(
        transcriptionData,
        selectedTemplate,
        { patientName: sessions.find(s => s.id === activeSessionId)?.patientName }
      );
      
      const processingTime = ((Date.now() - startTime) / 1000).toFixed(1);
      
      setGeneratedNote(result.note);
      setExtractedData(result.extractedData);
      
      setRealTimeMetrics(prev => ({
        ...prev,
        processingTime,
        efficiencyGain: '65'
      }));
      
      setIsProcessing(false);
      setShowGeneratedNote(true);
      
      // Still record usage for analytics
      rbacService.recordFeatureUsage('aiScribe');
      checkFeatureAccess();
      
    } catch (error) {
      console.error('Error generating note:', error);
      setIsProcessing(false);
      alert('Failed to generate note. Please try again.');
    }
  };

  const handleSegmentEdit = (segmentIndex) => {
    // Handle editing of low confidence segments
    console.log('Edit segment:', segmentIndex);
  };

  const handleSaveNote = (note) => {
    console.log('Saving note:', note);
    setShowGeneratedNote(false);
    setSessions(prev => prev.map(session => 
      session.id === activeSessionId 
        ? { ...session, hasUnsavedChanges: false }
        : session
    ));
  };

  const handleExportNote = (note, format) => {
    console.log('Exporting note as:', format);
    // Implement export functionality
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar />
      
      <div className="ml-16 lg:ml-72 transition-all duration-300">
        <div className="flex flex-col h-screen">
          {/* Session Tabs */}
          <div className="flex-shrink-0 border-b border-border bg-card">
            <SessionTabs
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSessionChange={handleSessionChange}
              onNewSession={handleNewSession}
              onCloseSession={handleCloseSession}
            />
          </div>

          {/* Usage indicator - MODIFIED to show unlimited access */}
          <div className="flex-shrink-0 px-4 lg:px-6 py-3 bg-success/10 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
              <span className="text-success font-medium">
                AI Scribe Usage: Unlimited Access - All Features Available
              </span>
              <span className="text-muted-foreground">
                Current Tier: {rbacService.getCurrentUserTier().charAt(0).toUpperCase() + rbacService.getCurrentUserTier().slice(1)} (Full Access)
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full flex flex-col lg:flex-row">
              {/* Left Panel - Transcription */}
              <div className="lg:w-1/3 p-4 lg:p-6 space-y-4 border-b lg:border-b-0 lg:border-r border-border">
                <TranscriptionPanel
                  isRecording={isRecording}
                  transcriptionData={transcriptionData}
                  realTimeTranscription={realTimeTranscription}
                  onSegmentEdit={handleSegmentEdit}
                />
                
                {/* Real-time Dashboard */}
                <RealTimeDashboard
                  sessionId={activeSessionId}
                  isRecording={isRecording}
                  sessionDuration={sessionDuration}
                  onSessionControl={handleSessionControl}
                />
              </div>

              {/* Center Panel - Clinical Data */}
              <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
                <ClinicalDataPanel
                  extractedData={extractedData}
                  onDataUpdate={handleDataUpdate}
                  isProcessing={isProcessing}
                  selectedTemplate={selectedTemplate}
                  onGenerateNote={handleGenerateNote}
                />
              </div>

              {/* Right Panel - Session Control */}
              <div className="lg:w-80 p-4 lg:p-6 border-t lg:border-t-0 lg:border-l border-border bg-card/50">
                <SessionControlPanel
                  isRecording={isRecording}
                  onRecordingToggle={handleRecordingToggle}
                  onPause={handlePause}
                  onStop={handleStop}
                  sessionDuration={sessionDuration}
                  selectedTemplate={selectedTemplate}
                  onTemplateChange={setSelectedTemplate}
                  connectionStatus={connectionStatus}
                  realTimeMetrics={realTimeMetrics}
                  qrCodeUrl={ablyService.generateMobileSyncUrl(activeSessionId)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Note Modal */}
      <GeneratedNoteModal
        isOpen={showGeneratedNote}
        onClose={() => setShowGeneratedNote(false)}
        generatedNote={generatedNote}
        templateName={selectedTemplate}
        onSave={handleSaveNote}
        onExport={handleExportNote}
      />
    </div>
  );
};

export default AIScribeConsultation;