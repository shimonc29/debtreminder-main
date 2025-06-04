
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TemplateEditor } from './TemplateEditor';
import { TemplatePreview } from './TemplatePreview';
import { Template } from '@/lib/db';
import { useToast } from "@/hooks/use-toast";

export interface TemplateDialogProps {
  template?: Template | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (template: Partial<Template>) => void;
}

export function TemplateDialog({ template, open, onOpenChange, onSave }: TemplateDialogProps) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [channel, setChannel] = useState<'email' | 'whatsapp'>('email');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    if (open && template) {
      setName(template.name);
      setChannel(template.channel);
      setSubject(template.subject || '');
      setBody(template.body);
      setIsDefault(template.isDefault);
    } else if (open) {
      // Default values for new template
      setName('');
      setChannel('email');
      setSubject('');
      setBody('התבנית החדשה שלך');
      setIsDefault(false);
    }
  }, [open, template]);

  const handleSave = () => {
    if (!name || !body) {
      toast({
        title: "שגיאה",
        description: "יש למלא את שם התבנית ותוכן ההודעה",
        variant: "destructive",
      });
      return;
    }

    const updatedTemplate: Partial<Template> = {
      name,
      channel,
      subject: channel === 'email' ? subject : '',
      body,
      isDefault
    };

    if (template) {
      updatedTemplate.id = template.id;
    }

    onSave(updatedTemplate);
    onOpenChange(false);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as "edit" | "preview");
  };

  const availablePlaceholders = [
    { key: '{{customerName}}', description: 'שם הלקוח' },
    { key: '{{amount}}', description: 'סכום החוב' },
    { key: '{{currency}}', description: 'סוג המטבע' },
    { key: '{{invoiceNumber}}', description: 'מספר חשבונית' },
    { key: '{{dueDate}}', description: 'תאריך לתשלום' },
    { key: '{{userName}}', description: 'שם המשתמש' },
    { key: '{{companyName}}', description: 'שם החברה' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{template ? 'עריכת תבנית' : 'הוספת תבנית חדשה'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              שם התבנית
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">ערוץ תקשורת</Label>
            <div className="col-span-3">
              <RadioGroup value={channel} onValueChange={(v) => setChannel(v as 'email' | 'whatsapp')}>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="email" id="email" />
                  <Label htmlFor="email">אימייל</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="whatsapp" id="whatsapp" />
                  <Label htmlFor="whatsapp">וואטסאפ</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          {channel === 'email' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                נושא
              </Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="col-span-3"
              />
            </div>
          )}
          
          <div>
            <div className="mb-2 flex justify-between items-start">
              <Label className="text-right">תוכן ההודעה</Label>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Label htmlFor="is-default" className="text-sm text-muted-foreground">
                  תבנית ברירת מחדל
                </Label>
                <Switch
                  id="is-default"
                  checked={isDefault}
                  onCheckedChange={setIsDefault}
                />
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="edit">עריכה</TabsTrigger>
                <TabsTrigger value="preview">תצוגה מקדימה</TabsTrigger>
              </TabsList>
              <TabsContent value="edit">
                <TemplateEditor value={body} onChange={setBody} />
              </TabsContent>
              <TabsContent value="preview">
                <TemplatePreview content={body} />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="mt-2">
            <Label className="text-sm">תגיות זמינות:</Label>
            <div className="mt-1 text-sm text-muted-foreground">
              <ul className="space-y-1 list-disc list-inside">
                {availablePlaceholders.map((placeholder) => (
                  <li key={placeholder.key}>
                    <code className="bg-muted p-1 rounded">{placeholder.key}</code> - {placeholder.description}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            ביטול
          </Button>
          <Button onClick={handleSave}>
            שמור
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
