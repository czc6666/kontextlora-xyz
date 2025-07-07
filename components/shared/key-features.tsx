import { type LucideIcon } from 'lucide-react';
import React from 'react';

interface Feature {
  Icon: LucideIcon;
  title: string;
  description: string;
}

interface KeyFeaturesProps {
  features: Feature[];
}

export const KeyFeatures = ({ features }: KeyFeaturesProps) => {
  return (
    <section className="py-12">
      <div className="mx-auto px-4 md:px-6 max-w-5xl">
        <h2 className="text-3xl font-bold text-center mb-10">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary">
                  <feature.Icon className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-1 text-muted-foreground text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 