import Ably from 'ably';

/**
 * Ably service for real-time mobile-desktop sync
 */
class AblyService {
  constructor() {
    this.client = null;
    this.channels = new Map();
    this.connectionCallbacks = new Set();
  }

  /**
   * Initialize Ably connection
   */
  async initialize() {
    try {
      this.client = new Ably.Realtime({
        key: import.meta.env.VITE_ABLY_API_KEY,
        clientId: `clinicpro-${Date.now()}`,
        autoConnect: true
      });

      this.client.connection.on('connected', () => {
        console.log('Ably connected');
        this.notifyConnectionCallbacks('connected');
      });

      this.client.connection.on('disconnected', () => {
        console.log('Ably disconnected');
        this.notifyConnectionCallbacks('disconnected');
      });

      this.client.connection.on('failed', (error) => {
        console.error('Ably connection failed:', error);
        this.notifyConnectionCallbacks('failed');
      });

      return this.client;
    } catch (error) {
      console.error('Failed to initialize Ably:', error);
      throw error;
    }
  }

  /**
   * Subscribe to session sync channel
   */
  subscribeToSession(sessionId, callbacks = {}) {
    if (!this.client) {
      throw new Error('Ably client not initialized');
    }

    const channelName = `session:${sessionId}`;
    const channel = this.client.channels.get(channelName);
    
    this.channels.set(channelName, channel);

    // Subscribe to different event types
    if (callbacks.onTranscription) {
      channel.subscribe('transcription', callbacks.onTranscription);
    }

    if (callbacks.onAudioData) {
      channel.subscribe('audio-data', callbacks.onAudioData);
    }

    if (callbacks.onSessionControl) {
      channel.subscribe('session-control', callbacks.onSessionControl);
    }

    if (callbacks.onImageUpload) {
      channel.subscribe('image-upload', callbacks.onImageUpload);
    }

    if (callbacks.onSyncStatus) {
      channel.subscribe('sync-status', callbacks.onSyncStatus);
    }

    return channel;
  }

  /**
   * Publish transcription data to mobile devices
   */
  async publishTranscription(sessionId, transcriptionData) {
    const channelName = `session:${sessionId}`;
    const channel = this.channels.get(channelName);
    
    if (!channel) {
      throw new Error(`Channel for session ${sessionId} not found`);
    }

    try {
      await channel.publish('transcription', {
        timestamp: new Date().toISOString(),
        data: transcriptionData,
        source: 'desktop'
      });
    } catch (error) {
      console.error('Failed to publish transcription:', error);
      throw error;
    }
  }

  /**
   * Publish session control events
   */
  async publishSessionControl(sessionId, action, data = {}) {
    const channelName = `session:${sessionId}`;
    const channel = this.channels.get(channelName);
    
    if (!channel) {
      throw new Error(`Channel for session ${sessionId} not found`);
    }

    try {
      await channel.publish('session-control', {
        action,
        timestamp: new Date().toISOString(),
        data,
        source: 'desktop'
      });
    } catch (error) {
      console.error('Failed to publish session control:', error);
      throw error;
    }
  }

  /**
   * Generate QR code data for mobile sync
   */
  generateMobileSyncUrl(sessionId) {
    const baseUrl = window.location.origin;
    const syncData = {
      sessionId,
      timestamp: Date.now(),
      version: '1.0'
    };
    
    const encodedData = btoa(JSON.stringify(syncData));
    return `${baseUrl}/mobile-sync/${encodedData}`;
  }

  /**
   * Handle mobile audio data
   */
  async handleMobileAudioData(sessionId, audioData) {
    const channelName = `session:${sessionId}`;
    const channel = this.channels.get(channelName);
    
    if (!channel) {
      throw new Error(`Channel for session ${sessionId} not found`);
    }

    try {
      // Process audio data and forward to transcription service
      const processedData = {
        audioData,
        timestamp: new Date().toISOString(),
        source: 'mobile',
        processingRequired: true
      };

      await channel.publish('audio-data', processedData);
      return processedData;
    } catch (error) {
      console.error('Failed to handle mobile audio data:', error);
      throw error;
    }
  }

  /**
   * Sync session state with mobile devices
   */
  async syncSessionState(sessionId, sessionState) {
    const channelName = `session:${sessionId}`;
    const channel = this.channels.get(channelName);
    
    if (!channel) {
      throw new Error(`Channel for session ${sessionId} not found`);
    }

    try {
      await channel.publish('sync-status', {
        sessionState,
        timestamp: new Date().toISOString(),
        source: 'desktop'
      });
    } catch (error) {
      console.error('Failed to sync session state:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe from session channel
   */
  unsubscribeFromSession(sessionId) {
    const channelName = `session:${sessionId}`;
    const channel = this.channels.get(channelName);
    
    if (channel) {
      channel.unsubscribe();
      this.channels.delete(channelName);
    }
  }

  /**
   * Add connection status callback
   */
  onConnectionChange(callback) {
    this.connectionCallbacks.add(callback);
    
    // Return current status if available
    if (this.client?.connection?.state) {
      callback(this.client.connection.state);
    }
  }

  /**
   * Remove connection status callback
   */
  offConnectionChange(callback) {
    this.connectionCallbacks.delete(callback);
  }

  /**
   * Notify all connection callbacks
   */
  notifyConnectionCallbacks(status) {
    this.connectionCallbacks.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error('Connection callback error:', error);
      }
    });
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return this.client?.connection?.state || 'disconnected';
  }

  /**
   * Close connection and cleanup
   */
  async disconnect() {
    if (this.client) {
      this.channels.forEach(channel => channel.unsubscribe());
      this.channels.clear();
      this.connectionCallbacks.clear();
      
      await this.client.close();
      this.client = null;
    }
  }
}

export default new AblyService();