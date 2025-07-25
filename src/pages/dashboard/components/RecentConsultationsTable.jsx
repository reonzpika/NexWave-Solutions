import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentConsultationsTable = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const recentConsultations = [
    {
      id: 'CS001',
      patientName: 'Sarah Johnson',
      patientInitials: 'SJ',
      date: '25/07/2025',
      time: '09:30 AM',
      duration: '12 min',
      status: 'completed',
      notesGenerated: true,
      sessionType: 'General Consultation'
    },
    {
      id: 'CS002',
      patientName: 'Michael Chen',
      patientInitials: 'MC',
      date: '25/07/2025',
      time: '10:15 AM',
      duration: '8 min',
      status: 'completed',
      notesGenerated: true,
      sessionType: 'Follow-up'
    },
    {
      id: 'CS003',
      patientName: 'Emma Wilson',
      patientInitials: 'EW',
      date: '25/07/2025',
      time: '11:00 AM',
      duration: '15 min',
      status: 'in-progress',
      notesGenerated: false,
      sessionType: 'General Consultation'
    },
    {
      id: 'CS004',
      patientName: 'David Thompson',
      patientInitials: 'DT',
      date: '24/07/2025',
      time: '04:45 PM',
      duration: '10 min',
      status: 'completed',
      notesGenerated: true,
      sessionType: 'Skin Assessment'
    },
    {
      id: 'CS005',
      patientName: 'Lisa Anderson',
      patientInitials: 'LA',
      date: '24/07/2025',
      time: '03:30 PM',
      duration: '18 min',
      status: 'paused',
      notesGenerated: false,
      sessionType: 'General Consultation'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { 
        color: 'text-success bg-success/10 border-success/20', 
        icon: 'CheckCircle', 
        label: 'Completed' 
      },
      'in-progress': { 
        color: 'text-primary bg-primary/10 border-primary/20', 
        icon: 'Clock', 
        label: 'In Progress' 
      },
      paused: { 
        color: 'text-warning bg-warning/10 border-warning/20', 
        icon: 'Pause', 
        label: 'Paused' 
      }
    };

    const config = statusConfig[status];
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon name={config.icon} size={12} className="mr-1 flex-shrink-0" />
        <span className="truncate">{config.label}</span>
      </div>
    );
  };

  const handleViewSession = (sessionId) => {
    navigate(`/session-management?session=${sessionId}`);
  };

  const handleContinueSession = (sessionId) => {
    navigate(`/ai-scribe-consultation?continue=${sessionId}`);
  };

  const handleDownloadNotes = (sessionId) => {
    // Simulate download
    console.log(`Downloading notes for session: ${sessionId}`);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-clinical overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Recent Consultations</h3>
            <p className="text-sm text-muted-foreground">Latest consultation sessions and their status</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/session-management')}
            iconName="ArrowRight"
            iconPosition="right"
            className="self-start sm:self-auto"
          >
            View All
          </Button>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden">
        {recentConsultations.map((consultation, index) => (
          <div key={consultation.id} className={`p-4 border-b border-border ${
            index === recentConsultations.length - 1 ? 'border-b-0' : ''
          }`}>
            <div className="space-y-3">
              {/* Patient Info */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-primary">
                    {consultation.patientInitials}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {consultation.patientName}
                  </p>
                  <p className="text-xs text-muted-foreground">ID: {consultation.id}</p>
                </div>
                {getStatusBadge(consultation.status)}
              </div>
              
              {/* Details */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Date & Time:</span>
                  <p className="text-foreground font-medium">{consultation.date} at {consultation.time}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration:</span>
                  <p className="text-foreground font-medium">{consultation.duration}</p>
                </div>
              </div>
              
              <div className="text-xs">
                <span className="text-muted-foreground">Type:</span>
                <p className="text-foreground font-medium">{consultation.sessionType}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-2 pt-2">
                {consultation.status === 'in-progress' || consultation.status === 'paused' ? (
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleContinueSession(consultation.id)}
                    iconName="Play"
                    iconPosition="left"
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleViewSession(consultation.id)}
                    iconName="Eye"
                    iconPosition="left"
                  >
                    View
                  </Button>
                )}
                {consultation.notesGenerated && (
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleDownloadNotes(consultation.id)}
                    iconName="Download"
                    className="p-2"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Patient</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date & Time</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Duration</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentConsultations.map((consultation, index) => (
              <tr key={consultation.id} className={`border-b border-border hover:bg-muted/30 transition-colors ${
                index === recentConsultations.length - 1 ? 'border-b-0' : ''
              }`}>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-primary">
                        {consultation.patientInitials}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {consultation.patientName}
                      </p>
                      <p className="text-xs text-muted-foreground">ID: {consultation.id}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <p className="text-sm text-foreground">{consultation.date}</p>
                    <p className="text-xs text-muted-foreground">{consultation.time}</p>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-foreground">{consultation.duration}</span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-foreground truncate" title={consultation.sessionType}>
                    {consultation.sessionType}
                  </span>
                </td>
                <td className="p-4">
                  {getStatusBadge(consultation.status)}
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    {consultation.status === 'in-progress' || consultation.status === 'paused' ? (
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleContinueSession(consultation.id)}
                        iconName="Play"
                        iconPosition="left"
                      >
                        Continue
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleViewSession(consultation.id)}
                        iconName="Eye"
                        iconPosition="left"
                      >
                        View
                      </Button>
                    )}
                    {consultation.notesGenerated && (
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleDownloadNotes(consultation.id)}
                        iconName="Download"
                        className="p-2"
                        title="Download notes"
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {recentConsultations.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h4 className="text-lg font-medium text-foreground mb-2">No Recent Consultations</h4>
          <p className="text-muted-foreground mb-4 px-4">
            Start your first consultation to see session history here
          </p>
          <Button 
            variant="outline"
            onClick={() => navigate('/ai-scribe-consultation')}
            iconName="Plus"
            iconPosition="left"
          >
            Start First Consultation
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecentConsultationsTable;