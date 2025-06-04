
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { CustomerResponses } from '@/components/Reminders/CustomerResponses';
import { Button } from '@/components/ui/button';
import { MessageSquare, Calendar, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CustomerResponsesPage = () => {
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="page-header">תגובות לקוחות לתזכורות</h1>
          </div>
          
          <Tabs defaultValue="pending" className="mb-6">
            <TabsList>
              <TabsTrigger value="pending">
                ממתינות לאימות
              </TabsTrigger>
              <TabsTrigger value="all">
                כל התגובות
              </TabsTrigger>
              <TabsTrigger value="verified">
                מאומתות
              </TabsTrigger>
              <TabsTrigger value="rejected">
                נדחו
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending" className="mt-4">
              <CustomerResponses />
            </TabsContent>
            
            <TabsContent value="all" className="mt-4">
              <CustomerResponses />
            </TabsContent>
            
            <TabsContent value="verified" className="mt-4">
              <CustomerResponses />
            </TabsContent>
            
            <TabsContent value="rejected" className="mt-4">
              <CustomerResponses />
            </TabsContent>
          </Tabs>
          
          <div className="bg-muted p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">איך זה עובד?</h3>
            <p className="mb-2">
              הלקוחות יכולים להגיב לתזכורות התשלום באמצעות אימייל או וואטסאפ ולסמן "כבר שילמתי".
            </p>
            <p className="mb-2">
              התגובות מופיעות כאן כדי שתוכל לבדוק ולאמת את התשלומים.
            </p>
            <p>
              לאחר אימות תשלום, החוב יסומן כשולם במערכת.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerResponsesPage;
