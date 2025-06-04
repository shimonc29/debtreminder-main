
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Copy, Check } from 'lucide-react';
import { formatDate } from '@/lib/utils';

// Mock data for WhatsApp templates
const mockTemplates = [
  {
    id: '1',
    name: 'תזכורת תשלום חוב',
    status: 'approved',
    category: 'PAYMENT_UPDATE',
    createdAt: new Date('2025-05-01'),
    components: [
      {
        type: 'HEADER',
        text: 'תזכורת לתשלום חוב מ-{{company_name}}',
      },
      {
        type: 'BODY',
        text: 'שלום {{customer_name}}, זוהי תזכורת לתשלום חוב בסך {{amount}} ₪ עבור חשבונית מספר {{invoice_number}}. מועד התשלום האחרון היה {{due_date}}. נודה לך על הסדרת התשלום בהקדם.',
      },
      {
        type: 'FOOTER',
        text: 'להסדרת התשלום או בירור, אנא פנה אלינו.',
      },
    ],
  },
  {
    id: '2',
    name: 'אישור תשלום',
    status: 'approved',
    category: 'PAYMENT_UPDATE',
    createdAt: new Date('2025-05-05'),
    components: [
      {
        type: 'HEADER',
        text: 'אישור תשלום מ-{{company_name}}',
      },
      {
        type: 'BODY',
        text: 'שלום {{customer_name}}, אנו מאשרים קבלת תשלום בסך {{amount}} ₪ עבור חשבונית מספר {{invoice_number}}. תודה על תשלומך.',
      },
      {
        type: 'FOOTER',
        text: 'לכל שאלה, אנא פנה אלינו.',
      },
    ],
  },
  {
    id: '3',
    name: 'תזכורת טרום חוב',
    status: 'pending',
    category: 'PAYMENT_UPDATE',
    createdAt: new Date('2025-05-18'),
    components: [
      {
        type: 'HEADER',
        text: 'תזכורת מ-{{company_name}}',
      },
      {
        type: 'BODY',
        text: 'שלום {{customer_name}}, ברצוננו להזכירך כי חשבונית מספר {{invoice_number}} בסך {{amount}} ₪ עומדת לפירעון בתאריך {{due_date}}. אנא הסדר את התשלום עד לתאריך זה.',
      },
      {
        type: 'FOOTER',
        text: 'לכל שאלה, אנא פנה אלינו.',
      },
    ],
  }
];

export function WhatsAppTemplatesList() {
  const [templates, setTemplates] = useState(mockTemplates);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">מאושר</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">בבדיקה</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">נדחה</Badge>;
      default:
        return <Badge variant="outline">לא ידוע</Badge>;
    }
  };
  
  const handleViewTemplate = (templateId: string) => {
    // In a real app, this would show a dialog with template details
    console.log('View template', templateId);
  };
  
  const handleCopyTemplateId = (templateId: string) => {
    // Copy template ID to clipboard
    navigator.clipboard.writeText(templateId);
    setCopiedId(templateId);
    
    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };
  
  if (templates.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">לא נמצאו תבניות WhatsApp</p>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>שם התבנית</TableHead>
            <TableHead>קטגוריה</TableHead>
            <TableHead>סטטוס</TableHead>
            <TableHead>תאריך יצירה</TableHead>
            <TableHead>פעולות</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.id}>
              <TableCell className="font-medium">{template.name}</TableCell>
              <TableCell>{template.category}</TableCell>
              <TableCell>{getStatusBadge(template.status)}</TableCell>
              <TableCell>{formatDate(template.createdAt)}</TableCell>
              <TableCell className="space-x-1">
                <Button variant="ghost" size="sm" onClick={() => handleViewTemplate(template.id)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleCopyTemplateId(template.id)}
                  className="relative"
                >
                  {copiedId === template.id ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
