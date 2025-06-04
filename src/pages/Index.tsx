
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { DashboardOverview } from '@/components/Dashboard/DashboardOverview';
import { RecentActivity } from '@/components/Dashboard/RecentActivity';
import { DebtVisualizations } from '@/components/Dashboard/DebtVisualizations';
import { UpcomingDebts } from '@/components/Dashboard/UpcomingDebts';
import { OverdueDebts } from '@/components/Dashboard/OverdueDebts';
import { SystemNotifications } from '@/components/Dashboard/SystemNotifications';

const Dashboard = () => {
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
          <h1 className="page-header">דשבורד</h1>
          
          <DashboardOverview />
          
          <div className="mb-6">
            <DebtVisualizations />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <UpcomingDebts />
            <OverdueDebts />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivity />
            <SystemNotifications />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
