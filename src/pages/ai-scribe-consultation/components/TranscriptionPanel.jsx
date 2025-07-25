import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TranscriptionPanel = ({ 
  isRecording, 
  transcriptionData, 
  realTimeTranscription,
  onSegmentEdit 
}) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegments, setSelectedSegments] = useState(new Set());
  const transcriptRef = useRef(null);

  // Auto-scroll to bottom when new transcription arrives
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcriptionData, realTimeTranscription]);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-success';
    if (confidence >= 0.6) return 'text-warning';
    return 'text-destructive';
  };

  const getConfidenceIcon = (confidence) => {
    if (confidence >= 0.8) return 'CheckCircle';
    if (confidence >= 0.6) return 'AlertTriangle';
    return 'AlertCircle';
  };

  const filteredData = transcriptionData.filter(item => {
    const matchesFilter = filter === 'all' || item.speaker.toLowerCase() === filter.toLowerCase();
    const matchesSearch = !searchTerm || item.text.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSegmentSelect = (segmentId) => {
    const newSelected = new Set(selectedSegments);
    if (newSelected.has(segmentId)) {
      newSelected.delete(segmentId);
    } else {
      newSelected.add(segmentId);
    }
    setSelectedSegments(newSelected);
  };

  const handleBulkAction = (action) => {
    const selectedItems = transcriptionData.filter(item => selectedSegments.has(item.id));
    console.log(`Bulk action ${action} on:`, selectedItems);
    
    switch (action) {
      case 'delete':
        // Handle bulk delete
        break;
      case 'edit':
        // Handle bulk edit
        break;
      case 'flag':
        // Handle bulk flag for review
        break;
      default:
        break;
    }
    
    setSelectedSegments(new Set());
  };

  return (
    <div className="h-full flex flex-col bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground">
            Live Transcription
          </h3>
          <div className={`flex items-center space-x-2 ${
            isRecording ? 'text-success' : 'text-muted-foreground'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isRecording ? 'bg-success animate-pulse' : 'bg-muted-foreground'
            }`}></div>
            <span className="text-sm">{isRecording ? 'Recording' : 'Stopped'}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
            />
            <input
              type="text"
              placeholder="Search transcript..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filter */}
          <div className="flex space-x-2">
            {['all', 'doctor', 'patient'].map(filterOption => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-3 py-1 text-xs rounded-full capitalize transition-colors ${
                  filter === filterOption
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {filterOption}
              </button>
            ))}
          </div>

          {/* Bulk Actions */}
          {selectedSegments.size > 0 && (
            <div className="flex items-center space-x-2 p-2 bg-muted/50 rounded-lg">
              <span className="text-xs text-muted-foreground">
                {selectedSegments.size} selected
              </span>
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="xs"
                  iconName="Edit"
                  onClick={() => handleBulkAction('edit')}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  iconName="Flag"
                  onClick={() => handleBulkAction('flag')}
                >
                  Flag
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  iconName="Trash"
                  onClick={() => handleBulkAction('delete')}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transcript */}
      <div className="flex-1 overflow-hidden">
        <div 
          ref={transcriptRef}
          className="h-full overflow-y-auto p-4 space-y-3"
        >
          {filteredData.length === 0 && !realTimeTranscription ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Icon name="Mic" size={48} className="text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {isRecording ? 'Listening for speech...' : 'Start recording to see transcription'}
              </p>
            </div>
          ) : (
            <>
              {filteredData.map((item) => (
                <div
                  key={item.id}
                  className={`group relative p-3 rounded-lg border transition-colors ${
                    selectedSegments.has(item.id)
                      ? 'border-primary bg-primary/5' :'border-border hover:border-border/80 hover:bg-muted/30'
                  }`}
                >
                  {/* Selection checkbox */}
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <input
                      type="checkbox"
                      checked={selectedSegments.has(item.id)}
                      onChange={() => handleSegmentSelect(item.id)}
                      className="w-4 h-4 text-primary focus:ring-primary border-border rounded"
                    />
                  </div>

                  <div className="ml-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${
                          item.speaker === 'Doctor' ? 'text-primary' : 'text-secondary'
                        }`}>
                          {item.speaker}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.timestamp}
                        </span>
                      </div>
                      
                      {/* Confidence Score */}
                      <div className="flex items-center space-x-1">
                        <Icon 
                          name={getConfidenceIcon(item.confidence)} 
                          size={12} 
                          className={getConfidenceColor(item.confidence)} 
                        />
                        <span className={`text-xs font-medium ${getConfidenceColor(item.confidence)}`}>
                          {Math.round(item.confidence * 100)}%
                        </span>
                      </div>
                    </div>

                    {/* Text */}
                    <p className="text-sm text-foreground leading-relaxed">
                      {item.text}
                    </p>

                    {/* Low confidence warning */}
                    {item.confidence < 0.7 && (
                      <div className="mt-2 p-2 bg-warning/10 border border-warning/20 rounded flex items-center space-x-2">
                        <Icon name="AlertTriangle" size={14} className="text-warning" />
                        <span className="text-xs text-warning">
                          Low confidence - may need review
                        </span>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => onSegmentEdit?.(item.id)}
                        >
                          Edit
                        </Button>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="xs"
                          iconName="Edit"
                          onClick={() => onSegmentEdit?.(item.id)}
                        />
                        <Button
                          variant="ghost"
                          size="xs"
                          iconName="Copy"
                          onClick={() => navigator.clipboard.writeText(item.text)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Real-time transcription preview */}
              {realTimeTranscription && (
                <div className="p-3 rounded-lg border border-dashed border-primary/50 bg-primary/5">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-primary">Live</span>
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse animation-delay-100"></div>
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse animation-delay-200"></div>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 italic">
                    {realTimeTranscription}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{filteredData.length} segments</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>High confidence (80%+)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span>Medium confidence (60-79%)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-destructive rounded-full"></div>
              <span>Low confidence (&lt;60%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionPanel;