
import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  imageSrc: string;
}

export function FeatureCard({ icon, title, description, imageSrc }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-xl font-bold mr-3">{title}</h3>
      </div>
      <p className="text-gray-600 mb-6">{description}</p>
      <div className="mt-auto rounded-lg overflow-hidden border border-gray-100">
        <img 
          src={imageSrc} 
          alt={title} 
          className="w-full h-auto"
          onError={(e) => {
            // Fallback in case image doesn't exist
            e.currentTarget.src = "https://via.placeholder.com/300x200?text=תכונה";
          }}
        />
      </div>
    </div>
  );
}
