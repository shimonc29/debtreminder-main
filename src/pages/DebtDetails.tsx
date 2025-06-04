import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { debts, getCustomerById, getRemindersByDebtId, Debt } from '@/lib/db';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DebtDialog } from '@/components/Debts/DebtDialog';
import { CustomerReminders } from '@/components/Customers/CustomerReminders';
import { Pencil, Send, CircleCheck, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const DebtDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [debt, setDebt] = useState<Debt | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [partialPayment, setPartialPayment] = useState<number | undefined>();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);
  
  useEffect(() => {
    if (id) {
      const foundDebt = debts.find(d => d.id === id);
      setDebt(foundDebt || null);
    }
  }, [id]);
  
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
  
  if (!debt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">החוב לא נמצא</p>
      </div>
    );
  }
  
  const customer = getCustomerById(debt.customerId);
  const reminders = getRemindersByDebtId(debt.id);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">ממתין</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">באיחור</Badge>;
      case 'partially_paid':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">שולם חלקית</Badge>;
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">שולם</Badge>;
      case 'payment_claimed':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">נטען ששולם</Badge>;
      default:
        return null;
    }
  };
  
  const handleSendReminder = () => {
    // Add toast notification to show that the reminder was sent
    toast.success("תזכורת נשלחה בהצלחה", {
      description: "התזכורת נשלחה ללקוח באמצעות האימייל",
    });
  };
  
  const handleMarkAsPaid = () => {
    toast.success("החוב סומן כשולם", {
      description: "סטטוס החוב עודכן בהצלחה",
    });
  };

  const handleVerifyPaymentClaim = () => {
    navigate('/customer-responses');
  };
  
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      <div className="flex-1">
        <Navbar />
        
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="page-header">פרטי חוב</h1>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Pencil className="h-4 w-4 ml-2" />
                ערוך
              </Button>
              
              {debt.status !== 'paid' && debt.status !== 'payment_claimed' && (
                <>
                  <Button 
                    variant="outline"
                    onClick={handleSendReminder}
                  >
                    <Send className="h-4 w-4 ml-2" />
                    שלח תזכורת
                  </Button>
                  
                  <Button 
                    variant="default"
                    onClick={handleMarkAsPaid}
                  >
                    <CircleCheck className="h-4 w-4 ml-2" />
                    סמן כשולם
                  </Button>
                </>
              )}

              {debt.status === 'payment_claimed' && (
                <Button 
                  variant="default"
                  onClick={handleVerifyPaymentClaim}
                >
                  <AlertTriangle className="h-4 w-4 ml-2" />
                  אמת טענת תשלום
                </Button>
              )}
            </div>
          </div>
          
          {/* Debt Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>פרטי החוב</CardTitle>
                <CardDescription>
                  חשבונית {debt.invoiceNumber}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">סכום</p>
                    <p className="text-lg font-medium" dir="ltr">{formatCurrency(debt.amount, debt.currency)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">סטטוס</p>
                    <div className="flex items-center mt-1">
                      {getStatusBadge(debt.status)}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">תאריך חשבונית</p>
                    <p>{formatDate(debt.invoiceDate)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">תאריך יעד לתשלום</p>
                    <p>{formatDate(debt.dueDate)}</p>
                  </div>
                  
                  {debt.status === 'partially_paid' && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">סכום ששולם</p>
                        <p className="text-lg font-medium" dir="ltr">{formatCurrency(debt.paidAmount, debt.currency)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">נותר לתשלום</p>
                        <p className="text-lg font-medium" dir="ltr">{formatCurrency(debt.amount - debt.paidAmount, debt.currency)}</p>
                      </div>
                    </>
                  )}
                  
                  {debt.paidDate && (
                    <div>
                      <p className="text-sm text-muted-foreground">תאריך תשלום</p>
                      <p>{formatDate(debt.paidDate)}</p>
                    </div>
                  )}

                  {debt.status === 'payment_claimed' && (
                    <div className="col-span-2 bg-yellow-50 p-3 rounded border border-yellow-200">
                      <p className="font-medium text-yellow-800">הלקוח טוען ששילם</p>
                      <p className="text-sm text-yellow-700 mt-1">
                        הלקוח השיב לתזכורת התשלום וטוען ששילם את החוב.
                        יש לבדוק את הפרטים ולאמת את התשלום.
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-2 border-yellow-300 text-yellow-800 hover:bg-yellow-100"
                        size="sm"
                        onClick={handleVerifyPaymentClaim}
                      >
                        בדוק טענת תשלום
                      </Button>
                    </div>
                  )}
                </div>
                
                {debt.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">תיאור</p>
                    <p>{debt.description}</p>
                  </div>
                )}
                
                {debt.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">הערות</p>
                    <p>{debt.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Customer Details */}
            <Card>
              <CardHeader>
                <CardTitle>פרטי לקוח</CardTitle>
                <CardDescription>
                  {customer?.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {customer && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">שם</p>
                      <p className="font-medium">{customer.name}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">אימייל</p>
                      <p>{customer.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">טלפון</p>
                      <p dir="ltr">{customer.phone}</p>
                    </div>
                    
                    {customer.notes && (
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">הערות</p>
                        <p>{customer.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/customers/${customer?.id}`)}
                >
                  צפה בכרטיס לקוח
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Reminders History */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">היסטוריית תזכורות</h2>
            <CustomerReminders reminders={reminders} />
          </div>
          
          {/* Edit Debt Dialog */}
          <DebtDialog
            open={isEditDialogOpen}
            debt={debt}
            onOpenChange={setIsEditDialogOpen}
          />
        </main>
      </div>
    </div>
  );
};

export default DebtDetailsPage;
