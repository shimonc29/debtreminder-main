
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-2xl font-semibold mb-6">העמוד לא נמצא</p>
        <p className="text-muted-foreground mb-8 max-w-md">
          נראה שהעמוד שחיפשת לא קיים או הוסר.
        </p>
        <Button asChild>
          <Link to="/">חזרה לדף הבית</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
