import React from 'react';
import { cn } from '@/lib/utils';

interface ColorfulIconProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'primary' | 'finance' | 'building' | 'design' | 'real-estate';
}

export function ColorfulIcon({ 
  children, 
  size = 'md',
  className,
  variant = 'primary'
}: ColorfulIconProps) {
  // Define size-based styling
  const sizeStyles = {
    sm: "p-2 w-10 h-10",
    md: "p-3 w-14 h-14",
    lg: "p-5 w-20 h-20",
  };

  // Define icon sizes
  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-7 w-7",
    lg: "h-10 w-10",
  };

  // Define gradient variants
  const gradientVariants = {
    primary: "from-primary/20 to-secondary/20",
    finance: "from-blue-400/20 to-emerald-400/20",
    building: "from-amber-400/20 to-red-400/20",
    design: "from-purple-400/20 to-pink-400/20",
    'real-estate': "from-emerald-400/20 to-sky-400/20"
  };

  // Define text color variants
  const textColorVariants = {
    primary: "text-primary",
    finance: "text-blue-600",
    building: "text-amber-600",
    design: "text-purple-600",
    'real-estate': "text-emerald-600"
  };

  // Apply size styles to the container
  const containerClasses = cn(
    "bg-gradient-to-br shadow-lg rounded-full flex items-center justify-center transform hover:scale-105 transition-transform",
    gradientVariants[variant],
    sizeStyles[size],
    className
  );

  // Apply size styles to the icon
  const iconClasses = cn(
    textColorVariants[variant],
    "drop-shadow-md",
    iconSizes[size]
  );

  // Apply the icon classes to the children
  const styledIcon = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement, {
        className: cn(children.props.className, iconClasses),
      })
    : children;

  return <div className={containerClasses}>{styledIcon}</div>;
}