
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { CustomerDialog } from '@/components/Customers/CustomerDialog';
import { CustomerDebts } from '@/components/Customers/CustomerDebts';
import { CustomerReminders } from '@/components/Customers/CustomerReminders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Customer, Debt, Reminder, getCustomerById, getDebtsByCustomerId, getRemindersByDebtId, customers, debts, reminders } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Edit, Mail, Phone, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const CustomerDetails = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerDebts, setCustomerDebts] = useState<Debt[]>([]);
  const [customerReminders, setCustomerReminders] = useState<Reminder[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Load customer data
  useEffect(() => {
    if (id) {
      // In a real app, this would fetch from an API
      const foundCustomer = getCustomerById(id);
      setCustomer(foundCustomer || null);

      if (foundCustomer) {
        const foundDebts = getDebtsByCustomerId(foundCustomer.id);
        setCustomerDebts(foundDebts);

        // Get all reminders for all customer's debts
        const allReminders: Reminder[] = [];
        foundDebts.forEach(debt => {
          const debtReminders = getRemindersByDebtId(debt.id);
          allReminders.push(...debtReminders);
        });
        
        setCustomerReminders(allReminders);
      }
    }
  }, [id]);

  // Handle edit customer
  const handleEditCustomer = (updatedCustomer: Customer) => {
    // In a real app, this would send a PUT request to the API
    setCustomer(updatedCustomer);
    
    // Update customer in the "database"
    const index = customers.findIndex(c => c.id === updatedCustomer.id);
    if (index !== -1) {
      customers[index] = { ...updatedCustomer, updatedAt: new Date() };
    }
    
    toast.success('הלקוח עודכן בהצלחה');
    setIsEditDialogOpen(false);
  };

  const handleDeleteCustomer = () => {
    if (!customer) return;
    
    // In a real app, this would send a DELETE request to the API
    const index = customers.findIndex(c => c.id === customer.id);
    if (index !== -1) {
      customers.splice(index, 1);
    }
    
    toast.success('הלקוח נמחק בהצלחה');
    navigate('/customers');
  };

  // Show loading state when authenticating
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">טוען...</p>
      </div>
    );
  }

  // Will redirect if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Show message if customer not found
  if (!customer) {
    return (
      <div className="min-h-screen flex">
        <Sidebar />
        
        <div className="flex-1">
          <Navbar />
          
          <main className="p-6">
            <Button variant="outline" onClick={() => navigate('/customers')} className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              חזרה לרשימת הלקוחות
            </Button>
            
            <div className="flex items-center justify-center min-h-[60vh]">
              <p className="text-lg text-muted-foreground">הלקוח לא נמצא</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      <div className="flex-1">
        <Navbar />
        
        <main className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <Button variant="outline" onClick={() => navigate('/customers')} className="mr-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                חזרה
              </Button>
              <h1 className="page-header">{customer.name}</h1>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                עריכה
              </Button>
              <Button variant="destructive" onClick={handleDeleteCustomer}>
                <Trash2 className="mr-2 h-4 w-4" />
                מחיקה
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>פרטי לקוח</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="font-medium">אימייל</p>
                      <p className="text-muted-foreground">{customer.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="font-medium">טלפון</p>
                      <p className="text-muted-foreground">{customer.phone}</p>
                    </div>
                  </div>
                  
                  {customer.notes && (
                    <div>
                      <p className="font-medium mb-1">הערות</p>
                      <p className="text-muted-foreground">{customer.notes}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="font-medium mb-1">תאריך הוספה</p>
                    <p className="text-muted-foreground">{formatDate(customer.createdAt)}</p>
                  </div>
                  
                  <div>
                    <p className="font-medium mb-1">עדכון אחרון</p>
                    <p className="text-muted-foreground">{formatDate(customer.updatedAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>סיכום חובות</CardTitle>
                <CardDescription>
                  סך הכל: {customerDebts.length} חובות
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CustomerDebts debts={customerDebts} customerId={customer.id} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>היסטוריית תזכורות</CardTitle>
              <CardDescription>
                {customerReminders.length} תזכורות נשלחו ללקוח זה
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CustomerReminders reminders={customerReminders} />
            </CardContent>
          </Card>
          
          <CustomerDialog 
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            customer={customer}
            onSubmit={handleEditCustomer}
            mode="edit"
          />
        </main>
      </div>
    </div>
  );
};

export default CustomerDetails;
