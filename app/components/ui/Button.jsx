"use client";

import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  onClick = undefined,
  href = undefined,
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'font-bold uppercase rounded-full border-none transition-all duration-300 cursor-pointer inline-block text-center';
  
  const variants = {
    primary: 'bg-neon-cyan text-deep-black hover:shadow-neon-cyan-lg hover:scale-105',
    secondary: 'bg-neon-pink text-white hover:shadow-neon-pink-lg hover:scale-105',
    outline: 'bg-transparent border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-deep-black',
    navy: 'bg-navy text-white hover:bg-light-grey hover:text-navy hover:shadow-lg',
  };
  
  const sizes = {
    sm: 'px-6 py-2 text-base',
    md: 'px-8 py-3 text-lg',
    lg: 'px-12 py-4 text-xl',
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }
  
  return (
    <button type={type} className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default Button;
