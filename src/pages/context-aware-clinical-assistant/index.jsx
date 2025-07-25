import React, { useState, useEffect } from 'react';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import SearchBar from './components/SearchBar';
import SearchFilters from './components/SearchFilters';
import SearchResults from './components/SearchResults';
import PatientContextSidebar from './components/PatientContextSidebar';
import QuickActions from './components/QuickActions';

const ContextAwareClinicalAssistant = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [showPatientSidebar, setShowPatientSidebar] = useState(true);
  const [userTier, setUserTier] = useState('basic');
  const [hasSearched, setHasSearched] = useState(false);

  // Mock data
  const mockSuggestions = [
    { text: "chest pain assessment", type: "guideline" },
    { text: "diabetes management", type: "guideline" },
    { text: "metformin dosing", type: "medication" },
    { text: "hypertension guidelines", type: "guideline" },
    { text: "depression screening", type: "guideline" },
    { text: "atorvastatin interactions", type: "medication" },
    { text: "asthma action plan", type: "guideline" },
    { text: "patient education diabetes", type: "resource" }
  ];

  const mockPatientData = {
    name: "Sarah Johnson",
    age: 58,
    gender: "Female",
    nhi: "ABC1234",
    dateOfBirth: "15/03/1965",
    phone: "021 456 789",
    medications: [
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
      { name: "Atorvastatin", dosage: "20mg", frequency: "Once daily" },
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" }
    ],
    allergies: [
      { allergen: "Penicillin", reaction: "Rash, swelling" },
      { allergen: "Shellfish", reaction: "Anaphylaxis" }
    ],
    medicalHistory: [
      { condition: "Type 2 Diabetes", diagnosedDate: "2018", status: "Active" },
      { condition: "Hypertension", diagnosedDate: "2020", status: "Active" },
      { condition: "Hyperlipidemia", diagnosedDate: "2019", status: "Active" }
    ]
  };

  const mockRecentSearches = [
    { query: "diabetes management guidelines", timestamp: "2 hours ago", resultCount: 12, source: "HealthPathways" },
    { query: "metformin side effects", timestamp: "Yesterday", resultCount: 8, source: "NZ Formulary" },
    { query: "hypertension patient education", timestamp: "2 days ago", resultCount: 15, source: "Healthify NZ" },
    { query: "chest pain assessment", timestamp: "3 days ago", resultCount: 9, source: "HealthPathways" }
  ];

  const mockBookmarkedResources = [
    { title: "Type 2 Diabetes Management Pathway", source: "healthpathways", savedDate: "1 week ago" },
    { title: "Metformin Prescribing Information", source: "formulary", savedDate: "2 weeks ago" },
    { title: "Living with Diabetes - Patient Guide", source: "healthify", savedDate: "1 month ago" }
  ];

  const mockSearchResults = [
    {
      id: 1,
      title: "Type 2 Diabetes Management - Adult",
      source: "healthpathways",
      relevanceScore: 95,
      lastUpdated: "2 weeks ago",
      category: "Endocrine",
      preview: "Comprehensive pathway for the management of Type 2 diabetes in adults, including initial assessment, treatment goals, medication selection, and ongoing monitoring requirements.",
      keyPoints: [
        "HbA1c target <53mmol/mol for most patients",
        "Metformin first-line unless contraindicated",
        "Annual screening for complications required"
      ],
      isBookmarked: false
    },
    {
      id: 2,
      title: "Metformin - Prescribing Information",
      source: "formulary",
      relevanceScore: 88,
      lastUpdated: "1 month ago",
      category: "Antidiabetic",
      preview: "Complete prescribing information for metformin including dosing, contraindications, drug interactions, and monitoring requirements for Type 2 diabetes management.",
      keyPoints: [
        "Starting dose 500mg twice daily with meals",
        "Maximum dose 2g daily in divided doses",
        "Monitor renal function before and during treatment"
      ],
      isBookmarked: true
    },
    {
      id: 3,
      title: "Living with Type 2 Diabetes",
      source: "healthify",
      relevanceScore: 82,
      lastUpdated: "3 weeks ago",
      category: "Patient Education",
      preview: "Patient-friendly resource covering lifestyle management, medication adherence, blood glucose monitoring, and when to seek medical attention for diabetes complications.",
      keyPoints: [
        "Importance of regular blood glucose monitoring",
        "Healthy eating and exercise recommendations",
        "Recognition of hypoglycemia symptoms"
      ],
      isBookmarked: false
    }
  ];

  useEffect(() => {
    // Simulate user tier detection
    const tier = localStorage.getItem('userTier') || 'basic';
    setUserTier(tier);
  }, []);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setHasSearched(true);
    
    // Simulate API call
    setTimeout(() => {
      setSearchResults(mockSearchResults);
      setIsLoading(false);
    }, 1500);
  };

  const handleFilterChange = (filterId, filters) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterId]: filters
    }));
  };

  const handleClearFilters = () => {
    setActiveFilters({});
  };

  const handleInsertToNotes = (result) => {
    // Simulate inserting to consultation notes
    console.log('Inserting to notes:', result.title);
    // In real implementation, this would integrate with the AI scribe
  };

  const handleBookmark = (resultId) => {
    setSearchResults(prev =>
      prev.map(result =>
        result.id === resultId
          ? { ...result, isBookmarked: !result.isBookmarked }
          : result
      )
    );
  };

  const handleSearchFromHistory = (query) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleQuickSearch = (query) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar />
      
      <div className={`transition-all duration-300 ${showPatientSidebar ? 'ml-16 mr-80 lg:ml-72 lg:mr-80' : 'ml-16 lg:ml-72'}`}>
        <div className="flex flex-col h-screen">
          {/* Header */}
          <div className="flex-shrink-0 bg-card border-b border-border px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon name="Stethoscope" size={20} className="text-primary" />
                  </div>
                  <span className="truncate">Context-Aware Clinical Assistant</span>
                  {(userTier === 'premium' || userTier === 'enterprise') && (
                    <span className="hidden sm:inline text-xs bg-primary/20 text-primary px-3 py-1 rounded-full flex-shrink-0">
                      Premium Feature
                    </span>
                  )}
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  Intelligent search across HealthPathways, NZ Formulary, and Healthify NZ
                </p>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  iconName="Filter"
                  iconPosition="left"
                  iconSize={16}
                >
                  <span className="hidden sm:inline">Filters</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPatientSidebar(!showPatientSidebar)}
                  iconName={showPatientSidebar ? "PanelRightClose" : "PanelRightOpen"}
                  iconPosition="left"
                  iconSize={16}
                >
                  <span className="hidden sm:inline">{showPatientSidebar ? 'Hide' : 'Show'} Context</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="flex-shrink-0 bg-card border-b border-border px-4 sm:px-6 py-4 lg:py-6">
            <SearchBar
              onSearch={handleSearch}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              suggestions={mockSuggestions}
              isLoading={isLoading}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full">
              <div className="p-4 sm:p-6 space-y-6 h-full overflow-y-auto">
                {/* Filters */}
                {showFilters && (
                  <div className="animate-in slide-in-from-top-2 duration-200">
                    <SearchFilters
                      activeFilters={activeFilters}
                      onFilterChange={handleFilterChange}
                      onClearFilters={handleClearFilters}
                    />
                  </div>
                )}

                {/* Search Results or Quick Actions */}
                {hasSearched ? (
                  <SearchResults
                    results={searchResults}
                    isLoading={isLoading}
                    searchQuery={searchQuery}
                    onInsertToNotes={handleInsertToNotes}
                    onBookmark={handleBookmark}
                  />
                ) : (
                  <QuickActions
                    onQuickSearch={handleQuickSearch}
                    userTier={userTier}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Context Sidebar */}
      {showPatientSidebar && (
        <div className="fixed right-0 top-0 h-screen z-40">
          <PatientContextSidebar
            patientData={mockPatientData}
            recentSearches={mockRecentSearches}
            bookmarkedResources={mockBookmarkedResources}
            onSearchFromHistory={handleSearchFromHistory}
          />
        </div>
      )}
    </div>
  );
};

export default ContextAwareClinicalAssistant;