
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { debts, customers, Debt } from '@/lib/db';
import { formatCurrency } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Create a schema for adding or editing a debt
const debtSchema = z.object({
  customerId: z.string().min(1, { message: 'יש לבחור לקוח' }),
  amount: z.number().positive({ message: 'סכום צריך להיות חיובי' }),
  currency: z.string().min(1, { message: 'יש לבחור מטבע' }),
  description: z.string().min(3, { message: 'תיאור צריך להיות לפחות 3 תווים' }),
  invoiceNumber: z.string().min(1, { message: 'יש להזין מספר חשבונית' }),
  invoiceDate: z.date({ required_error: 'יש לבחור תאריך חשבונית' }),
  dueDate: z.date({ required_error: 'יש לבחור תאריך יעד לתשלום' }),
  notes: z.string().optional(),
  isPaid: z.boolean().default(false),
  paidAmount: z.number().min(0).optional(),
  paidDate: z.date().optional().nullable(),
});

type DebtFormValues = z.infer<typeof debtSchema>;

interface DebtDialogProps {
  open: boolean;
  debt?: Debt | null;
  onOpenChange: (open: boolean) => void;
}

export function DebtDialog({ open, debt, onOpenChange }: DebtDialogProps) {
  const [isPaidChecked, setIsPaidChecked] = useState(false);
  const [isPartiallyPaid, setIsPartiallyPaid] = useState(false);
  
  const form = useForm<DebtFormValues>({
    resolver: zodResolver(debtSchema),
    defaultValues: {
      customerId: '',
      amount: 0,
      currency: 'ILS',
      description: '',
      invoiceNumber: '',
      invoiceDate: new Date(),
      dueDate: new Date(),
      notes: '',
      isPaid: false,
      paidAmount: 0,
      paidDate: null,
    },
  });
  
  // Reset form when the debt changes
  useEffect(() => {
    if (debt) {
      const isPaid = debt.status === 'paid';
      const isPartial = debt.status === 'partially_paid';
      
      setIsPaidChecked(isPaid || isPartial);
      setIsPartiallyPaid(isPartial);
      
      form.reset({
        customerId: debt.customerId,
        amount: debt.amount,
        currency: debt.currency,
        description: debt.description,
        invoiceNumber: debt.invoiceNumber,
        invoiceDate: debt.invoiceDate,
        dueDate: debt.dueDate,
        notes: debt.notes,
        isPaid: isPaid || isPartial,
        paidAmount: debt.paidAmount,
        paidDate: debt.paidDate || null,
      });
    } else {
      // Reset form for new debt
      form.reset({
        customerId: '',
        amount: 0,
        currency: 'ILS',
        description: '',
        invoiceNumber: '',
        invoiceDate: new Date(),
        dueDate: new Date(),
        notes: '',
        isPaid: false,
        paidAmount: 0,
        paidDate: null,
      });
      setIsPaidChecked(false);
      setIsPartiallyPaid(false);
    }
  }, [debt, form]);
  
  const onSubmit = (data: DebtFormValues) => {
    // Create a new debt object
    const newDebt: Partial<Debt> = {
      customerId: data.customerId,
      amount: data.amount,
      currency: data.currency,
      description: data.description,
      invoiceNumber: data.invoiceNumber,
      invoiceDate: data.invoiceDate,
      dueDate: data.dueDate,
      notes: data.notes || '',
      paidAmount: data.isPaid ? (isPartiallyPaid ? data.paidAmount || 0 : data.amount) : 0,
      paidDate: data.isPaid ? data.paidDate || new Date() : null,
    };
    
    // Determine the status based on payment info
    if (data.isPaid) {
      if (isPartiallyPaid && data.paidAmount! < data.amount) {
        newDebt.status = 'partially_paid';
      } else {
        newDebt.status = 'paid';
      }
    } else {
      // Check if overdue
      if (data.dueDate < new Date()) {
        newDebt.status = 'overdue';
      } else {
        newDebt.status = 'pending';
      }
    }
    
    console.log('Submitting debt:', newDebt);
    
    // In a real app, this would call the API to add/update the debt
    if (debt) {
      console.log('Updating debt:', debt.id);
    } else {
      console.log('Adding new debt');
    }
    
    onOpenChange(false);
  };
  
  const handlePaidCheckboxChange = (checked: boolean) => {
    setIsPaidChecked(checked);
    
    // If unchecked, reset partial payment status and amount
    if (!checked) {
      setIsPartiallyPaid(false);
      form.setValue('paidAmount', 0);
      form.setValue('paidDate', null);
    } else {
      form.setValue('paidDate', new Date());
    }
    
    form.setValue('isPaid', checked);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{debt ? 'עריכת חוב' : 'הוספת חוב חדש'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Customer Selection */}
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>לקוח</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר לקוח" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Invoice Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="invoiceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>מספר חשבונית</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="invoiceDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>תאריך חשבונית</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full justify-start text-left`}
                          >
                            {field.value ? (
                              format(field.value, 'dd/MM/yyyy')
                            ) : (
                              <span>בחר תאריך חשבונית</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Amount and Currency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>סכום</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>מטבע</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="בחר מטבע" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ILS">₪ שקל</SelectItem>
                        <SelectItem value="USD">$ דולר</SelectItem>
                        <SelectItem value="EUR">€ יורו</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>תיאור</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Due Date */}
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>תאריך יעד לתשלום</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={`w-full justify-start text-left`}
                        >
                          {field.value ? (
                            format(field.value, 'dd/MM/yyyy')
                          ) : (
                            <span>בחר תאריך יעד</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Payment Status */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isPaid" 
                  checked={isPaidChecked}
                  onCheckedChange={handlePaidCheckboxChange}
                />
                <Label htmlFor="isPaid">החוב שולם</Label>
              </div>
              
              {isPaidChecked && (
                <div className="space-y-4 pt-2 border-t">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="isPartiallyPaid" 
                      checked={isPartiallyPaid}
                      onCheckedChange={(checked) => setIsPartiallyPaid(!!checked)}
                    />
                    <Label htmlFor="isPartiallyPaid">תשלום חלקי</Label>
                  </div>
                  
                  {isPartiallyPaid && (
                    <FormField
                      control={form.control}
                      name="paidAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>סכום ששולם</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="paidDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>תאריך תשלום</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full justify-start text-left`}
                              >
                                {field.value ? (
                                  format(field.value, 'dd/MM/yyyy')
                                ) : (
                                  <span>בחר תאריך תשלום</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value || undefined}
                              onSelect={field.onChange}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
            
            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>הערות</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">
                {debt ? 'עדכן חוב' : 'הוסף חוב'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
