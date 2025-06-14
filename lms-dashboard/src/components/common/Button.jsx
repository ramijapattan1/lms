import React from 'react';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 active:bg-primary/95',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-250',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10 active:bg-primary/20'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}