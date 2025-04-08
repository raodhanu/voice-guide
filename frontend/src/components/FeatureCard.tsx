import React from "react";

interface Props {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function FeatureCard({ title, description, icon }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md transition-transform duration-300 hover:scale-105 border border-opacity-5 hover:border-opacity-10 border-primary dark:border-primary/30">
      <div className="flex items-center mb-4">
        <div className="mr-4 text-primary p-3 bg-secondary rounded-full">
          {icon}
        </div>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
