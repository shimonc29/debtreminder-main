
import { ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  name: string;
  description: string;
  price: string;
  period?: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
  buttonVariant?: "default" | "outline" | "secondary";
  onSubscribe: () => void;
  disabled?: boolean;
  children?: ReactNode;
}

export function PricingCard({
  name,
  description,
  price,
  period = "/חודש",
  features,
  popular = false,
  buttonText,
  buttonVariant = "default",
  onSubscribe,
  disabled = false,
  children
}: PricingCardProps) {
  return (
    <div className={cn(
      "bg-white rounded-xl shadow-md p-8 border-2 flex flex-col h-full",
      popular ? "border-primary relative" : "border-gray-100"
    )}>
      {popular && (
        <div className="absolute top-0 right-0 bg-yellow-400 text-primary px-3 py-1 font-medium transform rotate-0 translate-x-2 -translate-y-0 text-sm">
          פופולרי
        </div>
      )}
      
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      
      <div className="mb-6">
        <span className={cn("text-4xl font-bold", popular ? "text-primary" : "")}>{price}</span>
        {price !== "התאמה אישית" && <span className="text-gray-500">{period}</span>}
      </div>
      
      <Button 
        onClick={onSubscribe} 
        className="w-full mb-8" 
        variant={buttonVariant}
        disabled={disabled}
      >
        {buttonText}
      </Button>
      
      <ul className="space-y-3 mb-6 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check className="h-5 w-5 text-green-500 ml-2 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      {children}
    </div>
  );
}
