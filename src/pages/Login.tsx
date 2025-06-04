
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
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
import { Shield, CircleCheck, CheckCircle } from 'lucide-react';
import { MarketingHeader } from '@/components/Marketing/MarketingHeader';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-sky-50">
      <MarketingHeader />
      
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
          {/* Left Column - Login Form */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">התחברות</CardTitle>
              <CardDescription className="text-center">
                הזן את פרטי ההתחברות שלך להמשך
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">דואר אלקטרוני</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-right"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                      שכחת סיסמה?
                    </Link>
                    <Label htmlFor="password">סיסמה</Label>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-right"
                    required
                  />
                </div>
                
                {/* Remember me checkbox */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="checkbox"
                      id="remember"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="remember">זכור אותי</Label>
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'מתחבר...' : 'התחבר'}
                </Button>
                
                {/* Demo credentials */}
                <div className="bg-muted/50 p-3 rounded-md text-sm">
                  <p className="font-semibold mb-1">פרטי התחברות לדוגמה:</p>
                  <p>דוא"ל: test@example.com</p>
                  <p>סיסמה: password</p>
                </div>
                
                {/* Social Login Buttons */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">או התחבר באמצעות</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" type="button" disabled>
                    Google
                  </Button>
                  <Button variant="outline" type="button" disabled>
                    Microsoft
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-center w-full">
                אין לך חשבון?{' '}
                <Link to="/register" className="text-primary hover:underline">
                  הירשם
                </Link>
              </p>
            </CardFooter>
          </Card>
          
          {/* Right Column - Benefits */}
          <div className="hidden md:block text-right space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                ברוכים הבאים למערכת<br />ניהול החובות המתקדמת
              </h2>
              <p className="text-gray-600 text-lg">
                התחבר כדי להתחיל לנהל את החובות שלך ביעילות, לשלוח תזכורות חכמות, ולקבל תשלומים מהר יותר.
              </p>
            </div>
            
            <ul className="space-y-6">
              <li className="flex">
                <CheckCircle className="h-6 w-6 text-green-500 ml-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">מעקב מסודר אחר חובות</h3>
                  <p className="text-gray-600">קבל תמונה ברורה של כל החובות והתשלומים במקום אחד.</p>
                </div>
              </li>
              <li className="flex">
                <CheckCircle className="h-6 w-6 text-green-500 ml-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">תזכורות אוטומטיות</h3>
                  <p className="text-gray-600">חסוך זמן עם תזכורות אוטומטיות בדוא"ל או WhatsApp.</p>
                </div>
              </li>
              <li className="flex">
                <CheckCircle className="h-6 w-6 text-green-500 ml-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">ניתוח ביצועים מתקדם</h3>
                  <p className="text-gray-600">קבל תובנות מדויקות על דפוסי תשלום והצלחת גבייה.</p>
                </div>
              </li>
            </ul>
            
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-start">
                <Shield className="h-8 w-8 text-primary ml-4 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  כל הנתונים שלך מאובטחים עם הצפנת SSL מתקדמת. אנו מקפידים על תקני אבטחה מחמירים להגנה על המידע העסקי שלך.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
