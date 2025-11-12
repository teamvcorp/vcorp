"use client";

import React from 'react';

const FeatureCard = ({ icon: Icon, title, description, accentColor = 'neon-cyan' }) => {
  const iconBgClasses = {
    'neon-cyan': 'bg-neon-cyan text-deep-black',
    'neon-pink': 'bg-neon-pink text-white',
    'electric-blue': 'bg-electric-blue text-white',
    'neon-purple': 'bg-neon-purple text-white',
  };

  return (
    <div className="flex flex-col items-center text-center p-6">
      {/* Icon Circle */}
      <div
        className={`
          w-24 h-24 rounded-full flex items-center justify-center
          ${iconBgClasses[accentColor]}
          shadow-lg mb-4 transition-transform duration-300
          hover:scale-110
        `}
      >
        {Icon && <Icon className="text-4xl" />}
      </div>

      {/* Title */}
      <h4 className="text-2xl font-bold text-white mb-2">{title}</h4>

      {/* Description */}
      <p className="text-light-grey text-base leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
