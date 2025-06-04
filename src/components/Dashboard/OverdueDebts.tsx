
import { debts, getCustomerById } from '@/lib/db';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { differenceInDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function OverdueDebts() {
  const navigate = useNavigate();
  
  // Get overdue debts
  const today = new Date();
  const overdueDebts = debts
    .filter(debt => debt.status === 'overdue')
    .sort((a, b) => {
      const daysLateA = differenceInDays(today, new Date(a.dueDate));
      const daysLateB = differenceInDays(today, new Date(b.dueDate));
      return daysLateB - daysLateA; // Sort by most overdue first
    });
  
  const getDaysLateText = (dueDate: Date) => {
    const daysLate = differenceInDays(today, new Date(dueDate));
    if (daysLate === 1) return 'יום 1 באיחור';
    return `${daysLate} ימים באיחור`;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>חובות באיחור</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {overdueDebts.length > 0 ? (
            overdueDebts.map(debt => {
              const customer = getCustomerById(debt.customerId);
              
              return (
                <div key={debt.id} className="border rounded-md p-3 bg-background">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{customer?.name}</h4>
                      <p className="text-sm text-muted-foreground">{debt.description}</p>
                    </div>
                    <Badge variant="destructive" className="whitespace-nowrap">
                      {getDaysLateText(debt.dueDate)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <div className="text-sm font-medium">{formatCurrency(debt.amount - debt.paidAmount)}</div>
                      <div className="text-xs text-muted-foreground">תאריך תשלום: {formatDate(debt.dueDate)}</div>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-destructive hover:bg-destructive/90"
                      onClick={() => navigate(`/debts/${debt.id}`)}
                    >
                      <Bell className="h-4 w-4 mr-1" />
                      שלח תזכורת
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              אין חובות באיחור
            </div>
          )}
          
          {overdueDebts.length > 0 && (
            <div className="text-center pt-2">
              <Button 
                variant="link" 
                onClick={() => navigate('/debts')}
              >
                לצפייה בכל החובות
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
