"use client";

import React from 'react';
import ProgramsGrid from '../components/sections/ProgramsGrid';
import Button from '../components/ui/Button';

const ProgramsPage: React.FC = () => {
    return (
        <main className="flex-1 bg-deep-black">
            {/* Hero Section */}
            <section className="bg-navy py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6">
                        Our Programs
                    </h1>
                    <p className="text-2xl text-light-grey mb-8 leading-relaxed">
                        Discover the diverse range of programs designed to empower individuals, 
                        strengthen communities, and create lasting impact through education and innovation.
                    </p>
                    <Button variant="primary" size="lg" href="/register">
                        Register Now
                    </Button>
                </div>
            </section>

            <ProgramsGrid />
        </main>
    );
};

export default ProgramsPage;