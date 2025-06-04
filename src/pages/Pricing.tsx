
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { MarketingHeader } from '@/components/Marketing/MarketingHeader';
import { MarketingFooter } from '@/components/Marketing/MarketingFooter';
import { PricingCard } from '@/components/Pricing/PricingCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';

const Pricing = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  
  // In a real application, this would be fetched from your backend
  const userSubscription = {
    plan: 'free', // 'free', 'pro', or 'enterprise'
    status: 'active',
    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  };
  
  const handleSubscribe = (plan: string) => {
    if (!isAuthenticated) {
      // Redirect to register if not logged in
      navigate('/register', { state: { redirectToPlan: plan } });
      return;
    }

    if (plan === 'enterprise') {
      // For enterprise plans, redirect to contact page or show contact modal
      navigate('/contact', { state: { subject: 'Enterprise Plan Inquiry' } });
      return;
    }

    if (plan === userSubscription.plan) {
      toast.info("אתה כבר מנוי למסלול זה");
      return;
    }

    // For regular plans, redirect to checkout page
    navigate('/checkout', { state: { plan } });
  };

  // Features for each plan
  const freePlanFeatures = [
    "עד 50 לקוחות",
    "עד 100 חובות",
    "עד 200 תזכורות בחודש",
    "תזכורות במייל בלבד",
    "דשבורד בסיסי",
    "גיבוי נתונים שבועי",
  ];

  const proPlanFeatures = [
    "לקוחות ללא הגבלה",
    "חובות ללא הגבלה",
    "תזכורות ללא הגבלה",
    "תזכורות במייל ו-WhatsApp",
    "דשבורד מתקדם עם אנליטיקות",
    "תבניות מותאמות אישית",
    "white-labeling (דומיין מותאם אישית)",
    "גיבוי נתונים יומי",
    "תמיכה בעדיפות גבוהה",
  ];

  const enterprisePlanFeatures = [
    "כל התכונות של מסלול Pro",
    "API מלא לאינטגרציה",
    "הגדרות אבטחה מתקדמות",
    "שירות הקמה וייעוץ",
    "מנהל לקוח ייעודי",
    "חוזה SLA מותאם",
    "התאמות ייחודיות לפי דרישה",
    "הדרכות למשתמשים",
  ];

  // Adjust pricing based on billing period
  const getProPrice = () => {
    return billingPeriod === 'monthly' ? '₪19.99' : '₪199.99';
  };

  const getDiscountMessage = () => {
    return billingPeriod === 'yearly' ? 'חסכון של 2 חודשים בחבילה שנתית!' : '';
  };

  // If authenticated, show with sidebar
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex">
        <Sidebar />
        
        <div className="flex-1">
          <Navbar />
          
          <main className="p-6">
            <h1 className="text-2xl font-bold mb-6">תוכניות ומחירים</h1>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>המסלול הנוכחי שלך</CardTitle>
                <CardDescription>
                  {userSubscription.plan === 'free' 
                    ? 'אתה משתמש כרגע במסלול החינמי' 
                    : userSubscription.plan === 'pro'
                      ? 'אתה מנוי למסלול Pro'
                      : 'אתה מנוי למסלול Enterprise'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-medium">
                    {userSubscription.plan === 'free' 
                      ? 'אתה יכול לשדרג בכל עת כדי לקבל גישה לתכונות נוספות' 
                      : `החיוב הבא שלך: ${userSubscription.nextBillingDate.toLocaleDateString('he-IL')}`}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <div className="mb-6 text-center">
              <Tabs 
                defaultValue="monthly" 
                value={billingPeriod}
                onValueChange={(v) => setBillingPeriod(v as 'monthly' | 'yearly')}
                className="inline-flex"
              >
                <TabsList>
                  <TabsTrigger value="monthly">חיוב חודשי</TabsTrigger>
                  <TabsTrigger value="yearly">חיוב שנתי</TabsTrigger>
                </TabsList>
              </Tabs>
              {getDiscountMessage() && (
                <p className="mt-2 text-sm text-green-600 font-medium">{getDiscountMessage()}</p>
              )}
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <PricingCard
                name="מסלול חינמי"
                description="לעסקים קטנים או לניסיון ראשוני"
                price="₪0"
                features={freePlanFeatures}
                buttonText={userSubscription.plan === 'free' ? 'המסלול הנוכחי שלך' : 'בחר מסלול זה'}
                buttonVariant={userSubscription.plan === 'free' ? 'outline' : 'default'}
                onSubscribe={() => handleSubscribe('free')}
                disabled={userSubscription.plan === 'free'}
              />
              
              <PricingCard
                name="מסלול Pro"
                description="לעסקים בצמיחה הדורשים פתרון מקיף"
                price={getProPrice()}
                period={billingPeriod === 'monthly' ? '/חודש' : '/שנה'}
                features={proPlanFeatures}
                popular={true}
                buttonText={userSubscription.plan === 'pro' ? 'המסלול הנוכחי שלך' : 'שדרג עכשיו'}
                buttonVariant={userSubscription.plan === 'pro' ? 'outline' : 'default'}
                onSubscribe={() => handleSubscribe('pro')}
                disabled={userSubscription.plan === 'pro'}
              />
              
              <PricingCard
                name="מסלול Enterprise"
                description="לעסקים גדולים הדורשים פתרון מותאם אישית"
                price="התאמה אישית"
                features={enterprisePlanFeatures}
                buttonText={userSubscription.plan === 'enterprise' ? 'המסלול הנוכחי שלך' : 'צור קשר'}
                buttonVariant={userSubscription.plan === 'enterprise' ? 'outline' : 'secondary'}
                onSubscribe={() => handleSubscribe('enterprise')}
                disabled={userSubscription.plan === 'enterprise'}
              />
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  // If not authenticated, show marketing layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50 text-gray-800">
      <MarketingHeader />
      
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">תוכניות ומחירים</h1>
          <p className="text-xl text-center text-gray-600 mb-12">בחר את המסלול המתאים לך</p>
          
          <div className="mb-12 text-center">
            <Tabs 
              defaultValue="monthly" 
              value={billingPeriod}
              onValueChange={(v) => setBillingPeriod(v as 'monthly' | 'yearly')}
              className="inline-flex"
            >
              <TabsList>
                <TabsTrigger value="monthly">חיוב חודשי</TabsTrigger>
                <TabsTrigger value="yearly">חיוב שנתי</TabsTrigger>
              </TabsList>
            </Tabs>
            {getDiscountMessage() && (
              <p className="mt-2 text-sm text-green-600 font-medium">{getDiscountMessage()}</p>
            )}
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard
              name="מסלול חינמי"
              description="לעסקים קטנים או לניסיון ראשוני"
              price="₪0"
              features={freePlanFeatures}
              buttonText="התחל עכשיו - חינם"
              onSubscribe={() => handleSubscribe('free')}
            />
            
            <PricingCard
              name="מסלול Pro"
              description="לעסקים בצמיחה הדורשים פתרון מקיף"
              price={getProPrice()}
              period={billingPeriod === 'monthly' ? '/חודש' : '/שנה'}
              features={proPlanFeatures}
              popular={true}
              buttonText="הצטרף עכשיו"
              onSubscribe={() => handleSubscribe('pro')}
            />
            
            <PricingCard
              name="מסלול Enterprise"
              description="לעסקים גדולים הדורשים פתרון מותאם אישית"
              price="התאמה אישית"
              features={enterprisePlanFeatures}
              buttonText="צור קשר"
              buttonVariant="secondary"
              onSubscribe={() => handleSubscribe('enterprise')}
            />
          </div>
        </div>
      </section>
      
      <MarketingFooter />
    </div>
  );
};

export default Pricing;
