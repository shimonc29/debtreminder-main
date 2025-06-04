
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Search,
  Mail,
  MailCheck,
  MailX 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock email logs data for demonstration
const mockEmailLogs = Array(20).fill(null).map((_, index) => {
  const status = Math.random() > 0.9 ? 'failed' : Math.random() > 0.3 ? 'delivered' : 'sent';
  const date = new Date();
  date.setHours(date.getHours() - Math.floor(Math.random() * 72));
  
  return {
    id: `email_${index + 1}`,
    recipient: `customer${index + 1}@example.com`,
    subject: 'תזכורת לתשלום חוב',
    status,
    date: date.toISOString(),
    template: 'payment_reminder',
    user: `user${Math.floor(Math.random() * 10) + 1}@example.com`,
  };
});

export function EmailLogTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const itemsPerPage = 10;
  
  // Filter the logs based on search term and status
  const filteredLogs = mockEmailLogs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.recipient.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.subject.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === null || log.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('he-IL');
  };
  
  // Status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-green-500 hover:bg-green-600">נמסר</Badge>;
      case 'sent':
        return <Badge className="bg-blue-500 hover:bg-blue-600">נשלח</Badge>;
      case 'failed':
        return <Badge className="bg-red-500 hover:bg-red-600">נכשל</Badge>;
      default:
        return <Badge variant="outline">לא ידוע</Badge>;
    }
  };

  // Status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <MailCheck className="h-4 w-4 text-green-500" />;
      case 'sent':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'failed':
        return <MailX className="h-4 w-4 text-red-500" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="חיפוש לפי אימייל או נושא..."
            className="pl-8 max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter || ''} onValueChange={(value) => setStatusFilter(value || null)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="כל הסטטוסים" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">כל הסטטוסים</SelectItem>
            <SelectItem value="delivered">נמסר</SelectItem>
            <SelectItem value="sent">נשלח</SelectItem>
            <SelectItem value="failed">נכשל</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>סטטוס</TableHead>
              <TableHead>נמען</TableHead>
              <TableHead>נושא</TableHead>
              <TableHead>תבנית</TableHead>
              <TableHead>שולח</TableHead>
              <TableHead>תאריך</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLogs.length > 0 ? (
              paginatedLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      {getStatusBadge(log.status)}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{log.recipient}</TableCell>
                  <TableCell>{log.subject}</TableCell>
                  <TableCell>{log.template}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{formatDate(log.date)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  לא נמצאו רשומות
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredLogs.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            מציג {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredLogs.length)} מתוך {filteredLogs.length} רשומות
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm mx-4">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
