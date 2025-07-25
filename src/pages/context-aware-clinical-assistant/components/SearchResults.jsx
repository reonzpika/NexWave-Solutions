import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SearchResults = ({ results, isLoading, searchQuery, onInsertToNotes, onBookmark }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 shadow-clinical animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-muted rounded-lg"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!results.length && searchQuery) {
    return (
      <div className="bg-card border border-border rounded-xl p-12 text-center shadow-clinical">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Search" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Results Found</h3>
        <p className="text-muted-foreground mb-6">
          No clinical resources found for "{searchQuery}". Try adjusting your search terms or filters.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" iconName="RefreshCw" iconPosition="left">
            Try Different Terms
          </Button>
          <Button variant="ghost" iconName="HelpCircle" iconPosition="left">
            Search Tips
          </Button>
        </div>
      </div>
    );
  }

  const groupedResults = {
    healthpathways: results.filter(r => r.source === 'healthpathways'),
    formulary: results.filter(r => r.source === 'formulary'),
    healthify: results.filter(r => r.source === 'healthify')
  };

  const sourceConfig = {
    healthpathways: {
      title: 'HealthPathways Guidelines',
      icon: 'FileText',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    },
    formulary: {
      title: 'NZ Formulary',
      icon: 'Pill',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20'
    },
    healthify: {
      title: 'Healthify NZ',
      icon: 'BookOpen',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20'
    }
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedResults).map(([source, sourceResults]) => {
        if (!sourceResults.length) return null;
        
        const config = sourceConfig[source];
        
        return (
          <div key={source} className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 ${config.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon name={config.icon} size={16} className={config.color} />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{config.title}</h3>
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-sm text-muted-foreground">
                {sourceResults.length} result{sourceResults.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid gap-4">
              {sourceResults.map((result) => (
                <div
                  key={result.id}
                  className={`bg-card border ${config.borderColor} rounded-xl p-6 shadow-clinical hover:shadow-clinical-lg transition-shadow duration-200`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`w-12 h-12 ${config.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon name={config.icon} size={20} className={config.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                          {result.title}
                        </h4>
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-1">
                            <Icon name="Star" size={14} className="text-warning fill-current" />
                            <span className="text-sm font-medium text-foreground">
                              {result.relevanceScore}%
                            </span>
                            <span className="text-xs text-muted-foreground">relevance</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Icon name="Clock" size={14} className="text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Updated {result.lastUpdated}
                            </span>
                          </div>
                          {result.category && (
                            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                              {result.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onBookmark(result.id)}
                      className={`p-2 rounded-lg transition-colors duration-150 ${
                        result.isBookmarked
                          ? 'bg-warning/10 text-warning' :'hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon name={result.isBookmarked ? 'Bookmark' : 'BookmarkPlus'} size={16} />
                    </button>
                  </div>

                  <div className="mb-4">
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                      {result.preview}
                    </p>
                  </div>

                  {result.keyPoints && result.keyPoints.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-foreground mb-2">Key Points:</h5>
                      <ul className="space-y-1">
                        {result.keyPoints.slice(0, 3).map((point, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm text-muted-foreground">
                            <Icon name="ChevronRight" size={14} className="mt-0.5 flex-shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="ExternalLink"
                        iconPosition="right"
                        iconSize={14}
                      >
                        View Full
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Copy"
                        iconPosition="left"
                        iconSize={14}
                      >
                        Copy Link
                      </Button>
                    </div>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onInsertToNotes(result)}
                      iconName="Plus"
                      iconPosition="left"
                      iconSize={14}
                    >
                      Insert to Notes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SearchResults;