
import { ReactNode } from 'react';

interface BenefitCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  stat: string;
  statLabel: string;
}

export function BenefitCard({ icon, title, description, stat, statLabel }: BenefitCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-8 text-center flex flex-col items-center">
      <div className="bg-primary/10 p-4 rounded-full mb-6">
        <div className="text-primary">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <div className="mt-auto">
        <div className="text-4xl font-bold text-primary">{stat}</div>
        <div className="text-gray-500">{statLabel}</div>
      </div>
    </div>
  );
}
