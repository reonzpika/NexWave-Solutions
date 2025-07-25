/**
 * Deepgram Nova 3 transcription service
 */
class DeepgramService {
  constructor() {
    this.apiKey = import.meta.env.VITE_DEEPGRAM_API_KEY;
    this.baseUrl = 'https://api.deepgram.com/v1/listen';
    this.websocket = null;
    this.callbacks = new Map();
  }

  /**
   * Initialize WebSocket connection for real-time transcription
   */
  async initializeRealTimeTranscription(options = {}) {
    const wsUrl = new URL('wss://api.deepgram.com/v1/listen');
    
    // Set Deepgram Nova 3 model and options
    const params = new URLSearchParams({
      model: 'nova-2-medical',
      language: 'en',
      punctuate: true,
      diarize: true,
      smart_format: true,
      interim_results: true,
      confidence: true,
      utterances: true,
      ...options
    });

    wsUrl.search = params.toString();

    try {
      this.websocket = new WebSocket(wsUrl.toString(), ['token', this.apiKey]);

      this.websocket.onopen = () => {
        console.log('Deepgram WebSocket connected');
        this.notifyCallback('onOpen', { status: 'connected' });
      };

      this.websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleTranscriptionResult(data);
        } catch (error) {
          console.error('Error parsing Deepgram response:', error);
        }
      };

      this.websocket.onerror = (error) => {
        console.error('Deepgram WebSocket error:', error);
        this.notifyCallback('onError', error);
      };

      this.websocket.onclose = () => {
        console.log('Deepgram WebSocket closed');
        this.notifyCallback('onClose', { status: 'disconnected' });
      };

      return this.websocket;
    } catch (error) {
      console.error('Failed to initialize Deepgram WebSocket:', error);
      throw error;
    }
  }

  /**
   * Send audio data for real-time transcription
   */
  sendAudioData(audioBuffer) {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
      throw new Error('Deepgram WebSocket not connected');
    }

    try {
      this.websocket.send(audioBuffer);
    } catch (error) {
      console.error('Error sending audio data to Deepgram:', error);
      throw error;
    }
  }

  /**
   * Handle transcription results from Deepgram
   */
  handleTranscriptionResult(data) {
    if (data.channel?.alternatives?.[0]) {
      const alternative = data.channel.alternatives[0];
      const confidence = alternative.confidence || 0;
      
      const transcriptionData = {
        id: Date.now(),
        text: alternative.transcript,
        confidence: confidence,
        timestamp: new Date().toISOString(),
        speaker: this.determineSpeaker(data.channel),
        is_final: data.is_final || false,
        start: data.start || 0,
        duration: data.duration || 0,
        words: alternative.words || []
      };

      // Only process if confidence is above threshold
      if (confidence > 0.5 || data.is_final) {
        this.notifyCallback('onTranscription', transcriptionData);
      }

      // Handle low confidence segments separately
      if (confidence < 0.7) {
        this.notifyCallback('onLowConfidence', {
          ...transcriptionData,
          needsReview: true
        });
      }
    }

    // Handle speaker diarization
    if (data.channel?.alternatives?.[0]?.words) {
      const speakerChanges = this.detectSpeakerChanges(data.channel.alternatives[0].words);
      if (speakerChanges.length > 0) {
        this.notifyCallback('onSpeakerChange', speakerChanges);
      }
    }
  }

  /**
   * Determine speaker from diarization data
   */
  determineSpeaker(channel) {
    // Simple speaker detection - in production, you'd have more sophisticated logic
    const words = channel.alternatives?.[0]?.words || [];
    const lastWord = words[words.length - 1];
    
    if (lastWord?.speaker !== undefined) {
      return lastWord.speaker === 0 ? 'Doctor' : 'Patient';
    }
    
    return 'Unknown';
  }

  /**
   * Detect speaker changes in the transcript
   */
  detectSpeakerChanges(words) {
    const changes = [];
    let currentSpeaker = null;
    
    words.forEach((word, index) => {
      if (word.speaker !== currentSpeaker) {
        changes.push({
          speaker: word.speaker === 0 ? 'Doctor' : 'Patient',
          timestamp: word.start,
          wordIndex: index
        });
        currentSpeaker = word.speaker;
      }
    });
    
    return changes;
  }

  /**
   * Upload audio file for batch transcription
   */
  async transcribeAudioFile(audioFile, options = {}) {
    const formData = new FormData();
    formData.append('audio', audioFile);

    const params = new URLSearchParams({
      model: 'nova-2-medical',
      language: 'en',
      punctuate: true,
      diarize: true,
      smart_format: true,
      confidence: true,
      utterances: true,
      ...options
    });

    try {
      const response = await fetch(`${this.baseUrl}?${params}`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.apiKey}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Deepgram API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return this.processTranscriptionResult(result);
    } catch (error) {
      console.error('Error with Deepgram batch transcription:', error);
      throw error;
    }
  }

  /**
   * Process batch transcription result
   */
  processTranscriptionResult(result) {
    const channel = result.results?.channels?.[0];
    if (!channel?.alternatives?.[0]) {
      return { transcript: '', confidence: 0, words: [] };
    }

    const alternative = channel.alternatives[0];
    const words = alternative.words || [];
    
    // Group words by speaker for diarization
    const segments = [];
    let currentSegment = null;
    
    words.forEach(word => {
      const speaker = word.speaker === 0 ? 'Doctor' : 'Patient';
      
      if (!currentSegment || currentSegment.speaker !== speaker) {
        if (currentSegment) {
          segments.push(currentSegment);
        }
        
        currentSegment = {
          speaker,
          text: word.word,
          start: word.start,
          confidence: word.confidence,
          words: [word]
        };
      } else {
        currentSegment.text += ' ' + word.word;
        currentSegment.words.push(word);
        currentSegment.confidence = (currentSegment.confidence + word.confidence) / 2;
      }
    });
    
    if (currentSegment) {
      segments.push(currentSegment);
    }

    return {
      transcript: alternative.transcript,
      confidence: alternative.confidence,
      segments,
      words,
      metadata: {
        duration: result.metadata?.duration || 0,
        channels: result.metadata?.channels || 1,
        created: result.metadata?.created || new Date().toISOString()
      }
    };
  }

  /**
   * Set callback for specific events
   */
  setCallback(event, callback) {
    this.callbacks.set(event, callback);
  }

  /**
   * Remove callback for specific events
   */
  removeCallback(event) {
    this.callbacks.delete(event);
  }

  /**
   * Notify callback for specific event
   */
  notifyCallback(event, data) {
    const callback = this.callbacks.get(event);
    if (callback && typeof callback === 'function') {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in ${event} callback:`, error);
      }
    }
  }

  /**
   * Close WebSocket connection
   */
  disconnect() {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
    this.callbacks.clear();
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    if (!this.websocket) return 'disconnected';
    
    switch (this.websocket.readyState) {
      case WebSocket.CONNECTING: return 'connecting';
      case WebSocket.OPEN: return 'connected';
      case WebSocket.CLOSING: return 'disconnecting';
      case WebSocket.CLOSED: return 'disconnected';
      default: return 'unknown';
    }
  }
}

export default new DeepgramService();