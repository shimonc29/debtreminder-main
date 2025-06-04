import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { toast } from '@/components/ui/use-toast';

// Enhanced user type with roles
export type UserRole = 'user' | 'admin' | 'super_admin';

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  company?: string;
  role: UserRole;
  phone?: string;
  created_at?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string, twoFactorCode?: string) => Promise<void>;
  register: (email: string, password: string, name: string, company: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  updateUserProfile: (userData: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      
      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (authUser: User) => {
    try {
      // Check if user profile exists in our custom profiles table (if you want to create one)
      // For now, we'll create a basic profile from the auth user
      const userProfile: UserProfile = {
        id: authUser.id,
        email: authUser.email!,
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0],
        company: authUser.user_metadata?.company,
        role: authUser.email === 'shimonc29@gmail.com' ? 'super_admin' : 'user',
        phone: authUser.user_metadata?.phone,
        created_at: authUser.created_at,
      };
      
      setUser(userProfile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          variant: 'destructive',
          title: 'שגיאת התחברות',
          description: error.message === 'Invalid login credentials' 
            ? 'שם משתמש או סיסמה שגויים' 
            : 'אירעה שגיאה בתהליך ההתחברות',
        });
        return;
      }

      if (data.user) {
        toast({
          title: 'התחברת בהצלחה',
          description: 'ברוך הבא למערכת',
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: 'destructive',
        title: 'שגיאת התחברות',
        description: 'אירעה שגיאה בתהליך ההתחברות',
      });
    } finally {
      setLoading(false);
    }
  };

  // Admin login with 2FA support (keeping your existing logic)
  const adminLogin = async (email: string, password: string, twoFactorCode?: string) => {
    setLoading(true);
    
    try {
      // Check if this is an admin email
      if (email === 'shimonc29@gmail.com') {
        if (!twoFactorCode) {
          // First step - request 2FA code
          toast({
            title: 'קוד אימות נשלח',
            description: 'הזן את קוד האימות שקיבלת (123456 לדמו)',
          });
          setLoading(false);
          return;
        }
        
        // Validate 2FA code
        if (twoFactorCode !== '123456') {
          toast({
            variant: 'destructive',
            title: 'קוד אימות שגוי',
            description: 'אנא נסה שנית',
          });
          setLoading(false);
          return;
        }
      }

      // Regular Supabase login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          variant: 'destructive',
          title: 'שגיאת התחברות',
          description: 'פרטי התחברות שגויים',
        });
        return;
      }

      if (data.user) {
        toast({
          title: email === 'shimonc29@gmail.com' ? 'התחברת בהצלחה כמנהל מערכת' : 'התחברת בהצלחה',
          description: email === 'shimonc29@gmail.com' ? 'ברוך הבא לממשק הניהול' : 'ברוך הבא למערכת',
        });
        
        navigate(email === 'shimonc29@gmail.com' ? '/admin/dashboard' : '/dashboard');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast({
        variant: 'destructive',
        title: 'שגיאת התחברות',
        description: 'אירעה שגיאה בתהליך ההתחברות',
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, company: string) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            company,
          }
        }
      });

      if (error) {
        toast({
          variant: 'destructive',
          title: 'שגיאת הרשמה',
          description: error.message,
        });
        return;
      }

      if (data.user) {
        toast({
          title: 'נרשמת בהצלחה',
          description: 'בדוק את תיבת המייל שלך לאימות החשבון',
        });
        // Don't navigate immediately - user needs to verify email
        // navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        variant: 'destructive',
        title: 'שגיאת הרשמה',
        description: 'אירעה שגיאה בתהליך ההרשמה',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (userData: Partial<UserProfile>) => {
    setLoading(true);
    
    try {
      // Update auth metadata
      const { error } = await supabase.auth.updateUser({
        data: userData
      });

      if (error) {
        throw error;
      }

      // Update local user state
      if (user) {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
      }

      toast({
        title: 'פרופיל עודכן',
        description: 'פרטי המשתמש עודכנו בהצלחה',
      });
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        variant: 'destructive',
        title: 'שגיאת עדכון',
        description: 'אירעה שגיאה בתהליך עדכון הפרופיל',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      navigate('/login');
      toast({
        title: 'התנתקת בהצלחה',
        description: 'להתראות בקרוב',
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: 'destructive',
        title: 'שגיאה',
        description: 'אירעה שגיאה בתהליך ההתנתקות',
      });
    }
  };

  // Check admin status
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isSuperAdmin = user?.role === 'super_admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      loading, 
      login, 
      adminLogin,
      register, 
      logout, 
      updateUserProfile,
      isAuthenticated: !!user,
      isAdmin,
      isSuperAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}