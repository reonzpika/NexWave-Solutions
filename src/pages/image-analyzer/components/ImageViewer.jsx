import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ImageViewer = ({ 
  imageUrl, 
  annotations, 
  onAnnotationAdd, 
  onAnnotationUpdate, 
  onAnnotationDelete,
  isAnnotating,
  annotationTool 
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.1));
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (isAnnotating) return;
    
    setIsPanning(true);
    setPanStart({
      x: e.clientX - pan.x,
      y: e.clientY - pan.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isPanning || isAnnotating) return;
    
    setPan({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleImageClick = (e) => {
    if (!isAnnotating) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left - pan.x) / zoom);
    const y = ((e.clientY - rect.top - pan.y) / zoom);
    
    const newAnnotation = {
      id: Date.now(),
      type: annotationTool,
      x: x,
      y: y,
      label: '',
      measurements: annotationTool === 'measurement' ? { length: 0, unit: 'mm' } : null
    };
    
    onAnnotationAdd(newAnnotation);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseup', handleMouseUp);
      container.addEventListener('mouseleave', handleMouseUp);
      
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseup', handleMouseUp);
        container.removeEventListener('mouseleave', handleMouseUp);
      };
    }
  }, [isPanning, panStart, pan]);

  if (!imageUrl) {
    return (
      <div className="h-full bg-muted/20 rounded-lg flex items-center justify-center">
        <div className="text-center space-y-3">
          <Icon name="ImageOff" size={48} className="text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">No image selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background rounded-lg border border-border">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            iconName="ZoomOut"
            iconSize={16}
          >
            Zoom Out
          </Button>
          
          <span className="text-sm text-muted-foreground px-2">
            {Math.round(zoom * 100)}%
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            iconName="ZoomIn"
            iconSize={16}
          >
            Zoom In
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetView}
            iconName="RotateCcw"
            iconSize={16}
          >
            Reset
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-xs text-muted-foreground">
            {isAnnotating ? `${annotationTool} mode` : 'Pan mode'}
          </div>
        </div>
      </div>
      
      {/* Image Container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-hidden relative cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <div
          className="relative"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            transition: isPanning ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Clinical image for analysis"
            className="max-w-none"
            onClick={handleImageClick}
            draggable={false}
          />
          
          {/* Annotations Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {annotations.map((annotation) => (
              <div
                key={annotation.id}
                className="absolute pointer-events-auto"
                style={{
                  left: annotation.x,
                  top: annotation.y,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {annotation.type === 'point' && (
                  <div className="relative">
                    <div className="w-4 h-4 bg-primary border-2 border-white rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform"></div>
                    {annotation.label && (
                      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg">
                        {annotation.label}
                      </div>
                    )}
                  </div>
                )}
                
                {annotation.type === 'measurement' && (
                  <div className="relative">
                    <div className="w-3 h-3 bg-accent border-2 border-white rounded-full shadow-lg"></div>
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-accent text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                      {annotation.measurements?.length || 0}{annotation.measurements?.unit || 'mm'}
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => onAnnotationDelete(annotation.id)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="flex items-center justify-between p-3 border-t border-border bg-muted/20">
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <span>Annotations: {annotations.length}</span>
          <span>Resolution: 2048x1536</span>
          <span>File size: 2.4 MB</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Icon name="Info" size={14} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Click and drag to pan • Scroll to zoom
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;