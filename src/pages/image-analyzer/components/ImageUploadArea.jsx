import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ImageUploadArea = ({ onImageUpload, isUploading }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      onImageUpload(imageFiles[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="h-full flex flex-col">
      <div
        className={`flex-1 border-2 border-dashed rounded-lg transition-all duration-200 ${
          isDragOver
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
        } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
          {isUploading ? (
            <div className="space-y-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Processing Image
                </h3>
                <p className="text-sm text-muted-foreground">
                  Extracting EXIF data and preparing for analysis...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                <Icon name="Upload" size={32} className="text-muted-foreground" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-foreground">
                  Upload Clinical Image
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Drag and drop your clinical photo here, or click to browse. 
                  Supports JPEG, PNG, and HEIC formats.
                </p>
              </div>
              
              <div className="space-y-3">
                <Button
                  variant="default"
                  onClick={handleBrowseClick}
                  iconName="FolderOpen"
                  iconPosition="left"
                >
                  Browse Files
                </Button>
                
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="Camera" size={14} />
                    <span>Mobile capture supported</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Shield" size={14} />
                    <span>HIPAA compliant</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">Image Requirements:</p>
            <ul className="space-y-1">
              <li>• High resolution (minimum 1024x768)</li>
              <li>• Good lighting and focus</li>
              <li>• Include ruler or reference object when possible</li>
              <li>• Maximum file size: 10MB</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadArea;