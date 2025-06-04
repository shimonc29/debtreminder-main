
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/components/ui/sonner';

const ReminderResponse = () => {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [reminderDetails, setReminderDetails] = useState<any>(null);
  const [date, setDate] = useState<Date>();
  const [reference, setReference] = useState('');
  const [amount, setAmount] = useState('');
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  useEffect(() => {
    // In a real app, this would validate the token and fetch reminder details
    // Mocked implementation for now
    setTimeout(() => {
      setReminderDetails({
        id: 'rem_12345',
        invoiceNumber: 'INV-2023-001',
        customerName: 'דוד לוי',
        amount: 1500,
        currency: 'ILS',
        dueDate: new Date('2023-05-15'),
        debtId: 'debt_abc123',
      });
      setLoading(false);
    }, 1000);
  }, [token]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send the data to the server
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      
      toast.success('התגובה נשלחה בהצלחה', {
        description: 'קיבלנו את האישור שלך, נבדוק את הפרטים בהקדם',
      });
    }, 1500);
  };
  
  if (loading && !reminderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">טוען...</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">תודה על תגובתך!</CardTitle>
            <CardDescription className="text-center">
              קיבלנו את האישור שלך שהתשלום בוצע. 
              נבדוק את הפרטים ונעדכן את הרשומות בהתאם.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              מספר חשבונית: <strong>{reminderDetails.invoiceNumber}</strong>
            </p>
            <p>
              אם יש לך שאלות נוספות, אנא צור קשר עם הנציג שלך.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => window.close()}>סגור חלון</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>אישור תשלום</CardTitle>
          <CardDescription>
            אנא מלא את הפרטים הבאים כדי לאשר שהתשלום בוצע
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">פרטי החוב:</p>
              <p>חשבונית: {reminderDetails?.invoiceNumber}</p>
              <p>סכום לתשלום: {reminderDetails?.amount} {reminderDetails?.currency}</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentDate">תאריך תשלום</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-start font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="ml-2 h-4 w-4" />
                    {date ? format(date, "dd/MM/yyyy") : "בחר תאריך"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reference">אסמכתא / מזהה תשלום</Label>
              <Input 
                id="reference" 
                value={reference} 
                onChange={(e) => setReference(e.target.value)} 
                placeholder="הכנס אסמכתא אם ישנה"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">סכום ששולם</Label>
              <Input 
                id="amount" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder={`למשל: ${reminderDetails?.amount}`}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="comments">הערות נוספות</Label>
              <Textarea 
                id="comments" 
                value={comments} 
                onChange={(e) => setComments(e.target.value)} 
                placeholder="הוסף מידע נוסף אם רלוונטי"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'שולח...' : 'אשר תשלום'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ReminderResponse;
