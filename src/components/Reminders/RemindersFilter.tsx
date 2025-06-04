
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { customers, reminders, Reminder } from '@/lib/db';
import { Search, X } from 'lucide-react';

interface RemindersFilterProps {
  setFilteredReminders: (reminders: Reminder[]) => void;
}

export function RemindersFilter({ setFilteredReminders }: RemindersFilterProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  
  // Apply filters whenever filter criteria change
  useEffect(() => {
    let filtered = [...reminders];
    
    if (selectedCustomer && selectedCustomer !== 'all') {
      filtered = filtered.filter(reminder => reminder.customerId === selectedCustomer);
    }
    
    if (selectedStatus && selectedStatus !== 'all') {
      filtered = filtered.filter(reminder => reminder.status === selectedStatus);
    }
    
    if (selectedChannel && selectedChannel !== 'all') {
      filtered = filtered.filter(reminder => reminder.channel === selectedChannel);
    }
    
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter(reminder => new Date(reminder.sentAt) >= fromDate);
    }
    
    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999); // End of the day
      filtered = filtered.filter(reminder => new Date(reminder.sentAt) <= toDate);
    }
    
    setFilteredReminders(filtered);
  }, [selectedCustomer, selectedStatus, selectedChannel, dateFrom, dateTo, setFilteredReminders]);
  
  const resetFilters = () => {
    setSelectedCustomer('');
    setSelectedStatus('');
    setSelectedChannel('');
    setDateFrom('');
    setDateTo('');
  };
  
  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <Label htmlFor="customer-filter">לקוח</Label>
          <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
            <SelectTrigger id="customer-filter">
              <SelectValue placeholder="כל הלקוחות" />
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
          <Label htmlFor="status-filter">סטטוס</Label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="כל הסטטוסים" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל הסטטוסים</SelectItem>
              <SelectItem value="sent">נשלח</SelectItem>
              <SelectItem value="delivered">נמסר</SelectItem>
              <SelectItem value="failed">נכשל</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="channel-filter">ערוץ</Label>
          <Select value={selectedChannel} onValueChange={setSelectedChannel}>
            <SelectTrigger id="channel-filter">
              <SelectValue placeholder="כל הערוצים" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל הערוצים</SelectItem>
              <SelectItem value="email">אימייל</SelectItem>
              <SelectItem value="whatsapp">וואטסאפ</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="date-from">מתאריך</Label>
          <Input
            id="date-from"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="date-to">עד תאריך</Label>
          <Input
            id="date-to"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex justify-end mt-4 space-x-2 space-x-reverse">
        <Button variant="outline" size="sm" onClick={resetFilters}>
          <X className="ml-1 h-4 w-4" />
          נקה סינון
        </Button>
        <Button size="sm">
          <Search className="ml-1 h-4 w-4" />
          סנן
        </Button>
      </div>
    </Card>
  );
}
