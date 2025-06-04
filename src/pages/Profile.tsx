
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';

const Profile = () => {
  const { isAuthenticated, loading, user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  
  // Default user profile state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    company: '',
    // These fields may not exist on the User type, so we'll handle them conditionally
    phoneNumber: '',
    address: '',
    taxId: '',
  });
  
  // Set profile state when user data is available
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        company: user.company || '',
        // Use optional chaining to handle potential missing properties
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        taxId: user.taxId || '',
      });
    }
  }, [user]);
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleProfileUpdate = async () => {
    try {
      await updateUserProfile({
        name: profile.name,
        company: profile.company,
        // Include other fields as needed, making sure they're valid for the User type
        phoneNumber: profile.phoneNumber,
        address: profile.address,
        taxId: profile.taxId,
      });
      toast.success('הפרופיל עודכן בהצלחה');
    } catch (error) {
      toast.error('שגיאה בעדכון הפרופיל');
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
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

  // Initial letters for avatar fallback
  const getInitials = () => {
    if (!profile.name) return "?";
    const names = profile.name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      <div className="flex-1">
        <Navbar />
        
        <main className="p-6">
          <h1 className="text-2xl font-bold mb-6">פרופיל אישי</h1>
          
          <div className="grid grid-cols-1 gap-6">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="personal">פרטים אישיים</TabsTrigger>
                <TabsTrigger value="subscription">מנוי ותשלומים</TabsTrigger>
                <TabsTrigger value="security">אבטחה</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle>פרטים אישיים</CardTitle>
                    <CardDescription>עדכן את הפרטים האישיים שלך</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src="/avatar-placeholder.png" alt={profile.name} />
                        <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1 text-center md:text-right">
                        <h3 className="text-xl font-medium">{profile.name}</h3>
                        <p className="text-sm text-muted-foreground">{profile.email}</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          שנה תמונה
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">שם מלא</Label>
                        <Input
                          id="name"
                          name="name" 
                          value={profile.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">דוא"ל</Label>
                        <Input
                          id="email"
                          name="email"
                          value={profile.email}
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">חברה</Label>
                        <Input
                          id="company"
                          name="company"
                          value={profile.company}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">טלפון</Label>
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          value={profile.phoneNumber}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">כתובת</Label>
                        <Input
                          id="address"
                          name="address"
                          value={profile.address}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="taxId">מספר עוסק / ח.פ.</Label>
                        <Input
                          id="taxId"
                          name="taxId"
                          value={profile.taxId}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={handleProfileUpdate}>שמור שינויים</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="subscription">
                <Card>
                  <CardHeader>
                    <CardTitle>מנוי ותשלומים</CardTitle>
                    <CardDescription>צפה ונהל את פרטי המנוי שלך</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 border rounded-lg bg-muted">
                      <h3 className="font-medium mb-2">המסלול הנוכחי שלך: חינמי</h3>
                      <p className="text-sm text-muted-foreground mb-4">נהנה מגישה לתכונות הבסיסיות של המערכת.</p>
                      <Button variant="default">שדרג עכשיו</Button>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3">היסטוריית תשלומים</h3>
                      <p className="text-sm text-muted-foreground">אין תשלומים קודמים.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>הגדרות אבטחה</CardTitle>
                    <CardDescription>נהל את הגדרות האבטחה של חשבונך</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">סיסמה נוכחית</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">סיסמה חדשה</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">אימות סיסמה חדשה</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button>עדכן סיסמה</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
