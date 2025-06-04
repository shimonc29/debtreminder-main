
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { CircleDollarSign, CreditCard } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface LocationState {
  plan?: string;
}

interface PlanDetail {
  name: string;
  price: number | string;
  features: string[];
}

interface PlanDetails {
  [key: string]: PlanDetail;
}

const Checkout = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { plan = 'pro' } = (location.state as LocationState) || {};

  // Plan details
  const planDetails: PlanDetails = {
    free: {
      name: 'מסלול חינמי',
      price: 0,
      features: ['עד 50 לקוחות', 'עד 100 חובות', 'תזכורות במייל בלבד'],
    },
    pro: {
      name: 'מסלול Pro',
      price: 19.99,
      features: ['לקוחות ללא הגבלה', 'חובות ללא הגבלה', 'תזכורות במייל ו-WhatsApp'],
    },
    enterprise: {
      name: 'מסלול Enterprise',
      price: 'התאמה אישית',
      features: ['כל התכונות של מסלול Pro', 'מנהל לקוח ייעודי', 'התאמות ייחודיות'],
    },
  };

  // Check authentication and redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { state: { redirectTo: '/checkout', plan } });
    }
  }, [isAuthenticated, loading, navigate, plan]);

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock API call - in a real app, this would call your Stripe integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful checkout
      toast.success('תהליך התשלום הושלם בהצלחה!', {
        description: `נרשמת בהצלחה ל${planDetails[plan as keyof typeof planDetails].name}`,
      });
      
      // Redirect to success page
      navigate('/checkout/success');
    } catch (error) {
      setError('אירעה שגיאה בתהליך התשלום. אנא נסה שנית מאוחר יותר.');
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  // Redirect for enterprise plan
  if (plan === 'enterprise') {
    navigate('/contact', { state: { subject: 'Enterprise Plan Inquiry' } });
    return null;
  }

  // Handle free plan directly
  if (plan === 'free') {
    navigate('/checkout/success');
    return null;
  }

  const selectedPlan = planDetails[plan as keyof typeof planDetails];
  
  // Calculate price safely ensuring we're working with numbers
  const planPrice = typeof selectedPlan.price === 'number' ? selectedPlan.price : 0;
  const vatAmount = planPrice * 0.17;
  const totalPrice = planPrice * 1.17;

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      <div className="flex-1">
        <Navbar />
        
        <main className="p-6">
          <h1 className="text-2xl font-bold mb-6">השלמת הרכישה</h1>
          
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>מידע על התשלום</CardTitle>
                  <CardDescription>השלם את פרטי התשלום שלך</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm mb-2">שים לב: זו הדגמה בלבד</p>
                      <p className="text-sm">בהמשך ההטמעה, כאן יופיע טופס תשלום מאובטח באמצעות Stripe</p>
                    </div>
                    
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <CreditCard className="h-6 w-6 text-muted-foreground" />
                        <div>
                          <p className="font-medium">כרטיס אשראי</p>
                          <p className="text-sm text-muted-foreground">תשלום מאובטח באמצעות Stripe</p>
                        </div>
                      </div>
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertTitle>שגיאה</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/pricing')}
                  >
                    חזור לתוכניות
                  </Button>
                  <Button 
                    onClick={handleCheckout}
                    disabled={isLoading}
                  >
                    {isLoading ? 'מעבד תשלום...' : 'השלם תשלום'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>סיכום הזמנה</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium text-lg">{selectedPlan.name}</p>
                    <p className="text-muted-foreground">חיוב חודשי</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-1">
                    <h4 className="font-medium">תכונות כלולות:</h4>
                    <ul className="text-sm space-y-1">
                      {selectedPlan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="ml-2">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div className="pt-2">
                    <div className="flex justify-between">
                      <span>סכום חודשי:</span>
                      <span>₪{typeof selectedPlan.price === 'number' ? selectedPlan.price.toFixed(2) : selectedPlan.price}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>מע"מ (17%):</span>
                      <span>₪{vatAmount.toFixed(2)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span>סה"כ לתשלום:</span>
                      <span>₪{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Checkout;
