
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
import { getSystemLogs } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const AdminLogs = () => {
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const logs = getSystemLogs();
  
  const filteredLogs = logs.filter(log => {
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel;
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.userEmail && log.userEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesLevel && matchesSearch;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('he-IL', { 
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    }).format(date);
  };

  const handleExportLogs = () => {
    // In a real app, this would generate and download a CSV file of logs
    alert('בקרוב: ייצוא הלוגים ל-CSV');
  };

  return (
    <AdminLayout title="לוג פעילות מערכת">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-64">
            <Select
              value={filterLevel}
              onValueChange={(value) => setFilterLevel(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="סנן לפי רמה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הרמות</SelectItem>
                <SelectItem value="info">מידע</SelectItem>
                <SelectItem value="warning">אזהרה</SelectItem>
                <SelectItem value="error">שגיאה</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-auto flex-1">
            <Input
              placeholder="חפש בלוג פעילות..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Button variant="outline" onClick={handleExportLogs}>
          <Download className="mr-2 h-4 w-4" />
          ייצוא לקובץ
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>לוג פעילות</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>זמן</TableHead>
                <TableHead>פעולה</TableHead>
                <TableHead>משתמש</TableHead>
                <TableHead>פרטים</TableHead>
                <TableHead>רמה</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap">{formatDate(log.timestamp)}</TableCell>
                  <TableCell className="font-mono text-xs">{log.action}</TableCell>
                  <TableCell>{log.userEmail || 'מערכת'}</TableCell>
                  <TableCell className="max-w-xs truncate">{log.details}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        log.level === 'info' ? 'default' :
                        log.level === 'warning' ? 'secondary' :
                        'destructive'
                      }
                    >
                      {log.level === 'info' ? 'מידע' :
                      log.level === 'warning' ? 'אזהרה' :
                      'שגיאה'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    לא נמצאו לוגים תואמים לחיפוש
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminLogs;
