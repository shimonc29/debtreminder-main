
import { debts, getCustomerById } from '@/lib/db';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { differenceInDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function UpcomingDebts() {
  const navigate = useNavigate();
  
  // Get debts due in the next 7 days
  const today = new Date();
  const upcomingDebts = debts
    .filter(debt => {
      if (debt.status === 'paid') return false;
      const daysUntilDue = differenceInDays(new Date(debt.dueDate), today);
      return daysUntilDue >= 0 && daysUntilDue <= 7;
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
  const getDaysLeftText = (dueDate: Date) => {
    const daysLeft = differenceInDays(new Date(dueDate), today);
    if (daysLeft === 0) return 'היום';
    if (daysLeft === 1) return 'מחר';
    return `בעוד ${daysLeft} ימים`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>חובות קרובים לתשלום</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingDebts.length > 0 ? (
            upcomingDebts.map(debt => {
              const customer = getCustomerById(debt.customerId);
              
              return (
                <div key={debt.id} className="border rounded-md p-3 bg-background">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{customer?.name}</h4>
                      <p className="text-sm text-muted-foreground">{debt.description}</p>
                    </div>
                    <Badge className="whitespace-nowrap">{getDaysLeftText(debt.dueDate)}</Badge>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <div className="text-sm font-medium">{formatCurrency(debt.amount - debt.paidAmount)}</div>
                      <div className="text-xs text-muted-foreground">תאריך תשלום: {formatDate(debt.dueDate)}</div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
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
              אין חובות קרובים לתשלום
            </div>
          )}
          
          {upcomingDebts.length > 0 && (
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
