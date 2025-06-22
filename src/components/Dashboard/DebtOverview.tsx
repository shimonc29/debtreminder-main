import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { debts, getCustomerById } from '@/lib/db';
import { format } from 'date-fns';
import { useMemo } from 'react';

export function DebtOverview() {
  // Group debts by status (memoized for performance)
  const overdueDebts = useMemo(() => debts.filter(debt => debt.status === "overdue"), []);
  const pendingDebts = useMemo(() => debts.filter(debt => debt.status === "pending"), []);
  const partiallyPaidDebts = useMemo(() => debts.filter(debt => debt.status === "partially_paid"), []);
  
  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('he-IL', { 
      style: 'currency', 
      currency: currency 
    }).format(amount);
  };

  // Format date
  const formatDateString = (date: Date) => {
    return format(date, 'dd/MM/yyyy');
  };
  
  // Get remaining amount
  const getRemainingAmount = (debt: typeof debts[0]) => {
    return formatCurrency(debt.amount - debt.paidAmount, debt.currency);
  };
  
  // Status badge class
  const getStatusClass = (status: string) => {
    switch (status) {
      case "overdue": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "partially_paid": return "bg-blue-100 text-blue-800";
      case "paid": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  // Status display text
  const getStatusText = (status: string) => {
    switch (status) {
      case "overdue": return "באיחור";
      case "pending": return "ממתין";
      case "partially_paid": return "שולם חלקית";
      case "paid": return "שולם";
      default: return status;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>סקירת חובות</CardTitle>
        <CardDescription>מצב חובות נוכחי</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overdue debts */}
          <section aria-labelledby="overdue-debts-title" role="region">
            <h3 id="overdue-debts-title" className="font-semibold text-red-600 mb-2">באיחור</h3>
            {overdueDebts.length > 0 ? (
              <div className="space-y-2 flex flex-col">
                {overdueDebts.map(debt => {
                  const customer = getCustomerById(debt.customerId);
                  return (
                    <div 
                      key={debt.id} 
                      className="flex flex-wrap md:flex-nowrap justify-between items-center p-3 border rounded-lg bg-red-50"
                      role="article"
                      aria-label={`חוב באיחור עבור ${customer?.name || 'לקוח לא ידוע'}`}
                    >
                      <div>
                        <p className="font-medium">{customer?.name || <span className="text-red-500">לקוח לא ידוע</span>}</p>
                        <p className="text-sm text-muted-foreground">
                          {debt.description} - חשבונית {debt.invoiceNumber}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{getRemainingAmount(debt)}</p>
                        <p className="text-sm text-red-600">
                          תאריך יעד: {formatDateString(debt.dueDate)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">אין חובות באיחור</p>
            )}
          </section>
          
          {/* Pending debts */}
          <section aria-labelledby="pending-debts-title" role="region">
            <h3 id="pending-debts-title" className="font-semibold text-yellow-600 mb-2">ממתינים לתשלום</h3>
            {pendingDebts.length > 0 ? (
              <div className="space-y-2 flex flex-col">
                {pendingDebts.map(debt => {
                  const customer = getCustomerById(debt.customerId);
                  return (
                    <div 
                      key={debt.id} 
                      className="flex flex-wrap md:flex-nowrap justify-between items-center p-3 border rounded-lg"
                      role="article"
                      aria-label={`חוב ממתין עבור ${customer?.name || 'לקוח לא ידוע'}`}
                    >
                      <div>
                        <p className="font-medium">{customer?.name || <span className="text-red-500">לקוח לא ידוע</span>}</p>
                        <p className="text-sm text-muted-foreground">
                          {debt.description} - חשבונית {debt.invoiceNumber}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{getRemainingAmount(debt)}</p>
                        <p className="text-sm">תאריך יעד: {formatDateString(debt.dueDate)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">אין חובות ממתינים</p>
            )}
          </section>
          
          {/* Partially paid debts */}
          <section aria-labelledby="partially-paid-debts-title" role="region">
            <h3 id="partially-paid-debts-title" className="font-semibold text-blue-600 mb-2">שולמו חלקית</h3>
            {partiallyPaidDebts.length > 0 ? (
              <div className="space-y-2 flex flex-col">
                {partiallyPaidDebts.map(debt => {
                  const customer = getCustomerById(debt.customerId);
                  const percentPaid = Math.round((debt.paidAmount / debt.amount) * 100);
                  return (
                    <div 
                      key={debt.id} 
                      className="flex flex-wrap md:flex-nowrap justify-between items-center p-3 border rounded-lg"
                      role="article"
                      aria-label={`חוב ששולם חלקית עבור ${customer?.name || 'לקוח לא ידוע'}`}
                    >
                      <div>
                        <p className="font-medium">{customer?.name || <span className="text-red-500">לקוח לא ידוע</span>}</p>
                        <p className="text-sm text-muted-foreground">
                          {debt.description} - חשבונית {debt.invoiceNumber}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <p className="font-bold">{getRemainingAmount(debt)}</p>
                          <span 
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full"
                            aria-label={`שולם ${percentPaid} אחוזים`}
                            role="status"
                          >
                            {percentPaid}% שולם
                          </span>
                        </div>
                        <p className="text-sm">תאריך יעד: {formatDateString(debt.dueDate)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">אין חובות ששולמו חלקית</p>
            )}
          </section>
        </div>
      </CardContent>
    </Card>
  );
}
