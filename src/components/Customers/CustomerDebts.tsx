
import { Debt, getCustomerById } from '@/lib/db';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface CustomerDebtsProps {
  debts: Debt[];
  customerId: string;
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return 'ממתין לתשלום';
    case 'paid':
      return 'שולם';
    case 'partially_paid':
      return 'שולם חלקית';
    case 'overdue':
      return 'באיחור';
    default:
      return status;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
    case 'paid':
      return 'bg-green-100 text-green-800 hover:bg-green-100';
    case 'partially_paid':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    case 'overdue':
      return 'bg-red-100 text-red-800 hover:bg-red-100';
    default:
      return '';
  }
};

export function CustomerDebts({ debts, customerId }: CustomerDebtsProps) {
  const customer = getCustomerById(customerId);

  // Calculate totals
  const totalAmount = debts.reduce((sum, debt) => sum + debt.amount, 0);
  const totalPaid = debts.reduce((sum, debt) => sum + debt.paidAmount, 0);
  const totalRemaining = totalAmount - totalPaid;

  if (debts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {customer ? `${customer.name} אין חובות ל` : 'אין חובות ללקוח זה'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-4 rounded-lg bg-muted/50">
          <p className="text-sm text-muted-foreground">סה״כ סכום החובות</p>
          <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
        </div>
        <div className="p-4 rounded-lg bg-muted/50">
          <p className="text-sm text-muted-foreground">שולם</p>
          <p className="text-2xl font-bold">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="p-4 rounded-lg bg-muted/50">
          <p className="text-sm text-muted-foreground">יתרה לתשלום</p>
          <p className="text-2xl font-bold">{formatCurrency(totalRemaining)}</p>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>מספר חשבונית</TableHead>
              <TableHead>תיאור</TableHead>
              <TableHead>סכום</TableHead>
              <TableHead>תאריך לתשלום</TableHead>
              <TableHead>סטטוס</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {debts.map((debt) => (
              <TableRow key={debt.id}>
                <TableCell>{debt.invoiceNumber}</TableCell>
                <TableCell>{debt.description}</TableCell>
                <TableCell>{formatCurrency(debt.amount)}</TableCell>
                <TableCell>{formatDate(debt.dueDate)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(debt.status)}>
                    {getStatusLabel(debt.status)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
