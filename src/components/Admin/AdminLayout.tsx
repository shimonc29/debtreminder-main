
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminNavbar } from './AdminNavbar';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const { isAuthenticated, isSuperAdmin, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading) {
      // Redirect if not authenticated or not super admin
      if (!isAuthenticated) {
        navigate('/admin/login');
      } else if (!isSuperAdmin) {
        navigate('/'); // Regular users can't access admin
      }
    }
  }, [isAuthenticated, isSuperAdmin, loading, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">טוען...</p>
      </div>
    );
  }
  
  if (!isAuthenticated || !isSuperAdmin) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="min-h-screen flex w-full">
      <AdminSidebar />
      
      <div className="flex-1 pl-64">
        <AdminNavbar title={title} />
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
