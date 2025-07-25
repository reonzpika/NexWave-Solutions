import React, { forwardRef } from 'react';
import Icon from '../AppIcon';
import { cn } from '../../utils/cn';

const Button = forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children, 
  iconName,
  iconPosition = "left",
  iconSize = 16,
  loading = false,
  disabled = false,
  type = "button",
  ...props 
}, ref) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground focus:ring-primary",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary",
    ghost: "hover:bg-accent hover:text-accent-foreground focus:ring-primary",
    link: "text-primary underline-offset-4 hover:underline focus:ring-primary",
    success: "bg-success text-success-foreground hover:bg-success/90 focus:ring-success",
    warning: "bg-warning text-warning-foreground hover:bg-warning/90 focus:ring-warning"
  };

  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-9 px-3 text-sm rounded-md",
    lg: "h-11 px-8 text-base rounded-md",
    icon: "h-10 w-10"
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        "touch-target", // Ensure minimum touch target size
        variants[variant],
        sizes[size],
        loading && "cursor-wait",
        className
      )}
      disabled={isDisabled}
      ref={ref}
      {...props}
    >
      {loading && (
        <Icon 
          name="Loader2" 
          size={iconSize} 
          className={cn(
            "animate-spin",
            children ? "mr-2" : ""
          )} 
        />
      )}
      
      {!loading && iconName && iconPosition === "left" && (
        <Icon 
          name={iconName} 
          size={iconSize} 
          className={cn(
            children ? "mr-2" : ""
          )} 
        />
      )}
      
      {children && (
        <span className="truncate">{children}</span>
      )}
      
      {!loading && iconName && iconPosition === "right" && (
        <Icon 
          name={iconName} 
          size={iconSize} 
          className={cn(
            children ? "ml-2" : ""
          )} 
        />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;