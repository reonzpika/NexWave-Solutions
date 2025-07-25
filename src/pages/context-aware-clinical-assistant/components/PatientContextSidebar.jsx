import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const PatientContextSidebar = ({ patientData, recentSearches, bookmarkedResources, onSearchFromHistory }) => {
  const [activeTab, setActiveTab] = useState('patient');

  const tabs = [
    { id: 'patient', label: 'Patient', icon: 'User' },
    { id: 'history', label: 'History', icon: 'Clock' },
    { id: 'bookmarks', label: 'Bookmarks', icon: 'Bookmark' }
  ];

  return (
    <div className="w-80 bg-card border-l border-border h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-colors duration-150 ${
              activeTab === tab.id
                ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Icon name={tab.icon} size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'patient' && (
          <div className="p-6 space-y-6">
            {/* Patient Summary */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                <Icon name="User" size={20} />
                <span>Patient Summary</span>
              </h3>
              
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="User" size={20} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{patientData.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {patientData.age} years • {patientData.gender} • NHI: {patientData.nhi}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">DOB:</span>
                      <p className="font-medium">{patientData.dateOfBirth}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Contact:</span>
                      <p className="font-medium">{patientData.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Medications */}
            <div>
              <h4 className="font-semibold text-foreground mb-3 flex items-center space-x-2">
                <Icon name="Pill" size={16} />
                <span>Current Medications</span>
              </h4>
              <div className="space-y-2">
                {patientData.medications.map((medication, index) => (
                  <div key={index} className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">{medication.name}</p>
                        <p className="text-xs text-muted-foreground">{medication.dosage}</p>
                        <p className="text-xs text-muted-foreground">{medication.frequency}</p>
                      </div>
                      <button
                        onClick={() => onSearchFromHistory(`${medication.name} interactions`)}
                        className="p-1 hover:bg-muted rounded transition-colors duration-150"
                      >
                        <Icon name="Search" size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Allergies */}
            <div>
              <h4 className="font-semibold text-foreground mb-3 flex items-center space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-destructive" />
                <span>Allergies</span>
              </h4>
              <div className="space-y-2">
                {patientData.allergies.map((allergy, index) => (
                  <div key={index} className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Icon name="AlertCircle" size={14} className="text-destructive" />
                      <div>
                        <p className="font-medium text-foreground text-sm">{allergy.allergen}</p>
                        <p className="text-xs text-muted-foreground">{allergy.reaction}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Medical History */}
            <div>
              <h4 className="font-semibold text-foreground mb-3 flex items-center space-x-2">
                <Icon name="FileText" size={16} />
                <span>Medical History</span>
              </h4>
              <div className="space-y-2">
                {patientData.medicalHistory.map((condition, index) => (
                  <div key={index} className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">{condition.condition}</p>
                        <p className="text-xs text-muted-foreground">Diagnosed: {condition.diagnosedDate}</p>
                        {condition.status && (
                          <span className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${
                            condition.status === 'Active' ? 'bg-warning/20 text-warning' :
                            condition.status === 'Resolved'? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
                          }`}>
                            {condition.status}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => onSearchFromHistory(`${condition.condition} management`)}
                        className="p-1 hover:bg-muted rounded transition-colors duration-150"
                      >
                        <Icon name="Search" size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
              <Icon name="Clock" size={20} />
              <span>Recent Searches</span>
            </h3>
            
            <div className="space-y-3">
              {recentSearches.map((search, index) => (
                <div key={index} className="group">
                  <button
                    onClick={() => onSearchFromHistory(search.query)}
                    className="w-full text-left p-3 bg-muted/30 hover:bg-muted rounded-lg transition-colors duration-150"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">{search.query}</p>
                        <p className="text-xs text-muted-foreground">{search.timestamp}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                            {search.resultCount} results
                          </span>
                          {search.source && (
                            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                              {search.source}
                            </span>
                          )}
                        </div>
                      </div>
                      <Icon name="ArrowUpRight" size={14} className="text-muted-foreground group-hover:text-foreground" />
                    </div>
                  </button>
                </div>
              ))}
            </div>

            {recentSearches.length === 0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="Clock" size={20} className="text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">No recent searches</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookmarks' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
              <Icon name="Bookmark" size={20} />
              <span>Bookmarked Resources</span>
            </h3>
            
            <div className="space-y-3">
              {bookmarkedResources.map((resource, index) => (
                <div key={index} className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      resource.source === 'healthpathways' ? 'bg-primary/10' :
                      resource.source === 'formulary' ? 'bg-accent/10' : 'bg-warning/10'
                    }`}>
                      <Icon 
                        name={
                          resource.source === 'healthpathways' ? 'FileText' :
                          resource.source === 'formulary' ? 'Pill' : 'BookOpen'
                        } 
                        size={14} 
                        className={
                          resource.source === 'healthpathways' ? 'text-primary' :
                          resource.source === 'formulary' ? 'text-accent' : 'text-warning'
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm line-clamp-2">{resource.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{resource.source}</p>
                      <p className="text-xs text-muted-foreground">Saved {resource.savedDate}</p>
                    </div>
                    <button className="p-1 hover:bg-muted rounded transition-colors duration-150">
                      <Icon name="ExternalLink" size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {bookmarkedResources.length === 0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="Bookmark" size={20} className="text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">No bookmarked resources</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientContextSidebar;