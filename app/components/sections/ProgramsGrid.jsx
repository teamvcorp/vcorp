"use client";

import React from 'react';
import ProgramCard from '../cards/ProgramCard';
import { 
  FaHandsHelping, 
  FaFistRaised, 
  FaYinYang, 
  FaGraduationCap 
} from 'react-icons/fa';

const programs = [
  {
    title: 'Spirit Of',
    tagline: 'Making a difference, one community at a time',
    icon: FaHandsHelping,
    slug: 'spiritof',
    accentColor: 'electric-blue',
  },
  {
    title: 'Fyght4',
    tagline: 'Advocacy and support when you need it most',
    icon: FaFistRaised,
    slug: 'fyght4',
    accentColor: 'neon-pink',
  },
  {
    title: 'Taekwondo Academy',
    tagline: 'Discipline. Respect. Excellence.',
    icon: FaYinYang,
    slug: 'taekwondo',
    accentColor: 'neon-cyan',
  },
  {
    title: 'Edyens Gate',
    tagline: 'Learn anywhere, anytime',
    icon: FaGraduationCap,
    slug: 'edyensgate',
    accentColor: 'neon-purple',
  },
];

const ProgramsGrid = () => {
  return (
    <section id="programs" className="bg-navy py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
            Our Programs
          </h2>
          <p className="text-xl text-light-grey max-w-2xl mx-auto">
            Explore our diverse range of programs designed to empower, educate, and inspire.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {programs.map((program) => (
            <ProgramCard key={program.slug} {...program} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsGrid;
