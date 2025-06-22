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

  // Helper for aria-sort
  const getAriaSort = (column: keyof Customer) => {
    if (sortColumn !== column) return 'none';
    return sortOrder === 'asc' ? 'ascending' : 'descending';
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">
              <button
                type="button"
                className="cursor-pointer flex items-center bg-transparent border-0 p-0 m-0 text-inherit focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-sort={getAriaSort('name')}
                aria-label="מיין לפי שם"
                tabIndex={0}
                onClick={() => handleSort('name')}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleSort('name'); }}
              >
                שם {renderSortIcon('name')}
              </button>
            </TableHead>
            <TableHead scope="col">
              <button
                type="button"
                className="cursor-pointer flex items-center bg-transparent border-0 p-0 m-0 text-inherit focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-sort={getAriaSort('email')}
                aria-label="מיין לפי אימייל"
                tabIndex={0}
                onClick={() => handleSort('email')}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleSort('email'); }}
              >
                אימייל {renderSortIcon('email')}
              </button>
            </TableHead>
            <TableHead scope="col">
              <button
                type="button"
                className="cursor-pointer flex items-center bg-transparent border-0 p-0 m-0 text-inherit focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-sort={getAriaSort('phone')}
                aria-label="מיין לפי טלפון"
                tabIndex={0}
                onClick={() => handleSort('phone')}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleSort('phone'); }}
              >
                טלפון {renderSortIcon('phone')}
              </button>
            </TableHead>
            <TableHead scope="col">
              <button
                type="button"
                className="cursor-pointer flex items-center bg-transparent border-0 p-0 m-0 text-inherit focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-sort={getAriaSort('createdAt')}
                aria-label="מיין לפי תאריך הוספה"
                tabIndex={0}
                onClick={() => handleSort('createdAt')}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleSort('createdAt'); }}
              >
                תאריך הוספה {renderSortIcon('createdAt')}
              </button>
            </TableHead>
            <TableHead scope="col">פעולות</TableHead>
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
                      aria-label="צפייה בפרטי לקוח"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEdit(customer)}
                      title="עריכת לקוח"
                      aria-label="עריכת לקוח"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        // Suggestion: Add a confirmation dialog at a higher level before calling onDelete
                        onDelete(customer);
                      }}
                      title="מחיקת לקוח"
                      aria-label="מחיקת לקוח"
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
