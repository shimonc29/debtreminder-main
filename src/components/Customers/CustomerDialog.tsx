
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Customer } from '@/lib/db';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

// Schema for validation
const customerSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'השם חייב להכיל לפחות 2 תווים' }),
  email: z
    .string()
    .email({ message: 'נא להזין כתובת אימייל תקינה' }),
  phone: z
    .string()
    .min(9, { message: 'מספר הטלפון חייב להכיל לפחות 9 ספרות' })
    .regex(/^[0-9\-\+\(\)\ ]+$/, { message: 'מספר הטלפון מכיל תווים לא חוקיים' }),
  notes: z
    .string()
    .optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  onSubmit: (data: Customer) => void;
  mode: 'add' | 'edit';
}

export function CustomerDialog({
  open,
  onOpenChange,
  customer,
  onSubmit,
  mode
}: CustomerDialogProps) {
  // Initialize form
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      notes: ''
    }
  });

  // Update form values when customer changes
  useEffect(() => {
    if (customer) {
      form.reset({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        notes: customer.notes
      });
    } else {
      form.reset({
        name: '',
        email: '',
        phone: '',
        notes: ''
      });
    }
  }, [customer, form]);

  // Handle form submission
  const handleSubmit = (values: CustomerFormValues) => {
    if (mode === 'edit' && customer) {
      onSubmit({ ...customer, ...values });
    } else {
      onSubmit(values as Customer);
    }
  };

  const title = mode === 'add' ? 'הוספת לקוח חדש' : 'עריכת לקוח';
  const description = mode === 'add' ? 'הזן את פרטי הלקוח החדש' : 'ערוך את פרטי הלקוח';
  const actionText = mode === 'add' ? 'הוסף לקוח' : 'שמור שינויים';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>שם</FormLabel>
                  <FormControl>
                    <Input placeholder="הזן את שם הלקוח" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>אימייל</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="הזן את כתובת האימייל" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>טלפון</FormLabel>
                  <FormControl>
                    <Input placeholder="הזן את מספר הטלפון" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>הערות</FormLabel>
                  <FormControl>
                    <Textarea placeholder="הזן הערות נוספות" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                ביטול
              </Button>
              <Button type="submit">{actionText}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
