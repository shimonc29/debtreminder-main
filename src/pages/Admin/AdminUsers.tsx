
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
  UserCheck, 
  UserX, 
  Search, 
  MessageSquare,
  Mail
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getAllUsers, getUserStats, User, UserStats } from '@/lib/db';
import { toast } from '@/components/ui/sonner';

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [showSendMessage, setShowSendMessage] = useState(false);
  const [message, setMessage] = useState('');

  const users = getAllUsers();
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setUserStats(getUserStats(user.id));
  };

  const handleSendMessage = () => {
    if (!selectedUser || !message.trim()) return;
    
    // In a real app, this would send a message to the user
    toast.success("הודעה נשלחה בהצלחה", {
      description: `הודעה נשלחה למשתמש ${selectedUser.name}`
    });
    
    setMessage('');
    setShowSendMessage(false);
  };

  const handleUpdateStatus = (userId: string, status: 'active' | 'inactive' | 'suspended') => {
    // In a real app, this would update the user's status in the database
    toast.success("סטטוס המשתמש עודכן", {
      description: `סטטוס המשתמש עודכן ל-${status === 'active' ? 'פעיל' : status === 'inactive' ? 'לא פעיל' : 'מושהה'}`
    });
  };

  const handleUpdatePlan = (userId: string, plan: 'free' | 'premium' | 'enterprise') => {
    // In a real app, this would update the user's plan in the database
    toast.success("תכנית המשתמש עודכנה", {
      description: `תכנית המשתמש עודכנה ל-${plan === 'free' ? 'חינמית' : plan === 'premium' ? 'פרימיום' : 'עסקית'}`
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('he-IL').format(date);
  };

  return (
    <AdminLayout title="ניהול משתמשים">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>חיפוש משתמשים</CardTitle>
          <CardDescription>חפש משתמשים לפי שם, אימייל או חברה</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="חפש משתמשים..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>משתמשי המערכת</CardTitle>
          <CardDescription>ניהול כל משתמשי המערכת</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>שם</TableHead>
                <TableHead>אימייל</TableHead>
                <TableHead>חברה</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead>תכנית</TableHead>
                <TableHead>תאריך הצטרפות</TableHead>
                <TableHead className="w-[100px]">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.company}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.status === 'active' ? 'default' : user.status === 'inactive' ? 'secondary' : 'destructive'}
                    >
                      {user.status === 'active' ? 'פעיל' : user.status === 'inactive' ? 'לא פעיל' : 'מושהה'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {user.plan === 'free' ? 'חינמי' : user.plan === 'premium' ? 'פרימיום' : 'עסקי'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleViewUser(user)}>
                          הצג פרטי משתמש
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                          setSelectedUser(user);
                          setShowSendMessage(true);
                        }}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          שלח הודעה
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleUpdateStatus(user.id, 'active')}>
                          <UserCheck className="mr-2 h-4 w-4" />
                          הפעל משתמש
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(user.id, 'inactive')}>
                          <UserX className="mr-2 h-4 w-4" />
                          השבת משתמש
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleUpdatePlan(user.id, 'free')}>
                          עדכן לתכנית חינמית
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdatePlan(user.id, 'premium')}>
                          עדכן לתכנית פרימיום
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdatePlan(user.id, 'enterprise')}>
                          עדכן לתכנית עסקית
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

      {/* View User Dialog */}
      {selectedUser && userStats && (
        <Dialog open={selectedUser !== null && !showSendMessage} onOpenChange={(open) => !open && setSelectedUser(null)}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>פרטי משתמש - {selectedUser.name}</DialogTitle>
              <DialogDescription>
                פרטי המשתמש ונתוני שימוש
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>שם מלא</Label>
                  <div>{selectedUser.name}</div>
                </div>
                <div>
                  <Label>אימייל</Label>
                  <div>{selectedUser.email}</div>
                </div>
                <div>
                  <Label>חברה</Label>
                  <div>{selectedUser.company}</div>
                </div>
                <div>
                  <Label>תאריך הצטרפות</Label>
                  <div>{formatDate(selectedUser.createdAt)}</div>
                </div>
                <div>
                  <Label>סטטוס</Label>
                  <div>
                    <Badge variant={selectedUser.status === 'active' ? 'default' : selectedUser.status === 'inactive' ? 'secondary' : 'destructive'}>
                      {selectedUser.status === 'active' ? 'פעיל' : selectedUser.status === 'inactive' ? 'לא פעיל' : 'מושהה'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label>תכנית</Label>
                  <div>
                    <Badge variant="outline">
                      {selectedUser.plan === 'free' ? 'חינמי' : selectedUser.plan === 'premium' ? 'פרימיום' : 'עסקי'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-semibold mb-2">נתוני שימוש</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-muted rounded p-3">
                    <div className="text-sm text-muted-foreground">מספר לקוחות</div>
                    <div className="text-2xl font-semibold">{userStats.customerCount}</div>
                  </div>
                  <div className="bg-muted rounded p-3">
                    <div className="text-sm text-muted-foreground">מספר חובות</div>
                    <div className="text-2xl font-semibold">{userStats.debtCount}</div>
                  </div>
                  <div className="bg-muted rounded p-3">
                    <div className="text-sm text-muted-foreground">מספר תזכורות</div>
                    <div className="text-2xl font-semibold">{userStats.reminderCount}</div>
                  </div>
                  <div className="bg-muted rounded p-3 col-span-2">
                    <div className="text-sm text-muted-foreground">סכום חובות פעילים</div>
                    <div className="text-2xl font-semibold">₪{userStats.activeDebtAmount.toLocaleString()}</div>
                  </div>
                  <div className="bg-muted rounded p-3">
                    <div className="text-sm text-muted-foreground">סכום שהתקבל</div>
                    <div className="text-2xl font-semibold">₪{userStats.collectedAmount.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowSendMessage(true);
                }}
              >
                <Mail className="mr-2 h-4 w-4" />
                שלח הודעה למשתמש
              </Button>
              <Button onClick={() => setSelectedUser(null)}>סגור</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Send Message Dialog */}
      {selectedUser && (
        <Dialog open={showSendMessage} onOpenChange={(open) => !open && setShowSendMessage(false)}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>שלח הודעה למשתמש</DialogTitle>
              <DialogDescription>
                שלח הודעת מערכת ל-{selectedUser.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="recipient">נמען</Label>
                <Input id="recipient" value={selectedUser.email} readOnly className="bg-muted" />
              </div>
              <div>
                <Label htmlFor="message">הודעה</Label>
                <Textarea
                  id="message"
                  className="min-h-[150px]"
                  placeholder="כתוב את הודעתך כאן..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSendMessage(false)}>ביטול</Button>
              <Button onClick={handleSendMessage}>שלח הודעה</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
