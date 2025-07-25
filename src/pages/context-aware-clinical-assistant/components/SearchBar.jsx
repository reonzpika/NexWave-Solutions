import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const SearchBar = ({ onSearch, searchQuery, setSearchQuery, suggestions, isLoading }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const searchRef = useRef(null);

  const handleSearch = (query) => {
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSuggestion >= 0 && suggestions[selectedSuggestion]) {
        const suggestion = suggestions[selectedSuggestion];
        setSearchQuery(suggestion.text);
        handleSearch(suggestion.text);
      } else {
        handleSearch(searchQuery);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestion(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestion(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedSuggestion(-1);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.text);
    handleSearch(suggestion.text);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto" ref={searchRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon name="Search" size={20} className="text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Search clinical guidelines, medications, or patient resources..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
            setSelectedSuggestion(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          className="pl-12 pr-12 h-14 text-lg bg-card border-2 border-border focus:border-primary rounded-xl shadow-clinical"
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
          {isLoading ? (
            <div className="animate-spin">
              <Icon name="Loader2" size={20} className="text-primary" />
            </div>
          ) : (
            <button
              onClick={() => handleSearch(searchQuery)}
              className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors duration-150"
            >
              <Icon name="ArrowRight" size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-clinical-lg z-50 max-h-80 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full px-4 py-3 text-left hover:bg-muted transition-colors duration-150 flex items-center space-x-3 ${
                index === selectedSuggestion ? 'bg-muted' : ''
              } ${index === 0 ? 'rounded-t-xl' : ''} ${
                index === suggestions.length - 1 ? 'rounded-b-xl' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                suggestion.type === 'guideline' ? 'bg-primary/10' :
                suggestion.type === 'medication' ? 'bg-accent/10' : 'bg-warning/10'
              }`}>
                <Icon 
                  name={
                    suggestion.type === 'guideline' ? 'FileText' :
                    suggestion.type === 'medication' ? 'Pill' : 'BookOpen'
                  } 
                  size={16} 
                  className={
                    suggestion.type === 'guideline' ? 'text-primary' :
                    suggestion.type === 'medication' ? 'text-accent' : 'text-warning'
                  }
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {suggestion.text}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {suggestion.type === 'guideline' ? 'HealthPathways' :
                   suggestion.type === 'medication' ? 'NZ Formulary' : 'Healthify NZ'}
                </p>
              </div>
              <Icon name="ArrowUpRight" size={14} className="text-muted-foreground" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;