"use client";

import React from 'react';
import Button from '../ui/Button';

const stats = [
  { number: '3,000+', label: 'Members' },
  { number: '50+', label: 'Events per Year' },
  { number: '4', label: 'Programs' },
  { number: '1', label: 'Mission' },
];

const RegistrationTeaser = () => {
  return (
    <section className="bg-navy py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl md:text-6xl font-extrabold text-neon-cyan mb-2">
                {stat.number}
              </div>
              <div className="text-xl text-light-grey">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-deep-black rounded-lg p-12 text-center border-2 border-neon-pink shadow-neon-pink">
          <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-xl text-light-grey mb-8 max-w-2xl mx-auto">
            Sign up today — identity verified, payment made easy. Join thousands of members making a difference.
          </p>
          <Button variant="secondary" size="lg" href="/register">
            Register Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RegistrationTeaser;
