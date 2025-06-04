
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const CheckoutSuccess = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">טוען...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      <div className="flex-1">
        <Navbar />
        
        <main className="p-6">
          <div className="max-w-lg mx-auto mt-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">תודה על ההזמנה!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>שדרוג התוכנית שלך הושלם בהצלחה.</p>
                <p>אתה כעת נהנה מכל היתרונות של התוכנית החדשה שלך!</p>
                
                <div className="bg-muted p-4 rounded-md mt-6 text-right">
                  <h3 className="font-medium mb-2">המסלול שלך: Pro</h3>
                  <p className="text-sm text-muted-foreground">תאריך התחלה: {new Date().toLocaleDateString('he-IL')}</p>
                  <p className="text-sm text-muted-foreground">
                    החיוב הבא: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('he-IL')}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="justify-center space-x-4 space-x-reverse">
                <Button variant="outline" asChild>
                  <Link to="/profile">צפה בפרטי המנוי</Link>
                </Button>
                <Button asChild>
                  <Link to="/dashboard">לדשבורד</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
