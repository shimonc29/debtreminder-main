
import { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface EmailTemplateFormProps {
  existingTemplate?: EmailTemplate;
  onSave: (template: EmailTemplate) => void;
  onCancel: () => void;
}

interface EmailTemplate {
  id?: string;
  name: string;
  description: string;
  subject: string;
  htmlContent: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const defaultTemplate: EmailTemplate = {
  name: '',
  description: '',
  subject: '',
  htmlContent: '',
  isActive: true,
};

export function EmailTemplateForm({ 
  existingTemplate, 
  onSave, 
  onCancel 
}: EmailTemplateFormProps) {
  const [template, setTemplate] = useState<EmailTemplate>(
    existingTemplate || defaultTemplate
  );
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTemplate((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setTemplate((prev) => ({ ...prev, isActive: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      
      // Validation
      if (!template.name || !template.subject || !template.htmlContent) {
        toast({
          variant: "destructive",
          title: "שגיאת אימות",
          description: "אנא מלא את כל השדות הדרושים",
        });
        return;
      }
      
      // Call the parent save handler
      onSave(template);
      
      toast({
        title: `תבנית ${existingTemplate ? 'עודכנה' : 'נוצרה'} בהצלחה`,
        description: `תבנית האימייל "${template.name}" ${existingTemplate ? 'עודכנה' : 'נוצרה'} בהצלחה.`,
      });
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        variant: "destructive",
        title: "שגיאת שמירה",
        description: "אירעה שגיאה בעת שמירת התבנית. נסה שוב מאוחר יותר.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{existingTemplate ? 'ערוך תבנית אימייל' : 'צור תבנית אימייל חדשה'}</CardTitle>
        <CardDescription>
          הגדר תבנית מותאמת אישית לאימיילים. השתמש ב-{'{{'}משתנה{'}}'}  כדי להכניס משתנים דינמיים.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="email-template-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">שם התבנית</Label>
            <Input 
              id="name"
              name="name"
              value={template.name}
              onChange={handleChange}
              placeholder="תזכורת חשבונית"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">נושא האימייל</Label>
            <Input 
              id="subject"
              name="subject"
              value={template.subject}
              onChange={handleChange}
              placeholder="תזכורת לתשלום חשבונית {{invoice}}"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">תיאור התבנית</Label>
            <Textarea 
              id="description"
              name="description"
              value={template.description}
              onChange={handleChange}
              placeholder="תבנית לתזכורות חשבוניות שחלף מועד תשלומן"
              className="h-20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="htmlContent">תוכן האימייל (HTML)</Label>
            <Textarea 
              id="htmlContent"
              name="htmlContent"
              value={template.htmlContent}
              onChange={handleChange}
              placeholder="<p>Hello {{name}}</p>"
              className="min-h-[300px] font-mono text-sm"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              הזן תוכן HTML שיופיע בגוף האימייל. השתמש ב-{'{{'}משתנה{'}}'}  עבור תוכן דינמי.
            </p>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox 
              id="isActive" 
              checked={template.isActive} 
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="isActive">תבנית פעילה</Label>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={onCancel}>
          ביטול
        </Button>
        <Button type="submit" form="email-template-form" disabled={isSaving}>
          {isSaving ? 'שומר...' : existingTemplate ? 'עדכן תבנית' : 'צור תבנית'}
        </Button>
      </CardFooter>
    </Card>
  );
}
