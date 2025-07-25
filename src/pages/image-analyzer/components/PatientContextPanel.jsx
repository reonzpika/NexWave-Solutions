import React from 'react';
import Icon from '../../../components/AppIcon';

const PatientContextPanel = ({ patientData, medicalHistory, currentMedications, previousAssessments }) => {
  const mockPatientData = {
    name: "Sarah Mitchell",
    age: 34,
    gender: "Female",
    mrn: "MRN-2024-7891",
    lastVisit: "15/07/2025",
    allergies: ["Penicillin", "Latex"],
    skinType: "Type II (Fair)"
  };

  const mockMedicalHistory = [
    {
      id: 1,
      condition: "Atopic Dermatitis",
      diagnosed: "12/03/2023",
      status: "Active",
      severity: "Moderate"
    },
    {
      id: 2,
      condition: "Seasonal Allergies",
      diagnosed: "08/11/2022",
      status: "Controlled",
      severity: "Mild"
    },
    {
      id: 3,
      condition: "Contact Dermatitis",
      diagnosed: "22/05/2021",
      status: "Resolved",
      severity: "Mild"
    }
  ];

  const mockCurrentMedications = [
    {
      id: 1,
      name: "Hydrocortisone 1% cream",
      dosage: "Apply twice daily",
      prescribedDate: "10/07/2025",
      indication: "Atopic dermatitis"
    },
    {
      id: 2,
      name: "Cetirizine 10mg",
      dosage: "Once daily",
      prescribedDate: "05/06/2025",
      indication: "Allergic rhinitis"
    },
    {
      id: 3,
      name: "Moisturizing cream",
      dosage: "As needed",
      prescribedDate: "15/05/2025",
      indication: "Dry skin maintenance"
    }
  ];

  const mockPreviousAssessments = [
    {
      id: 1,
      date: "15/07/2025",
      type: "Dermatological Review",
      findings: "Mild eczematous changes on bilateral antecubital fossae",
      provider: "Dr. James Wilson",
      images: 2
    },
    {
      id: 2,
      date: "03/06/2025",
      type: "Skin Lesion Check",
      findings: "Multiple benign seborrheic keratoses noted",
      provider: "Dr. Sarah Chen",
      images: 4
    },
    {
      id: 3,
      date: "18/04/2025",
      type: "Allergy Assessment",
      findings: "Positive patch test for nickel sensitivity",
      provider: "Dr. Michael Brown",
      images: 1
    }
  ];

  const currentPatient = patientData || mockPatientData;
  const history = medicalHistory || mockMedicalHistory;
  const medications = currentMedications || mockCurrentMedications;
  const assessments = previousAssessments || mockPreviousAssessments;

  return (
    <div className="h-full bg-card rounded-lg border border-border overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="User" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{currentPatient.name}</h2>
              <p className="text-sm text-muted-foreground">
                {currentPatient.age} years • {currentPatient.gender} • {currentPatient.mrn}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Patient Details */}
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
              <Icon name="FileText" size={16} className="mr-2" />
              Patient Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Visit:</span>
                <span className="text-foreground">{currentPatient.lastVisit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Skin Type:</span>
                <span className="text-foreground">{currentPatient.skinType}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Allergies:</span>
                <div className="text-right">
                  {currentPatient.allergies.map((allergy, index) => (
                    <span key={index} className="inline-block bg-destructive/10 text-destructive px-2 py-1 rounded text-xs ml-1 mb-1">
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
              <Icon name="History" size={16} className="mr-2" />
              Dermatological History
            </h3>
            <div className="space-y-3">
              {history.map((condition) => (
                <div key={condition.id} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{condition.condition}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      condition.status === 'Active' ? 'bg-destructive/10 text-destructive' :
                      condition.status === 'Controlled'? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                    }`}>
                      {condition.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Diagnosed: {condition.diagnosed}</span>
                    <span>{condition.severity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Medications */}
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
              <Icon name="Pill" size={16} className="mr-2" />
              Current Medications
            </h3>
            <div className="space-y-3">
              {medications.map((medication) => (
                <div key={medication.id} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{medication.name}</span>
                    <span className="text-xs text-muted-foreground">{medication.prescribedDate}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{medication.dosage}</p>
                  <p className="text-xs text-primary">{medication.indication}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Previous Assessments */}
          <div className="p-4">
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
              <Icon name="Camera" size={16} className="mr-2" />
              Previous Assessments
            </h3>
            <div className="space-y-3">
              {assessments.map((assessment) => (
                <div key={assessment.id} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{assessment.type}</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Icon name="Camera" size={12} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{assessment.images}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{assessment.date}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{assessment.findings}</p>
                  <p className="text-xs text-primary">Dr. {assessment.provider}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientContextPanel;