import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SessionBreakdownTable = ({ sessions, className = '' }) => {
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedSessions = [...sessions].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const paginatedSessions = sortedSessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sessions.length / itemsPerPage);

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 95) return 'text-success';
    if (accuracy >= 85) return 'text-warning';
    return 'text-destructive';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-success/10 text-success border-success/20', label: 'Completed', icon: 'CheckCircle' },
      processing: { color: 'bg-warning/10 text-warning border-warning/20', label: 'Processing', icon: 'Loader' },
      failed: { color: 'bg-destructive/10 text-destructive border-destructive/20', label: 'Failed', icon: 'XCircle' }
    };

    const config = statusConfig[status] || statusConfig.completed;

    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon name={config.icon} size={12} />
        <span>{config.label}</span>
      </span>
    );
  };

  // Mobile Card View Component
  const MobileSessionCard = ({ session }) => (
    <div className="bg-muted/30 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{session.patientId}</span>
        {getStatusBadge(session.status)}
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-muted-foreground">Date:</span>
          <div className="font-medium text-foreground">{session.date}</div>
        </div>
        <div>
          <span className="text-muted-foreground">Duration:</span>
          <div className="font-medium text-foreground">{session.duration}</div>
        </div>
        <div>
          <span className="text-muted-foreground">Accuracy:</span>
          <div className={`font-medium ${getAccuracyColor(session.transcriptionAccuracy)}`}>
            {session.transcriptionAccuracy}%
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Processing:</span>
          <div className="font-medium text-foreground">{session.processingTime}s</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-sm text-muted-foreground">Template: {session.template}</span>
      </div>
    </div>
  );

  return (
    <div className={`bg-card border border-border rounded-lg shadow-clinical ${className}`}>
      <div className="p-4 sm:p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Session Breakdown</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Detailed view of all consultation sessions
            </p>
          </div>
          <Button variant="outline" iconName="Download" iconPosition="left" size="sm">
            <span className="hidden sm:inline">Export Data</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </div>

      {/* Mobile View - Cards */}
      <div className="block md:hidden">
        <div className="p-4 space-y-4">
          {paginatedSessions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="FileText" size={24} className="text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No sessions found</p>
              <p className="text-sm text-muted-foreground mt-1">Sessions will appear here after consultations</p>
            </div>
          ) : (
            paginatedSessions.map((session) => (
              <MobileSessionCard key={session.id} session={session} />
            ))
          )}
        </div>
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {[
                { key: 'date', label: 'Date' },
                { key: 'patientId', label: 'Patient ID' },
                { key: 'duration', label: 'Duration' },
                { key: 'transcriptionAccuracy', label: 'Accuracy' },
                { key: 'processingTime', label: 'AI Processing' },
                { key: 'template', label: 'Template' },
                { key: 'status', label: 'Status' }
              ].map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 transition-colors duration-150 select-none"
                  onClick={() => handleSort(column.key)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSort(column.key);
                    }
                  }}
                  role="button"
                  aria-label={`Sort by ${column.label}`}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    <Icon 
                      name={sortField === column.key && sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                      size={14}
                      className={sortField === column.key ? 'text-primary' : 'text-muted-foreground/50'}
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedSessions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="FileText" size={24} className="text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">No sessions found</p>
                  <p className="text-sm text-muted-foreground mt-1">Sessions will appear here after consultations</p>
                </td>
              </tr>
            ) : (
              paginatedSessions.map((session, index) => (
                <tr 
                  key={session.id} 
                  className="hover:bg-muted/30 transition-colors duration-150"
                  tabIndex={0}
                  role="row"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground font-medium">
                    {session.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {session.patientId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {session.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${getAccuracyColor(session.transcriptionAccuracy)}`}>
                      {session.transcriptionAccuracy}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {session.processingTime}s
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {session.template}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(session.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="px-4 sm:px-6 py-4 border-t border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sessions.length)} of {sessions.length} sessions
            </p>
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                iconName="ChevronLeft"
                iconPosition="left"
                aria-label="Previous page"
              >
                <span className="hidden sm:inline">Previous</span>
              </Button>
              
              <div className="flex items-center space-x-1">
                {/* Page numbers for larger screens */}
                <div className="hidden sm:flex items-center space-x-1">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNumber = currentPage > 3 ? currentPage - 2 + i : i + 1;
                    if (pageNumber > totalPages) return null;
                    
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                          currentPage === pageNumber
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>
                
                {/* Mobile page indicator */}
                <span className="sm:hidden text-sm text-muted-foreground px-2">
                  {currentPage} / {totalPages}
                </span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                iconName="ChevronRight"
                iconPosition="right"
                aria-label="Next page"
              >
                <span className="hidden sm:inline">Next</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionBreakdownTable;