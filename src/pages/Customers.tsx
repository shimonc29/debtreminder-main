
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { CustomersTable } from '@/components/Customers/CustomersTable';
import { CustomerDialog } from '@/components/Customers/CustomerDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Customer, customers as mockCustomers } from '@/lib/db';
import { toast } from '@/components/ui/sonner';

const Customers = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof Customer>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Load customers
  useEffect(() => {
    // In a real app, this would fetch from an API
    setCustomers(mockCustomers);
  }, []);

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Handle sort change
  const handleSort = (column: keyof Customer) => {
    if (column === sortColumn) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  // Handle customer add/edit/delete
  const handleOpenAddDialog = () => {
    setSelectedCustomer(null);
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditDialogOpen(true);
  };

  const handleViewCustomer = (customer: Customer) => {
    navigate(`/customers/${customer.id}`);
  };

  const handleAddCustomer = (customer: Customer) => {
    // In a real app, this would send a POST request to the API
    const newCustomer = {
      ...customer,
      id: `cust_${Date.now()}`,
      userId: 'usr_1',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setCustomers([...customers, newCustomer]);
    toast.success('לקוח נוסף בהצלחה');
    setIsAddDialogOpen(false);
  };

  const handleEditCustomer = (customer: Customer) => {
    // In a real app, this would send a PUT request to the API
    const updatedCustomers = customers.map(c => 
      c.id === customer.id ? { ...customer, updatedAt: new Date() } : c
    );
    
    setCustomers(updatedCustomers);
    toast.success('הלקוח עודכן בהצלחה');
    setIsEditDialogOpen(false);
  };

  const handleDeleteCustomer = (customer: Customer) => {
    // In a real app, this would send a DELETE request to the API
    const updatedCustomers = customers.filter(c => c.id !== customer.id);
    setCustomers(updatedCustomers);
    toast.success('הלקוח נמחק בהצלחה');
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

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      <div className="flex-1">
        <Navbar />
        
        <main className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <h1 className="page-header mb-4 md:mb-0">לקוחות</h1>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="חיפוש לקוחות..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              
              <Button onClick={handleOpenAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                לקוח חדש
              </Button>
            </div>
          </div>

          <div className="rounded-lg border shadow-sm bg-card">
            <CustomersTable 
              customers={sortedCustomers}
              sortColumn={sortColumn}
              sortOrder={sortOrder}
              onSort={handleSort}
              onView={handleViewCustomer}
              onEdit={handleOpenEditDialog}
              onDelete={handleDeleteCustomer}
            />
          </div>
          
          <CustomerDialog 
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            customer={null}
            onSubmit={handleAddCustomer}
            mode="add"
          />
          
          <CustomerDialog 
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            customer={selectedCustomer}
            onSubmit={handleEditCustomer}
            mode="edit"
          />
        </main>
      </div>
    </div>
  );
};

export default Customers;
