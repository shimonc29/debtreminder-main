
import { useState } from 'react';
import { AdminLayout } from '@/components/Admin/AdminLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  MoreHorizontal, 
  Search, 
  ArrowUpDown,
  CreditCard,
  Filter
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';

// Mock data for subscriptions
const mockSubscriptions = [
  { 
    id: '1', 
    userId: '101', 
    userName: 'דוד כהן',
    userEmail: 'david@example.com',
    plan: 'pro',
    status: 'active',
    amount: 19.99,
    currency: 'ILS',
    interval: 'month',
    startDate: new Date('2023-10-01'),
    endDate: new Date('2024-10-01'),
    lastPayment: new Date('2023-12-01'),
    nextPayment: new Date('2024-01-01'),
  },
  { 
    id: '2', 
    userId: '102',
    userName: 'שרה לוי',
    userEmail: 'sarah@example.com',
    plan: 'enterprise',
    status: 'active',
    amount: 199.99,
    currency: 'ILS',
    interval: 'month',
    startDate: new Date('2023-11-15'),
    endDate: new Date('2024-11-15'),
    lastPayment: new Date('2023-12-15'),
    nextPayment: new Date('2024-01-15'),
  },
  { 
    id: '3', 
    userId: '103',
    userName: 'יוסי אברהם',
    userEmail: 'yossi@example.com',
    plan: 'pro',
    status: 'canceled',
    amount: 19.99,
    currency: 'ILS',
    interval: 'month',
    startDate: new Date('2023-09-01'),
    endDate: new Date('2023-12-01'),
    lastPayment: new Date('2023-11-01'),
    nextPayment: null,
  },
  { 
    id: '4', 
    userId: '104',
    userName: 'מיכל דוד',
    userEmail: 'michal@example.com',
    plan: 'pro',
    status: 'past_due',
    amount: 19.99,
    currency: 'ILS',
    interval: 'month',
    startDate: new Date('2023-08-15'),
    endDate: new Date('2024-08-15'),
    lastPayment: new Date('2023-11-15'),
    nextPayment: new Date('2023-12-15'),
  },
  { 
    id: '5', 
    userId: '105',
    userName: 'אבי ישראלי',
    userEmail: 'avi@example.com',
    plan: 'free',
    status: 'active',
    amount: 0,
    currency: 'ILS',
    interval: null,
    startDate: new Date('2023-07-10'),
    endDate: null,
    lastPayment: null,
    nextPayment: null,
  },
];

// Mock data for payments
const mockPayments = [
  {
    id: 'payment_1',
    subscriptionId: '1',
    userName: 'דוד כהן',
    userEmail: 'david@example.com',
    amount: 19.99,
    currency: 'ILS',
    status: 'succeeded',
    date: new Date('2023-12-01'),
    receiptUrl: '#',
  },
  {
    id: 'payment_2',
    subscriptionId: '2',
    userName: 'שרה לוי',
    userEmail: 'sarah@example.com',
    amount: 199.99,
    currency: 'ILS',
    status: 'succeeded',
    date: new Date('2023-12-15'),
    receiptUrl: '#',
  },
  {
    id: 'payment_3',
    subscriptionId: '1',
    userName: 'דוד כהן',
    userEmail: 'david@example.com',
    amount: 19.99,
    currency: 'ILS',
    status: 'succeeded',
    date: new Date('2023-11-01'),
    receiptUrl: '#',
  },
  {
    id: 'payment_4',
    subscriptionId: '3',
    userName: 'יוסי אברהם',
    userEmail: 'yossi@example.com',
    amount: 19.99,
    currency: 'ILS',
    status: 'succeeded',
    date: new Date('2023-11-01'),
    receiptUrl: '#',
  },
  {
    id: 'payment_5',
    subscriptionId: '4',
    userName: 'מיכל דוד',
    userEmail: 'michal@example.com',
    amount: 19.99,
    currency: 'ILS',
    status: 'failed',
    date: new Date('2023-12-15'),
    receiptUrl: null,
  },
];

// Mock data for subscription stats
const mockStats = {
  activeSubscriptions: 3,
  totalRevenue: 15980.20,
  averageRevenue: 59.99,
  churnRate: 4.5,
};

const AdminSubscriptions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState<any | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Filter subscriptions based on search query and filters
  const filteredSubscriptions = mockSubscriptions.filter(subscription => {
    const matchesSearch = 
      subscription.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subscription.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPlan = filterPlan === 'all' || subscription.plan === filterPlan;
    const matchesStatus = filterStatus === 'all' || subscription.status === filterStatus;
    
    return matchesSearch && matchesPlan && matchesStatus;
  });

  // Filter payments based on search query
  const filteredPayments = mockPayments.filter(payment =>
    payment.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('he-IL').format(date);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: currency || 'ILS',
    }).format(amount);
  };

  const handleUpdateSubscription = () => {
    if (!selectedSubscription) return;
    
    // In a real app, this would call your backend API
    toast.success("המנוי עודכן בהצלחה", {
      description: `מנוי של ${selectedSubscription.userName} עודכן`
    });
    
    setShowEditDialog(false);
  };

  const handleCancelSubscription = (subscriptionId: string) => {
    // In a real app, this would call your Stripe API
    toast.success("המנוי בוטל בהצלחה", {
      description: "המנוי יישאר פעיל עד לסוף תקופת החיוב הנוכחית"
    });
  };

  const handleRefundPayment = (paymentId: string) => {
    // In a real app, this would call your Stripe API
    toast.success("הזיכוי בוצע בהצלחה", {
      description: "התשלום הוחזר ללקוח"
    });
  };

  // Status badge color based on status
  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case 'active': return 'default';
      case 'canceled': return 'secondary';
      case 'past_due': return 'destructive';
      case 'succeeded': return 'default';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  // Translated status text
  const getStatusText = (status: string) => {
    switch(status) {
      case 'active': return 'פעיל';
      case 'canceled': return 'בוטל';
      case 'past_due': return 'בפיגור';
      case 'succeeded': return 'הצליח';
      case 'failed': return 'נכשל';
      default: return status;
    }
  };

  // Plan badge color based on plan
  const getPlanBadgeVariant = (plan: string) => {
    switch(plan) {
      case 'free': return 'outline';
      case 'pro': return 'default';
      case 'enterprise': return 'secondary';
      default: return 'outline';
    }
  };

  // Translated plan text
  const getPlanText = (plan: string) => {
    switch(plan) {
      case 'free': return 'חינמי';
      case 'pro': return 'Pro';
      case 'enterprise': return 'Enterprise';
      default: return plan;
    }
  };

  return (
    <AdminLayout title="ניהול מנויים ותשלומים">
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">סקירה כללית</TabsTrigger>
          <TabsTrigger value="subscriptions">מנויים</TabsTrigger>
          <TabsTrigger value="payments">תשלומים</TabsTrigger>
          <TabsTrigger value="settings">הגדרות</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  מנויים פעילים
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.activeSubscriptions}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  הכנסה חודשית
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₪{mockStats.totalRevenue.toFixed(2)}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  הכנסה ממוצעת למשתמש
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₪{mockStats.averageRevenue.toFixed(2)}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  שיעור נטישה
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.churnRate}%</div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>מנויים אחרונים</CardTitle>
              <CardDescription>רשימת המנויים האחרונים במערכת</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>שם</TableHead>
                    <TableHead>תוכנית</TableHead>
                    <TableHead>סטטוס</TableHead>
                    <TableHead>סכום</TableHead>
                    <TableHead>תאריך התחלה</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSubscriptions.slice(0, 5).map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell className="font-medium">{subscription.userName}</TableCell>
                      <TableCell>
                        <Badge variant={getPlanBadgeVariant(subscription.plan)}>
                          {getPlanText(subscription.plan)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(subscription.status)}>
                          {getStatusText(subscription.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {subscription.amount ? formatCurrency(subscription.amount, subscription.currency) : 'חינם'}
                      </TableCell>
                      <TableCell>{formatDate(subscription.startDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>חיפוש וסינון מנויים</CardTitle>
              <CardDescription>חפש מנויים לפי שם, אימייל, תוכנית או סטטוס</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="חפש לפי שם או אימייל..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Select
                    value={filterPlan}
                    onValueChange={setFilterPlan}
                  >
                    <SelectTrigger className="w-[150px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="סנן לפי תוכנית" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">כל התוכניות</SelectItem>
                      <SelectItem value="free">חינמי</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={filterStatus}
                    onValueChange={setFilterStatus}
                  >
                    <SelectTrigger className="w-[150px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="סנן לפי סטטוס" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">כל הסטטוסים</SelectItem>
                      <SelectItem value="active">פעיל</SelectItem>
                      <SelectItem value="canceled">בוטל</SelectItem>
                      <SelectItem value="past_due">בפיגור</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>מנויים</CardTitle>
              <CardDescription>רשימת כל המנויים במערכת</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>שם</TableHead>
                    <TableHead>אימייל</TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        תוכנית
                        <ArrowUpDown className="mr-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        סטטוס
                        <ArrowUpDown className="mr-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        סכום
                        <ArrowUpDown className="mr-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>תאריך התחלה</TableHead>
                    <TableHead>תשלום הבא</TableHead>
                    <TableHead className="w-[100px]">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell className="font-medium">{subscription.userName}</TableCell>
                      <TableCell>{subscription.userEmail}</TableCell>
                      <TableCell>
                        <Badge variant={getPlanBadgeVariant(subscription.plan)}>
                          {getPlanText(subscription.plan)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(subscription.status)}>
                          {getStatusText(subscription.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {subscription.amount ? formatCurrency(subscription.amount, subscription.currency) : 'חינם'}
                        {subscription.interval && <span className="text-xs text-muted-foreground"> / {subscription.interval === 'month' ? 'חודש' : 'שנה'}</span>}
                      </TableCell>
                      <TableCell>{formatDate(subscription.startDate)}</TableCell>
                      <TableCell>{formatDate(subscription.nextPayment)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">פתח תפריט</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>פעולות</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => {
                              setSelectedSubscription(subscription);
                              setShowEditDialog(true);
                            }}>
                              ערוך מנוי
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleCancelSubscription(subscription.id)}>
                              בטל מנוי
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {/* Edit Subscription Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>ערוך מנוי</DialogTitle>
                <DialogDescription>
                  עדכן את פרטי המנוי של {selectedSubscription?.userName}
                </DialogDescription>
              </DialogHeader>
              {selectedSubscription && (
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="plan">תוכנית</Label>
                      <Select defaultValue={selectedSubscription.plan}>
                        <SelectTrigger id="plan">
                          <SelectValue placeholder="בחר תוכנית" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">חינמי</SelectItem>
                          <SelectItem value="pro">Pro</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">סטטוס</Label>
                      <Select defaultValue={selectedSubscription.status}>
                        <SelectTrigger id="status">
                          <SelectValue placeholder="בחר סטטוס" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">פעיל</SelectItem>
                          <SelectItem value="canceled">בוטל</SelectItem>
                          <SelectItem value="past_due">בפיגור</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">הערות</Label>
                    <Input id="notes" placeholder="הערות פנימיות למנוי" />
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>ביטול</Button>
                <Button onClick={handleUpdateSubscription}>שמור שינויים</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        {/* Payments Tab */}
        <TabsContent value="payments">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>חיפוש תשלומים</CardTitle>
              <CardDescription>חפש תשלומים לפי שם או אימייל</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="חפש תשלומים..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>היסטוריית תשלומים</CardTitle>
              <CardDescription>רשימת כל התשלומים במערכת</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>שם</TableHead>
                    <TableHead>אימייל</TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        סכום
                        <ArrowUpDown className="mr-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        סטטוס
                        <ArrowUpDown className="mr-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        תאריך
                        <ArrowUpDown className="mr-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="w-[100px]">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.userName}</TableCell>
                      <TableCell>{payment.userEmail}</TableCell>
                      <TableCell>{formatCurrency(payment.amount, payment.currency)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(payment.status)}>
                          {getStatusText(payment.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(payment.date)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">פתח תפריט</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>פעולות</DropdownMenuLabel>
                            {payment.receiptUrl && (
                              <DropdownMenuItem>
                                <a href={payment.receiptUrl} target="_blank" rel="noopener noreferrer">
                                  צפה בחשבונית
                                </a>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleRefundPayment(payment.id)}>
                              החזר תשלום
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>הגדרות Stripe</CardTitle>
              <CardDescription>הגדר את מפתחות ה-API של Stripe לעיבוד תשלומים</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="stripe_public_key">מפתח פומבי של Stripe</Label>
                <Input id="stripe_public_key" type="text" value="pk_test_•••••••••••••" readOnly />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stripe_secret_key">מפתח סודי של Stripe</Label>
                <Input id="stripe_secret_key" type="password" value="sk_test_•••••••••••••" readOnly />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="webhook_url">כתובת Webhook</Label>
                <div className="flex">
                  <Input id="webhook_url" value="https://yourapp.com/api/webhooks/stripe" readOnly className="flex-grow" />
                  <Button variant="outline" className="mr-2">העתק</Button>
                </div>
                <p className="text-sm text-muted-foreground">השתמש בכתובת זו בהגדרות ה-Webhook בלוח הבקרה של Stripe</p>
              </div>
              
              <div className="space-y-2">
                <Label>מצב הסביבה</Label>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    מצב בדיקה
                  </Badge>
                  <Button variant="outline" size="sm">
                    <CreditCard className="h-4 w-4 mr-2" />
                    עבור למצב חי
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminSubscriptions;
