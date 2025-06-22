import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  BellRing, 
  Calendar, 
  CheckCircle, 
  ChevronDown, 
  CircleDollarSign, 
  Clock, 
  Facebook, 
  Instagram, 
  Mail, 
  MessageSquare, 
  Shield, 
  Twitter, 
  Users,
} from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PricingTable } from "@/components/Marketing/PricingTable";
import { FeatureCard } from "@/components/Marketing/FeatureCard";
import { BenefitCard } from "@/components/Marketing/BenefitCard";
import { StepCard } from "@/components/Marketing/StepCard";
import { MarketingHeader } from "@/components/Marketing/MarketingHeader";
import { MarketingFooter } from "@/components/Marketing/MarketingFooter";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50 text-gray-800">
      <MarketingHeader />
      
      {/* Hero Section */}
      <section className="relative px-6 py-24 md:py-32 overflow-hidden">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-right">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-primary">
              נהל את החובות שלך בקלות. שלח תזכורות אוטומטיות. קבל תשלומים מהר יותר.
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-600">
              המערכת החכמה והפשוטה לניהול חובות ותזכורות תשלום
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-end gap-4">
              <Button size="lg" className="text-lg px-6 py-6 bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all">
                <Link to="/register">התחל עכשיו - חינם</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-6 py-6">
                <Link to="/login">כניסה למערכת</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="rounded-lg shadow-2xl overflow-hidden border-4 border-white">
              <img 
                src="/dashboard-preview.png" 
                alt="תצוגה מקדימה של הדשבורד" 
                className="w-full h-auto" 
                loading="lazy"
                onError={(e) => {
                  // Fallback in case image doesn't exist
                  e.currentTarget.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80";
                }}
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">התכונות המרכזיות</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 rtl">
            <FeatureCard 
              icon={<Users className="h-8 w-8 text-primary" />}
              title="ניהול לקוחות"
              description="מערכת חכמה לניהול פרטי הלקוחות, היסטוריית תשלומים ותקשורת מאובטחת."
              imageSrc="/features/customers.png"
            />
            <FeatureCard 
              icon={<CircleDollarSign className="h-8 w-8 text-primary" />}
              title="ניהול חובות"
              description="מעקב פשוט אחר חובות, תשלומים ויתרות בזמן אמת עם התראות על פיגורים."
              imageSrc="/features/debts.png"
            />
            <FeatureCard 
              icon={<BellRing className="h-8 w-8 text-primary" />}
              title="תזכורות אוטומטיות"
              description="מערכת תזכורות חכמה הנשלחת במייל או ב-WhatsApp עם תזמון מותאם אישית."
              imageSrc="/features/reminders.png"
            />
            <FeatureCard 
              icon={<BarChart3 className="h-8 w-8 text-primary" />}
              title="דשבורד מקיף"
              description="תצוגה ויזואלית מקיפה של מצב החובות, תשלומים וביצועים של העסק."
              imageSrc="/features/dashboard.png"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-sky-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">היתרונות והערך</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BenefitCard 
              icon={<Clock className="h-10 w-10" />}
              title="חיסכון של 5 שעות בשבוע"
              description="אוטומציה של תהליכי גבייה ותזכורות, המפנה זמן יקר לפיתוח העסק."
              stat="5+"
              statLabel="שעות בשבוע"
            />
            <BenefitCard 
              icon={<CircleDollarSign className="h-10 w-10" />}
              title="הגדלת שיעור הגבייה ב-30%"
              description="תזכורות יעילות ומעקב מדויק מגדילים משמעותית את שיעורי הגבייה."
              stat="30%"
              statLabel="שיפור בגבייה"
            />
            <BenefitCard 
              icon={<Shield className="h-10 w-10" />}
              title="פחות טעויות, פחות בעיות"
              description="מערכת מסודרת המונעת טעויות אנוש בניהול חובות ותשלומים."
              stat="90%"
              statLabel="פחות טעויות"
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">איך זה עובד</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <StepCard 
              number="1"
              title="הוסף לקוחות וחובות"
              description="הכנס את פרטי הלקוחות והחובות למערכת בממשק פשוט וידידותי."
              imageSrc="/steps/step1.png"
            />
            <StepCard 
              number="2"
              title="הגדר תזכורות אוטומטיות"
              description="קבע תזכורות חכמות שיישלחו אוטומטית במייל או ב-WhatsApp."
              imageSrc="/steps/step2.png"
            />
            <StepCard 
              number="3"
              title="קבל מעקב ועדכונים בזמן אמת"
              description="צפה בסטטוס התשלומים וקבל התראות אוטומטיות על פיגורים."
              imageSrc="/steps/step3.png"
            />
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-sky-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">השוואת מסלולים</h2>
          <PricingTable />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">שאלות נפוצות</h2>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-right">האם אני יכול להשתמש במערכת בחינם?</AccordionTrigger>
                <AccordionContent className="text-right">
                  כן, קיים מסלול חינמי הכולל את התכונות הבסיסיות. המסלול מאפשר ניהול של עד 5 לקוחות, 20 חובות בחודש ושליחת תזכורות במייל בלבד.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-right">אילו אמצעי תקשורת המערכת תומכת בהם?</AccordionTrigger>
                <AccordionContent className="text-right">
                  המערכת תומכת בשליחת תזכורות באמצעות דואר אלקטרוני לכל המשתמשים. למשתמשים במסלול בתשלום יש גם אפשרות לשליחת הודעות WhatsApp אוטומטיות.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-right">האם המערכת מאובטחת?</AccordionTrigger>
                <AccordionContent className="text-right">
                  כן, המערכת מאובטחת לחלוטין. אנו משתמשים בהצפנה מתקדמת לשמירת הנתונים, אימות דו-שלבי, וסטנדרטים מחמירים של אבטחת מידע לשמירה על פרטי הלקוחות והעסק שלך.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-right">האם ניתן לעצב תבניות מותאמות אישית?</AccordionTrigger>
                <AccordionContent className="text-right">
                  בהחלט! המערכת מציעה אפשרות ליצירת תבניות מותאמות אישית הן לאימייל והן להודעות WhatsApp. במסלול המתקדם, ניתן גם להוסיף את הלוגו של העסק ולהתאים את העיצוב לפי המיתוג שלך.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-right">כיצד מתבצע התשלום למערכת?</AccordionTrigger>
                <AccordionContent className="text-right">
                  התשלום מתבצע באמצעות כרטיס אשראי או PayPal, על בסיס מנוי חודשי או שנתי. תוכל לבטל את המנוי בכל עת. מנוי שנתי מגיע עם הנחה של 20% לעומת התשלום החודשי.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-right">האם ניתן לייצא נתונים מהמערכת?</AccordionTrigger>
                <AccordionContent className="text-right">
                  כן, המערכת מאפשרת ייצוא של כל הנתונים בפורמטים שונים כגון Excel, CSV ו-PDF. הדבר מאפשר לך לשמור גיבויים וליצור דוחות מותאמים אישית לפי הצורך.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
};

export default Landing;
