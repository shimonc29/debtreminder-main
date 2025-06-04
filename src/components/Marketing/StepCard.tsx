
interface StepCardProps {
  number: string;
  title: string;
  description: string;
  imageSrc: string;
}

export function StepCard({ number, title, description, imageSrc }: StepCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="bg-primary text-white font-bold text-xl rounded-full w-12 h-12 flex items-center justify-center mb-4">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <div className="rounded-lg overflow-hidden border-2 border-gray-100 shadow-lg">
        <img 
          src={imageSrc} 
          alt={`שלב ${number}: ${title}`} 
          className="w-full h-auto"
          onError={(e) => {
            // Fallback in case image doesn't exist
            e.currentTarget.src = "https://via.placeholder.com/300x200?text=שלב";
          }}
        />
      </div>
    </div>
  );
}
