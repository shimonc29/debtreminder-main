
import * as React from 'react';
import { CheckCircle, XCircle, MessageSquare, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

type CustomerResponse = {
  id: string;
  customerId: string;
  customerName: string;
  debtId: string;
  invoiceNumber: string;
  responseType: 'email' | 'whatsapp';
  responseDate: Date;
  paymentDate?: Date;
  reference?: string;
  amount?: number;
  status: 'pending' | 'verified' | 'rejected';
  comments?: string;
  internalNotes?: string;
};

export function CustomerResponses() {
  // In a real app, this would fetch data from an API
  const [responses, setResponses] = React.useState<CustomerResponse[]>([
    {
      id: 'resp_1',
      customerId: 'cust_1',
      customerName: 'דוד לוי',
      debtId: 'debt_1',
      invoiceNumber: 'INV-2023-001',
      responseType: 'email',
      responseDate: new Date(2023, 4, 17),
      paymentDate: new Date(2023, 4, 15),
      reference: '1234567',
      amount: 1500,
      status: 'pending',
      comments: 'שילמתי באמצעות העברה בנקאית'
    },
    {
      id: 'resp_2',
      customerId: 'cust_2',
      customerName: 'רונית כהן',
      debtId: 'debt_2',
      invoiceNumber: 'INV-2023-002',
      responseType: 'whatsapp',
      responseDate: new Date(2023, 4, 16),
      paymentDate: new Date(2023, 4, 14),
      status: 'pending',
      comments: 'שולם'
    }
  ]);
  
  const [selectedResponse, setSelectedResponse] = React.useState<CustomerResponse | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [internalNote, setInternalNote] = React.useState('');

  const handleViewDetails = (response: CustomerResponse) => {
    setSelectedResponse(response);
    setInternalNote(response.internalNotes || '');
    setIsDialogOpen(true);
  };

  const handleVerify = () => {
    if (!selectedResponse) return;
    
    // In a real app, this would call an API
    const updated = responses.map(r => 
      r.id === selectedResponse.id ? { ...r, status: 'verified' as const, internalNotes: internalNote } : r
    );
    
    setResponses(updated);
    setIsDialogOpen(false);
    
    toast.success('התשלום אומת בהצלחה', {
      description: `החוב ${selectedResponse.invoiceNumber} סומן כשולם`,
    });
  };

  const handleReject = () => {
    if (!selectedResponse) return;
    
    // In a real app, this would call an API
    const updated = responses.map(r => 
      r.id === selectedResponse.id ? { ...r, status: 'rejected' as const, internalNotes: internalNote } : r
    );
    
    setResponses(updated);
    setIsDialogOpen(false);
    
    toast.success('התשלום נדחה', {
      description: `החוב ${selectedResponse.invoiceNumber} נשאר פתוח`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">ממתין לאימות</Badge>;
      case 'verified':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">אומת</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">נדחה</Badge>;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>תאריך תגובה</TableHead>
              <TableHead>לקוח</TableHead>
              <TableHead>חשבונית</TableHead>
              <TableHead>סוג תגובה</TableHead>
              <TableHead>סטטוס</TableHead>
              <TableHead>פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {responses.length > 0 ? (
              responses.map(response => (
                <TableRow key={response.id}>
                  <TableCell>{formatDate(response.responseDate)}</TableCell>
                  <TableCell>{response.customerName}</TableCell>
                  <TableCell>{response.invoiceNumber}</TableCell>
                  <TableCell>
                    {response.responseType === 'email' ? 'אימייל' : 'וואטסאפ'}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(response.status)}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewDetails(response)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  אין תגובות לקוחות להצגה
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>פרטי תגובת לקוח</DialogTitle>
            <DialogDescription>
              תגובה מ{selectedResponse?.customerName} לחשבונית {selectedResponse?.invoiceNumber}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-2">
              <span className="text-sm font-medium">תאריך תגובה:</span>
              <span className="col-span-3">
                {selectedResponse && formatDate(selectedResponse.responseDate)}
              </span>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-2">
              <span className="text-sm font-medium">סוג תגובה:</span>
              <span className="col-span-3">
                {selectedResponse?.responseType === 'email' ? 'אימייל' : 'וואטסאפ'}
              </span>
            </div>
            
            {selectedResponse?.paymentDate && (
              <div className="grid grid-cols-4 items-center gap-2">
                <span className="text-sm font-medium">תאריך תשלום:</span>
                <span className="col-span-3">
                  {formatDate(selectedResponse.paymentDate)}
                </span>
              </div>
            )}
            
            {selectedResponse?.reference && (
              <div className="grid grid-cols-4 items-center gap-2">
                <span className="text-sm font-medium">אסמכתא:</span>
                <span className="col-span-3">{selectedResponse.reference}</span>
              </div>
            )}
            
            {selectedResponse?.amount && (
              <div className="grid grid-cols-4 items-center gap-2">
                <span className="text-sm font-medium">סכום ששולם:</span>
                <span className="col-span-3">{selectedResponse.amount}</span>
              </div>
            )}
            
            {selectedResponse?.comments && (
              <div className="grid grid-cols-4 items-center gap-2">
                <span className="text-sm font-medium">הערות לקוח:</span>
                <span className="col-span-3">{selectedResponse.comments}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <span className="text-sm font-medium">הערה פנימית:</span>
              <Textarea
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="הוסף הערה פנימית לתגובה זו"
              />
            </div>
          </div>
          
          <DialogFooter>
            {selectedResponse?.status === 'pending' && (
              <>
                <Button variant="outline" onClick={handleReject}>
                  <XCircle className="ml-2 h-4 w-4" />
                  דחה תשלום
                </Button>
                <Button onClick={handleVerify}>
                  <CheckCircle className="ml-2 h-4 w-4" />
                  אמת תשלום
                </Button>
              </>
            )}
            {selectedResponse?.status !== 'pending' && (
              <Button onClick={() => setIsDialogOpen(false)}>
                סגור
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
