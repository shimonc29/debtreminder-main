
import { Customer } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Eye, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface CustomersTableProps {
  customers: Customer[];
  sortColumn: keyof Customer;
  sortOrder: 'asc' | 'desc';
  onSort: (column: keyof Customer) => void;
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export function CustomersTable({
  customers,
  sortColumn,
  sortOrder,
  onSort,
  onView,
  onEdit,
  onDelete
}: CustomersTableProps) {
  const renderSortIcon = (column: keyof Customer) => {
    if (sortColumn !== column) return null;

    return sortOrder === 'asc' ? (
      <ArrowUp className="ml-1 h-4 w-4 inline" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4 inline" />
    );
  };

  const handleSort = (column: keyof Customer) => {
    onSort(column);
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('name')}
            >
              שם {renderSortIcon('name')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('email')}
            >
              אימייל {renderSortIcon('email')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('phone')}
            >
              טלפון {renderSortIcon('phone')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('createdAt')}
            >
              תאריך הוספה {renderSortIcon('createdAt')}
            </TableHead>
            <TableHead>פעולות</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10">
                לא נמצאו לקוחות
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{formatDate(customer.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onView(customer)}
                      title="צפייה בפרטי לקוח"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEdit(customer)}
                      title="עריכת לקוח"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onDelete(customer)}
                      title="מחיקת לקוח"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
