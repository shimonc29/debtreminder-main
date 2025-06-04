
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { reminders, customers, debts, getCustomerById, getTemplateById } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { RemindersTable } from '@/components/Reminders/RemindersTable';
import { RemindersFilter } from '@/components/Reminders/RemindersFilter';
import { ReminderDialog } from '@/components/Reminders/ReminderDialog';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

const RemindersPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [filteredReminders, setFilteredReminders] = useState(reminders);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);
  
  const handleSendManualReminder = () => {
    setIsDialogOpen(true);
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
  
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      <div className="flex-1">
        <Navbar />
        
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="page-header">ניהול תזכורות</h1>
            <Button onClick={handleSendManualReminder}>
              <Send className="ml-2 h-4 w-4" />
              שלח תזכורת ידנית
            </Button>
          </div>
          
          <RemindersFilter setFilteredReminders={setFilteredReminders} />
          
          <div className="mt-6">
            <RemindersTable reminders={filteredReminders} />
          </div>
          
          <ReminderDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        </main>
      </div>
    </div>
  );
};

export default RemindersPage;
