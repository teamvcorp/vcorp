"use client";

import React from 'react';

const ProgressBar = ({ currentStep, totalSteps, steps = [] }) => {
  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <React.Fragment key={stepNumber}>
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    text-lg font-bold transition-all duration-300
                    ${isCompleted ? 'bg-neon-cyan text-deep-black shadow-neon-cyan' : ''}
                    ${isActive ? 'bg-neon-pink text-white shadow-neon-pink animate-glow' : ''}
                    ${!isActive && !isCompleted ? 'bg-navy text-light-grey border-2 border-light-grey' : ''}
                  `}
                >
                  {isCompleted ? '✓' : stepNumber}
                </div>
                <span
                  className={`
                    mt-2 text-sm font-medium
                    ${isActive ? 'text-neon-pink' : ''}
                    ${isCompleted ? 'text-neon-cyan' : ''}
                    ${!isActive && !isCompleted ? 'text-light-grey' : ''}
                  `}
                >
                  {step}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-4 bg-navy rounded relative overflow-hidden">
                  <div
                    className={`
                      absolute top-0 left-0 h-full transition-all duration-500
                      ${isCompleted ? 'w-full bg-neon-cyan' : 'w-0'}
                    `}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
