"use client";

import React from 'react';
import Button from '../ui/Button';

const HeroSection = ({ 
  backgroundImage = '/group.jpg',
  headline,
  subheadline,
  ctaText = 'Explore Programs',
  ctaLink = '#programs',
  height = 'h-[85vh]'
}) => {
  const handleScroll = (e) => {
    if (ctaLink.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(ctaLink);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      className={`
        ${height} w-full relative
        bg-cover bg-center bg-no-repeat
        flex items-center justify-center
      `}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Neon gradient overlay */}
      <div className="absolute inset-0 bg-gradient-neon" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-6xl">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-neon-cyan mb-6 leading-tight drop-shadow-lg">
          {headline}
        </h1>
        
        {subheadline && (
          <p className="text-2xl md:text-3xl text-white mb-8 max-w-3xl mx-auto leading-relaxed">
            {subheadline}
          </p>
        )}

        <Button 
          variant="primary" 
          size="lg"
          href={ctaLink}
          onClick={handleScroll}
        >
          {ctaText}
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
