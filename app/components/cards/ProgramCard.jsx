"use client";

import React from 'react';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

const ProgramCard = ({ 
  title, 
  tagline, 
  icon: Icon, 
  slug,
  accentColor = 'neon-cyan'
}) => {
  const accentClasses = {
    'neon-cyan': 'border-neon-cyan hover:shadow-neon-cyan-lg',
    'neon-pink': 'border-neon-pink hover:shadow-neon-pink-lg',
    'electric-blue': 'border-electric-blue hover:shadow-[0_0_20px_rgba(0,129,198,0.5)]',
    'neon-purple': 'border-neon-purple hover:shadow-[0_0_20px_rgba(208,146,255,0.5)]',
  };

  return (
    <Link href={`/programs/${slug}`}>
      <div
        className={`
          bg-deep-black rounded-lg overflow-hidden
          border-2 ${accentClasses[accentColor]}
          transition-all duration-300 transform
          hover:scale-105 hover:-translate-y-2
          cursor-pointer min-h-[320px]
          flex flex-col
        `}
      >
        {/* Icon Section */}
        <div className="flex items-center justify-center py-12 bg-navy border-b-4 border-current">
          {Icon && (
            <div className={`text-7xl text-${accentColor}`}>
              <Icon />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-3xl font-bold text-white mb-3">{title}</h3>
            <p className="text-light-grey text-base leading-relaxed">{tagline}</p>
          </div>

          {/* CTA */}
          <div className="mt-6 flex items-center text-neon-cyan font-bold text-sm uppercase group">
            <span className="group-hover:mr-3 transition-all">Learn More</span>
            <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProgramCard;
