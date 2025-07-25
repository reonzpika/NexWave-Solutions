import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GeneratedNoteModal = ({ 
  isOpen, 
  onClose, 
  generatedNote, 
  templateName,
  onSave,
  onExport 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState(generatedNote);
  const [copySuccess, setCopySuccess] = useState(false);
  const noteRef = useRef(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedNote);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleSave = () => {
    onSave(editedNote);
    setIsEditing(false);
  };

  const handleExport = (format) => {
    onExport(editedNote, format);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1000 p-4">
      <div className="bg-card border border-border rounded-lg shadow-clinical-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Generated Clinical Note</h2>
              <p className="text-sm text-muted-foreground">
                Template: {templateName} • Generated at {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName={copySuccess ? "Check" : "Copy"}
              iconPosition="left"
              onClick={handleCopy}
              className={copySuccess ? 'text-success border-success' : ''}
            >
              {copySuccess ? 'Copied!' : 'Copy'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName={isEditing ? "Eye" : "Edit"}
              iconPosition="left"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Preview' : 'Edit'}
            </Button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors duration-150"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {isEditing ? (
            <div className="flex-1 p-6">
              <textarea
                ref={noteRef}
                value={editedNote}
                onChange={(e) => setEditedNote(e.target.value)}
                className="w-full h-full p-4 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none font-mono text-sm leading-relaxed"
                placeholder="Edit your clinical note..."
              />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground bg-muted/30 p-4 rounded-lg border">
                  {editedNote}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Clock" size={16} />
              <span>Generated in 2.3s</span>
            </div>
            <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="FileText" size={16} />
              <span>{editedNote.split(' ').length} words</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Export Options */}
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                onClick={() => handleExport('txt')}
              >
                TXT
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                onClick={() => handleExport('pdf')}
              >
                PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                onClick={() => handleExport('docx')}
              >
                DOCX
              </Button>
            </div>

            <div className="w-px h-6 bg-border"></div>

            {/* Primary Actions */}
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              iconName="Save"
              iconPosition="left"
              onClick={handleSave}
            >
              Save Note
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratedNoteModal;