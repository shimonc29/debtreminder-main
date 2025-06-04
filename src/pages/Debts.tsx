import { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { debts, customers } from '@/lib/db';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DebtDialog } from '@/components/Debts/DebtDialog';
import { Eye, Pencil, Trash2, Calendar as CalendarIcon, Filter } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DebtsPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [customerFilter, setCustomerFilter] = useState<string | null>(null);
  const [dueDateFilter, setDueDateFilter] = useState<Date | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<typeof debts[0] | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleEdit = (debt: typeof debts[0]) => {
    setEditingDebt(debt);
  };

  const handleDelete = (id: string) => {
    // In a real app, this would call the API to delete the debt
    console.log('Deleting debt:', id);
  };

  const handleView = (id: string) => {
    navigate(`/debts/${id}`);
  };

  const filteredDebts = useMemo(() => {
    return debts.filter(debt => {
      // Filter by search term (invoice number or description)
      const matchesSearch = searchTerm === '' || 
        debt.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debt.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by status
      const matchesStatus = statusFilter === null || debt.status === statusFilter;
      
      // Filter by customer
      const matchesCustomer = customerFilter === null || debt.customerId === customerFilter;
      
      // Filter by due date
      const matchesDueDate = dueDateFilter === null || 
        (dueDateFilter && debt.dueDate.toDateString() === dueDateFilter.toDateString());
      
      return matchesSearch && matchesStatus && matchesCustomer && matchesDueDate;
    });
  }, [searchTerm, statusFilter, customerFilter, dueDateFilter]);

  // Calculate summary statistics
  const debtSummary = useMemo(() => {
    const summary = {
      total: 0,
      pending: 0,
      overdue: 0,
      partiallyPaid: 0,
      paid: 0
    };

    filteredDebts.forEach(debt => {
      const remainingAmount = debt.amount - debt.paidAmount;
      
      // Add to total
      summary.total += remainingAmount;
      
      // Add to respective status summary
      switch (debt.status) {
        case 'pending':
          summary.pending += remainingAmount;
          break;
        case 'overdue':
          summary.overdue += remainingAmount;
          break;
        case 'partially_paid':
          summary.partiallyPaid += remainingAmount;
          break;
        case 'paid':
          summary.paid += remainingAmount;
          break;
      }
    });

    return summary;
  }, [filteredDebts]);

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

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'לקוח לא ידוע';
  };
  
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

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      <div className="flex-1">
        <Navbar />
        
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="page-header">ניהול חובות</h1>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              הוסף חוב חדש
            </Button>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">סך הכל חובות</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(debtSummary.total)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">ממתינים לתשלום</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(debtSummary.pending)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">באיחור</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(debtSummary.overdue)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">שולמו חלקית</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(debtSummary.partiallyPaid)}</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <Input 
                placeholder="חיפוש לפי חשבונית או תיאור" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Select value={statusFilter || undefined} onValueChange={(value) => setStatusFilter(value || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="סנן לפי סטטוס" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">הכל</SelectItem>
                  <SelectItem value="pending">ממתין לתשלום</SelectItem>
                  <SelectItem value="overdue">באיחור</SelectItem>
                  <SelectItem value="partially_paid">שולם חלקית</SelectItem>
                  <SelectItem value="payment_claimed">נטען ששולם</SelectItem>
                  <SelectItem value="paid">שולם</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={customerFilter || undefined} onValueChange={(value) => setCustomerFilter(value || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="סנן לפי לקוח" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הלקוחות</SelectItem>
                  {customers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="h-4 w-4 ml-2" />
                    {dueDateFilter ? formatDate(dueDateFilter) : 'סנן לפי תאריך יעד'}
                    {dueDateFilter && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-2 h-6 w-6 p-0" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setDueDateFilter(null);
                        }}
                      >
                        ×
                      </Button>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDateFilter || undefined}
                    onSelect={setDueDateFilter}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {/* Debts Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>חשבונית</TableHead>
                  <TableHead>לקוח</TableHead>
                  <TableHead>תיאור</TableHead>
                  <TableHead>סכום</TableHead>
                  <TableHead>שולם</TableHead>
                  <TableHead>תאריך יעד</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead>פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDebts.length > 0 ? (
                  filteredDebts.map((debt) => (
                    <TableRow key={debt.id}>
                      <TableCell>{debt.invoiceNumber}</TableCell>
                      <TableCell>{getCustomerName(debt.customerId)}</TableCell>
                      <TableCell>{debt.description}</TableCell>
                      <TableCell dir="ltr">{formatCurrency(debt.amount)}</TableCell>
                      <TableCell dir="ltr">{formatCurrency(debt.paidAmount)}</TableCell>
                      <TableCell>{formatDate(debt.dueDate)}</TableCell>
                      <TableCell>{getStatusBadge(debt.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleView(debt.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(debt)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(debt.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      לא נמצאו חובות התואמים את הסינון
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Add/Edit Debt Dialog */}
          <DebtDialog 
            open={isAddDialogOpen || !!editingDebt} 
            debt={editingDebt}
            onOpenChange={(open) => {
              if (!open) {
                setIsAddDialogOpen(false);
                setEditingDebt(null);
              }
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default DebtsPage;
