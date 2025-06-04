
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, description, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn("dashboard-card", className)}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="text-2xl font-bold mt-1">{value}</div>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          
          {trend && (
            <div className="flex items-center mt-2">
              <span className={cn("text-xs font-medium me-1",
                trend.positive ? "text-green-600" : "text-red-600"
              )}>
                {trend.positive ? "+" : ""}{trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="p-2 bg-primary/10 rounded-full">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
