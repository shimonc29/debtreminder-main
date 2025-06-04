
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Shield, ShieldAlert } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const { adminLogin, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (showTwoFactor) {
      await adminLogin(email, password, twoFactorCode);
    } else {
      await adminLogin(email, password);
      setShowTwoFactor(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <ShieldAlert size={36} className="text-primary" />
            </div>
            <CardTitle className="text-2xl text-center">התחברות מנהל מערכת</CardTitle>
            <CardDescription className="text-center">
              גישה למערכת ניהול בלבד למשתמשים מורשים
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!showTwoFactor ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">דואר אלקטרוני</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="admin@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      required
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="twoFactorCode">קוד אימות דו-שלבי</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    הזן את קוד האימות שקיבלת במכשיר הנייד שלך
                  </p>
                  <div className="flex justify-center py-4">
                    <InputOTP maxLength={6} value={twoFactorCode} onChange={setTwoFactorCode}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <div className="text-sm text-center text-muted-foreground mt-2">
                    (קוד לדוגמה: 123456)
                  </div>
                </div>
              )}
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'מתחבר...' : (showTwoFactor ? 'אימות' : 'התחבר')}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <div className="flex items-center justify-center w-full text-sm">
              <Shield className="h-4 w-4 mr-2" />
              <p className="text-muted-foreground">מאובטח בגישת אימות כפול</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
