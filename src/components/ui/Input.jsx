import React, { forwardRef } from 'react';
import Icon from '../AppIcon';
import { cn } from '../../utils/cn';

const Input = forwardRef(({ 
  className, 
  type = "text", 
  error,
  leftIcon,
  rightIcon,
  label,
  description,
  required = false,
  ...props 
}, ref) => {
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputId}
          className={cn(
            "block text-sm font-medium text-foreground mb-2",
            required && "after:content-['*'] after:text-destructive after:ml-1"
          )}
        >
          {label}
        </label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none">
            <Icon name={leftIcon} size={16} />
          </div>
        )}
        
        {/* Input Field */}
        <input
          id={inputId}
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm",
            "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all duration-200",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error 
              ? "border-destructive focus-visible:ring-destructive" :"border-input focus-visible:ring-primary",
            className
          )}
          ref={ref}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error ? `${inputId}-error` : 
            description ? `${inputId}-description` : 
            undefined
          }
          {...props}
        />
        
        {/* Right Icon */}
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none">
            <Icon name={rightIcon} size={16} />
          </div>
        )}
      </div>
      
      {/* Description */}
      {description && !error && (
        <p 
          id={`${inputId}-description`}
          className="text-xs text-muted-foreground mt-1"
        >
          {description}
        </p>
      )}
      
      {/* Error Message */}
      {error && (
        <p 
          id={`${inputId}-error`}
          className="text-xs text-destructive mt-1 flex items-center"
          role="alert"
        >
          <Icon name="AlertCircle" size={12} className="mr-1 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;