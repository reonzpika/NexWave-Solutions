import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BulkOperations = ({ 
  isVisible, 
  onClose, 
  selectedTemplates, 
  onBulkAction 
}) => {
  const [importFile, setImportFile] = useState(null);
  const [exportFormat, setExportFormat] = useState('json');
  const [isProcessing, setIsProcessing] = useState(false);

  const exportFormats = [
    { value: 'json', label: 'JSON Format' },
    { value: 'csv', label: 'CSV Format' },
    { value: 'pdf', label: 'PDF Document' },
    { value: 'docx', label: 'Word Document' }
  ];

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImportFile(file);
    }
  };

  const handleImport = async () => {
    if (!importFile) return;
    
    setIsProcessing(true);
    try {
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 2000));
      onBulkAction('import', { file: importFile });
      setImportFile(null);
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = async () => {
    setIsProcessing(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1500));
      onBulkAction('export', { 
        templates: selectedTemplates, 
        format: exportFormat 
      });
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedTemplates.length} templates? This action cannot be undone.`)) {
      setIsProcessing(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        onBulkAction('delete', { templates: selectedTemplates });
      } catch (error) {
        console.error('Bulk delete failed:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleBulkShare = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onBulkAction('share', { templates: selectedTemplates });
    } catch (error) {
      console.error('Bulk share failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1000">
      <div className="bg-card rounded-lg shadow-clinical-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Bulk Operations</h2>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
          />
        </div>

        <div className="p-6 space-y-6">
          {/* Import Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Icon name="Upload" size={20} className="text-primary" />
              <h3 className="text-lg font-medium text-foreground">Import Templates</h3>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-4">
                Import templates from JSON, CSV, or other supported formats. Existing templates with the same name will be updated.
              </p>
              
              <div className="space-y-3">
                <Input
                  type="file"
                  accept=".json,.csv,.txt"
                  onChange={handleFileImport}
                  label="Select file to import"
                />
                
                {importFile && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Icon name="File" size={16} className="text-primary" />
                    <span className="text-foreground">{importFile.name}</span>
                    <span className="text-muted-foreground">
                      ({(importFile.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                )}
                
                <Button
                  variant="default"
                  iconName="Upload"
                  iconPosition="left"
                  onClick={handleImport}
                  disabled={!importFile || isProcessing}
                  loading={isProcessing}
                >
                  Import Templates
                </Button>
              </div>
            </div>
          </div>

          {/* Export Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Icon name="Download" size={20} className="text-primary" />
              <h3 className="text-lg font-medium text-foreground">Export Templates</h3>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-4">
                Export {selectedTemplates.length > 0 ? `${selectedTemplates.length} selected` : 'all'} templates for backup or sharing with other practices.
              </p>
              
              <div className="space-y-3">
                <Select
                  label="Export format"
                  options={exportFormats}
                  value={exportFormat}
                  onChange={setExportFormat}
                />
                
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Info" size={16} />
                  <span>
                    {selectedTemplates.length > 0 
                      ? `${selectedTemplates.length} templates selected for export`
                      : 'All templates will be exported'
                    }
                  </span>
                </div>
                
                <Button
                  variant="default"
                  iconName="Download"
                  iconPosition="left"
                  onClick={handleExport}
                  disabled={isProcessing}
                  loading={isProcessing}
                >
                  Export Templates
                </Button>
              </div>
            </div>
          </div>

          {/* Bulk Actions Section */}
          {selectedTemplates.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Icon name="Settings" size={20} className="text-primary" />
                <h3 className="text-lg font-medium text-foreground">Bulk Actions</h3>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-4">
                  Perform actions on {selectedTemplates.length} selected templates.
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Share"
                    iconPosition="left"
                    onClick={handleBulkShare}
                    disabled={isProcessing}
                  >
                    Share All
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Copy"
                    iconPosition="left"
                    disabled={isProcessing}
                  >
                    Duplicate All
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Tag"
                    iconPosition="left"
                    disabled={isProcessing}
                  >
                    Add Tags
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    iconName="Trash2"
                    iconPosition="left"
                    onClick={handleBulkDelete}
                    disabled={isProcessing}
                  >
                    Delete All
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Recent Operations */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Icon name="History" size={20} className="text-primary" />
              <h3 className="text-lg font-medium text-foreground">Recent Operations</h3>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <Icon name="Upload" size={16} className="text-success" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Imported 12 templates</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <span className="text-xs text-success">Success</span>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <Icon name="Download" size={16} className="text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Exported 25 templates</p>
                      <p className="text-xs text-muted-foreground">Yesterday</p>
                    </div>
                  </div>
                  <span className="text-xs text-primary">Completed</span>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <Icon name="Trash2" size={16} className="text-destructive" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Deleted 3 templates</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                  <span className="text-xs text-destructive">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkOperations;