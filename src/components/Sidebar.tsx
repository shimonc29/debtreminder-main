
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  CreditCard,
  BarChart, 
  FileText, 
  Users, 
  Settings as SettingsIcon, 
  BellRing, 
  LogOut, 
  User, 
  Mail, 
  Smartphone,
  Calendar,
  Menu,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';

export function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  
  const navItems = [
    {
      name: 'דשבורד',
      path: '/dashboard',
      icon: <BarChart className="h-5 w-5" />
    },
    {
      name: 'לקוחות',
      path: '/customers',
      icon: <Users className="h-5 w-5" />
    },
    {
      name: 'חובות',
      path: '/debts',
      icon: <CreditCard className="h-5 w-5" />
    },
    {
      name: 'תזכורות',
      path: '/reminders',
      icon: <BellRing className="h-5 w-5" />
    },
    {
      name: 'תבניות',
      path: '/templates',
      icon: <FileText className="h-5 w-5" />
    },
    {
      name: 'תוכניות ומחירים',
      path: '/pricing',
      icon: <Calendar className="h-5 w-5" />
    },
    {
      name: 'תגובות לקוחות',
      path: '/customer-responses',
      icon: <MessageSquare className="h-5 w-5" />
    }
  ];
  
  const accountItems = [
    {
      name: 'הפרופיל שלי',
      path: '/profile',
      icon: <User className="h-5 w-5" />
    },
    {
      name: 'הגדרות',
      path: '/settings',
      icon: <SettingsIcon className="h-5 w-5" />
    },
    {
      name: 'הגדרות תזכורות',
      path: '/reminders/settings',
      icon: <Mail className="h-5 w-5" />
    },
    {
      name: 'הגדרות WhatsApp',
      path: '/whatsapp/settings',
      icon: <Smartphone className="h-5 w-5" />
    }
  ];

  // Desktop sidebar
  const renderDesktopSidebar = () => (
    <div 
      className={cn(
        "h-screen bg-primary/10 text-foreground flex-shrink-0 fixed transition-all duration-300 z-10",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="h-full flex flex-col">
        <div className={cn(
          "flex items-center transition-all duration-300",
          isCollapsed ? "justify-center p-4" : "justify-between p-4 border-b border-border"
        )}>
          {!isCollapsed && (
            <Link to="/dashboard" className="flex items-center gap-2 text-primary">
              <CreditCard className="h-6 w-6" />
              <span className="text-xl font-bold">מערכת חובות</span>
            </Link>
          )}

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-primary"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-grow p-4 space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className={cn(
                "justify-start bg-primary text-primary-foreground",
                isCollapsed ? "w-8 h-8 p-0 flex justify-center mx-auto" : "w-full",
                isActive(item.path) ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
              )}
              asChild
            >
              <Link to={item.path} className={cn(
                "flex items-center",
                isCollapsed ? "justify-center" : "gap-2"
              )}>
                {item.icon}
                {!isCollapsed && item.name}
              </Link>
            </Button>
          ))}
        </div>
        
        <div className={cn(
          "p-4 space-y-1",
          isCollapsed ? "" : "border-t border-border"
        )}>
          {accountItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className={cn(
                "justify-start bg-primary text-primary-foreground",
                isCollapsed ? "w-8 h-8 p-0 flex justify-center mx-auto" : "w-full",
                isActive(item.path) ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
              )}
              asChild
            >
              <Link to={item.path} className={cn(
                "flex items-center",
                isCollapsed ? "justify-center" : "gap-2"
              )}>
                {item.icon}
                {!isCollapsed && item.name}
              </Link>
            </Button>
          ))}
          
          <Button
            variant="ghost"
            className={cn(
              "text-destructive bg-destructive/10 hover:text-destructive hover:bg-destructive/20",
              isCollapsed ? "w-8 h-8 p-0 flex justify-center mx-auto" : "w-full justify-start"
            )}
            onClick={logout}
          >
            <div className={cn(
              "flex items-center",
              isCollapsed ? "justify-center" : "gap-2"
            )}>
              <LogOut className="h-5 w-5" />
              {!isCollapsed && "התנתק"}
            </div>
          </Button>
        </div>
      </div>
    </div>
  );

  // Mobile sidebar (drawer)
  const renderMobileDrawer = () => (
    <div className="block md:hidden fixed top-0 left-0 z-50 p-4">
      <Drawer
        open={isMobileDrawerOpen}
        onOpenChange={setIsMobileDrawerOpen}
      >
        <DrawerTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center border-b pb-4">
              <Link to="/dashboard" className="flex items-center gap-2 text-primary">
                <CreditCard className="h-6 w-6" />
                <span className="text-xl font-bold">מערכת חובות</span>
              </Link>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsMobileDrawerOpen(false)}
              >
                <span className="sr-only">סגור</span>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.5 1.5L1.5 13.5M1.5 1.5L13.5 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground px-2">תפריט ראשי</p>
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      isActive(item.path) ? "bg-primary/15 text-primary font-medium" : ""
                    )}
                    asChild
                    onClick={() => setIsMobileDrawerOpen(false)}
                  >
                    <Link to={item.path} className="flex items-center gap-2">
                      {item.icon}
                      {item.name}
                    </Link>
                  </Button>
                ))}
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground px-2">הגדרות</p>
                {accountItems.map((item) => (
                  <Button
                    key={item.path}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      isActive(item.path) ? "bg-primary/15 text-primary font-medium" : ""
                    )}
                    asChild
                    onClick={() => setIsMobileDrawerOpen(false)}
                  >
                    <Link to={item.path} className="flex items-center gap-2">
                      {item.icon}
                      {item.name}
                    </Link>
                  </Button>
                ))}
                
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive bg-destructive/10 hover:text-destructive hover:bg-destructive/20"
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    logout();
                  }}
                >
                  <div className="flex items-center gap-2">
                    <LogOut className="h-5 w-5" />
                    התנתק
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        {renderDesktopSidebar()}
      </div>
      
      {/* Mobile drawer */}
      {renderMobileDrawer()}
      
      {/* Spacer to push content */}
      <div className={cn(
        "hidden md:block flex-shrink-0 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )} />
    </>
  );
}
