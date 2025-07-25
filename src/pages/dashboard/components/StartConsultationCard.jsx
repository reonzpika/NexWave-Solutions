import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StartConsultationCard = () => {
  const [showQRCode, setShowQRCode] = useState(false);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const navigate = useNavigate();

  const handleStartConsultation = () => {
    navigate('/ai-scribe-consultation');
  };

  const handleGenerateQR = async () => {
    if (showQRCode) {
      setShowQRCode(false);
      return;
    }

    setIsGeneratingQR(true);
    // Simulate QR generation delay
    setTimeout(() => {
      setShowQRCode(true);
      setIsGeneratingQR(false);
    }, 1000);
  };

  // Mock QR code URL for mobile connection
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('https://clinicpro.nz/mobile/session/abc123')}`;

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 shadow-clinical hover:shadow-clinical-lg transition-all duration-200">
      <div className="text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-200">
          <Icon name="Plus" size={24} className="sm:w-8 sm:h-8 text-primary" />
        </div>
        
        <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
          Start New Consultation
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 px-2">
          Begin AI-powered consultation recording with real-time transcription and clinical assistance
        </p>

        <div className="space-y-3">
          <Button 
            variant="default" 
            size="lg" 
            fullWidth 
            onClick={handleStartConsultation}
            iconName="Mic"
            iconPosition="left"
            className="text-sm sm:text-base font-medium"
          >
            Start Consultation
          </Button>

          <Button 
            variant="outline" 
            size="default" 
            fullWidth 
            onClick={handleGenerateQR}
            iconName={isGeneratingQR ? null : "QrCode"}
            iconPosition="left"
            loading={isGeneratingQR}
            className="text-sm"
          >
            {showQRCode ? 'Hide QR Code' : 'Generate QR Code'}
          </Button>
        </div>

        {showQRCode && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border animate-in fade-in duration-300">
            <div className="flex flex-col items-center">
              <div className="relative">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code for mobile connection" 
                  className="w-32 h-32 rounded-lg border border-border shadow-sm"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-32 h-32 rounded-lg border border-border bg-muted flex items-center justify-center hidden">
                  <Icon name="QrCode" size={32} className="text-muted-foreground" />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground text-center mt-3 px-2">
                Scan with mobile device to connect for audio recording
              </p>
              <div className="mt-2 px-3 py-1 bg-background rounded-md border border-border">
                <p className="text-xs font-mono text-foreground">
                  Session ID: ABC123
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center">
              <Icon name="Shield" size={14} className="mr-1 text-success flex-shrink-0" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center">
              <Icon name="Lock" size={14} className="mr-1 text-success flex-shrink-0" />
              <span>End-to-End Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartConsultationCard;