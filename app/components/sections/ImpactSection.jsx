"use client";

import React from 'react';
import FeatureCard from '../cards/FeatureCard';
import { 
  FaTools, 
  FaUsers, 
  FaHeart, 
  FaLaptop 
} from 'react-icons/fa';

const features = [
  {
    icon: FaTools,
    title: 'Build Skills',
    description: 'Develop practical skills that make a real difference in your life and career.',
    accentColor: 'neon-cyan',
  },
  {
    icon: FaUsers,
    title: 'Join Community',
    description: 'Connect with like-minded individuals and build lasting relationships.',
    accentColor: 'neon-pink',
  },
  {
    icon: FaHeart,
    title: 'Support Others',
    description: 'Make a positive impact in your community through meaningful contribution.',
    accentColor: 'electric-blue',
  },
  {
    icon: FaLaptop,
    title: 'Flexible Online',
    description: 'Learn and participate on your schedule with our online programs.',
    accentColor: 'neon-purple',
  },
];

const ImpactSection = () => {
  return (
    <section className="bg-deep-black py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
            Why Join Us?
          </h2>
          <p className="text-xl text-light-grey max-w-2xl mx-auto">
            Discover the benefits of being part of our growing community.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
