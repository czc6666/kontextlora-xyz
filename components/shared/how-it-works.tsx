import React from 'react';

interface Step {
  title: string;
  description: string;
}

interface HowItWorksProps {
  steps: Step[];
}

export const HowItWorks = ({ steps }: HowItWorksProps) => {
  return (
    <section className="py-12 bg-card border-y">
      <div className="mx-auto px-4 md:px-6 max-w-5xl">
        <h2 className="text-3xl font-bold text-center mb-10">How It Works: A Simple 3-Step Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-background p-6 rounded-lg shadow-sm border">
              <div className="mb-3">
                <span className="text-sm font-semibold text-primary">Step {index + 1}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 