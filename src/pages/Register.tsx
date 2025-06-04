
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
import { CheckCircle, Shield } from 'lucide-react';
import { MarketingHeader } from '@/components/Marketing/MarketingHeader';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const { register, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError('הסיסמאות אינן תואמות');
      return;
    }
    
    setPasswordError('');
    await register(email, password, name, company);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-sky-50">
      <MarketingHeader />
      
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
          {/* Left Column - Registration Benefits */}
          <div className="hidden md:block text-right space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                קח את ניהול החובות שלך<br />לרמה הבאה
              </h2>
              <p className="text-gray-600 text-lg">
                הצטרף למערכת שכבר עזרה למאות עסקים לשפר את שיעורי הגבייה שלהם ולחסוך זמן יקר.
              </p>
            </div>
            
            <ul className="space-y-6">
              <li className="flex">
                <CheckCircle className="h-6 w-6 text-green-500 ml-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">התחל חינם</h3>
                  <p className="text-gray-600">ללא צורך בכרטיס אשראי. נסה את המערכת ללא התחייבות.</p>
                </div>
              </li>
              <li className="flex">
                <CheckCircle className="h-6 w-6 text-green-500 ml-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">התקנה מיידית</h3>
                  <p className="text-gray-600">תוכל להתחיל להשתמש במערכת תוך דקות ספורות.</p>
                </div>
              </li>
              <li className="flex">
                <CheckCircle className="h-6 w-6 text-green-500 ml-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">שדרג בכל עת</h3>
                  <p className="text-gray-600">התחל במסלול החינמי ושדרג כשהעסק שלך צומח.</p>
                </div>
              </li>
            </ul>
            
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-start">
                <Shield className="h-8 w-8 text-primary ml-4 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  הנתונים שלך מאובטחים. אנו מקפידים על תקנות GDPR ומשתמשים בהצפנה מתקדמת להגנה על כל המידע העסקי שלך.
                </p>
              </div>
            </div>
          </div>
          
          {/* Right Column - Registration Form */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">הרשמה</CardTitle>
              <CardDescription className="text-center">
                צור חשבון חדש להתחלת השימוש במערכת
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">שם מלא</Label>
                  <Input 
                    id="name" 
                    placeholder="ישראל ישראלי" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-right"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">שם החברה</Label>
                  <Input 
                    id="company" 
                    placeholder="החברה שלי בע״מ" 
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="text-right"
                    required
                  />
                </div>
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
                  <Label htmlFor="password">סיסמה</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">אימות סיסמה</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="••••••••" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="text-right"
                    required
                  />
                  {passwordError && (
                    <p className="text-sm text-destructive">{passwordError}</p>
                  )}
                </div>
                
                {/* Terms & Conditions Checkbox */}
                <div className="flex items-center space-x-2 space-x-reverse">
                  <input
                    type="checkbox"
                    id="terms"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    required
                  />
                  <Label htmlFor="terms" className="text-sm">
                    אני מסכים ל<Link to="/terms" className="text-primary hover:underline">תנאי השימוש</Link> ו<Link to="/privacy" className="text-primary hover:underline">מדיניות הפרטיות</Link>
                  </Label>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'נרשם...' : 'הרשם'}
                </Button>
                
                {/* Social Registration Buttons */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">או הירשם באמצעות</span>
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
                כבר יש לך חשבון?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  התחבר
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
