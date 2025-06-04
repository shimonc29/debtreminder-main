
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, we would send a request to the server to send a password reset email
      setIsSubmitted(true);
      toast.success("הוראות לאיפוס סיסמה נשלחו", {
        description: "אם האימייל קיים במערכת, תקבל הוראות לאיפוס הסיסמה",
      });
    } catch (error) {
      toast.error("שגיאה בשליחת הבקשה", {
        description: "אנא נסה שוב מאוחר יותר",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">שכחתי סיסמה</CardTitle>
            <CardDescription className="text-center">
              הזן את כתובת האימייל שלך ואנו נשלח לך הוראות לאיפוס הסיסמה
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="text-center space-y-4">
                <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <p>בדוק את האימייל שלך</p>
                <p className="text-sm text-muted-foreground">
                  אם קיים חשבון עבור {email}, שלחנו הוראות לאיפוס הסיסמה
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">דואר אלקטרוני</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'שולח הנחיות...' : 'שלח הנחיות לאיפוס'}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter>
            <p className="text-sm text-center w-full">
              <Link to="/login" className="text-primary hover:underline">
                חזרה למסך התחברות
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
