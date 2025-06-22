import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { customers, debts, templates, Template, Debt, Customer } from '@/lib/db';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { Info } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReminderDialog({ open, onOpenChange }: ReminderDialogProps) {
  const { toast } = useToast();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [selectedDebtId, setSelectedDebtId] = useState<string>('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [selectedChannel, setSelectedChannel] = useState<string>('email');
  const [messageContent, setMessageContent] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [customerDebts, setCustomerDebts] = useState<Debt[]>([]);
  const [channelTemplates, setChannelTemplates] = useState<Template[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
  const [previewMode, setPreviewMode] = useState('edit');
  
  // Add loading state for sending reminder
  const [isSending, setIsSending] = useState(false);
  
  // WhatsApp specific state
  const [isWhatsAppAvailable, setIsWhatsAppAvailable] = useState<boolean>(true);
  const [whatsappQuota, setWhatsappQuota] = useState<number>(100);
  const [userPlan, setUserPlan] = useState<string>('basic'); // free, basic, pro, enterprise
  
  // Handle customer selection
  useEffect(() => {
    if (selectedCustomerId) {
      const customer = customers.find(c => c.id === selectedCustomerId) || null;
      setSelectedCustomer(customer);
      
      // Get debts for this customer
      const customerDebts = debts.filter(debt => debt.customerId === selectedCustomerId);
      setCustomerDebts(customerDebts);
      
      // Reset debt selection
      setSelectedDebtId('');
      setSelectedDebt(null);
    } else {
      setCustomerDebts([]);
      setSelectedDebtId('');
      setSelectedCustomer(null);
    }
  }, [selectedCustomerId]);
  
  // Handle debt selection
  useEffect(() => {
    if (selectedDebtId) {
      const debt = debts.find(d => d.id === selectedDebtId) || null;
      setSelectedDebt(debt);
    } else {
      setSelectedDebt(null);
    }
  }, [selectedDebtId]);
  
  // Handle channel selection
  useEffect(() => {
    const filteredTemplates = templates.filter(t => t.channel === selectedChannel);
    setChannelTemplates(filteredTemplates);
    
    // Select default template if available
    const defaultTemplate = filteredTemplates.find(t => t.isDefault);
    if (defaultTemplate) {
      setSelectedTemplateId(defaultTemplate.id);
    } else if (filteredTemplates.length > 0) {
      setSelectedTemplateId(filteredTemplates[0].id);
    } else {
      setSelectedTemplateId('');
    }
  }, [selectedChannel]);
  
  // Handle template selection
  useEffect(() => {
    if (selectedTemplateId && selectedCustomer && selectedDebt) {
      const template = templates.find(t => t.id === selectedTemplateId);
      
      if (template) {
        let content = template.body;
        
        // Replace placeholders with actual values
        content = content.replace(/\{\{customerName\}\}/g, selectedCustomer.name);
        content = content.replace(/\{\{amount\}\}/g, selectedDebt.amount.toString());
        content = content.replace(/\{\{currency\}\}/g, selectedDebt.currency);
        content = content.replace(/\{\{invoiceNumber\}\}/g, selectedDebt.invoiceNumber);
        content = content.replace(/\{\{dueDate\}\}/g, formatDate(selectedDebt.dueDate));
        content = content.replace(/\{\{userName\}\}/g, 'מיכאל כהן');
        content = content.replace(/\{\{companyName\}\}/g, 'דיגיטל סולושנס בע״מ');
        
        setMessageContent(content);
        
        if (template.subject) {
          let subjectText = template.subject;
          subjectText = subjectText.replace(/\{\{customerName\}\}/g, selectedCustomer.name);
          subjectText = subjectText.replace(/\{\{invoiceNumber\}\}/g, selectedDebt.invoiceNumber);
          setSubject(subjectText);
        }
      }
    }
  }, [selectedTemplateId, selectedCustomer, selectedDebt]);
  
  const getChannelDescription = (channel: string) => {
    if (channel === 'email') {
      return 'ההודעה תישלח לכתובת האימייל של הלקוח';
    } else if (channel === 'whatsapp') {
      const phoneInfo = selectedCustomer?.phone ? `(${selectedCustomer.phone})` : '';
      return `ההודעה תישלח למספר הטלפון של הלקוח ${phoneInfo} דרך המספר המרכזי של המערכת. ${whatsappQuota} הודעות נותרו במכסה החודשית.`;
    }
    return '';
  };
  
  const handleSend = async () => {
    if (!selectedCustomerId || !selectedDebtId || !selectedTemplateId || !messageContent) {
      toast({
        title: "שגיאה",
        description: "יש למלא את כל השדות הנדרשים",
        variant: "destructive",
      });
      return;
    }
    
    // WhatsApp specific validation
    if (selectedChannel === 'whatsapp' && !selectedCustomer?.phone) {
      toast({
        title: "שגיאה",
        description: "לא ניתן לשלוח הודעת WhatsApp - מספר טלפון חסר",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedChannel === 'whatsapp' && whatsappQuota <= 0) {
      toast({
        title: "שגיאה",
        description: "חרגת ממכסת הודעות ה-WhatsApp החודשית",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    try {
      // In a real app, this would call an API to send the reminder
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "נשלחה תזכורת",
        description: selectedChannel === 'email' 
          ? "התזכורת נשלחה בהצלחה לאימייל הלקוח" 
          : "התזכורת נשלחה בהצלחה ל-WhatsApp של הלקוח",
      });
      
      // If this is a WhatsApp message, reduce the quota
      if (selectedChannel === 'whatsapp') {
        setWhatsappQuota(prev => prev - 1);
      }
      
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Send reminder error:', error);
      toast({
        title: "שגיאה",
        description: error instanceof Error 
          ? `שגיאה בשליחת התזכורת: ${error.message}`
          : "שגיאה בשליחת התזכורת. אנא נסה שוב מאוחר יותר.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  const resetForm = () => {
    setSelectedCustomerId('');
    setSelectedDebtId('');
    setSelectedTemplateId('');
    setSelectedChannel('email');
    setMessageContent('');
    setSubject('');
    setPreviewMode('edit');
  };
  
  // Reset form when dialog is opened
  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>שליחת תזכורת ידנית</DialogTitle>
          <DialogDescription>
            שלח תזכורת ללקוח באמצעות אימייל או WhatsApp
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customer" className="text-right">
              לקוח
            </Label>
            <div className="col-span-3">
              <Select
                value={selectedCustomerId}
                onValueChange={setSelectedCustomerId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר לקוח" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {selectedCustomerId && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="debt" className="text-right">
                חוב
              </Label>
              <div className="col-span-3">
                <Select
                  value={selectedDebtId}
                  onValueChange={setSelectedDebtId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר חוב" />
                  </SelectTrigger>
                  <SelectContent>
                    {customerDebts.map((debt) => (
                      <SelectItem key={debt.id} value={debt.id}>
                        {debt.invoiceNumber} - {formatCurrency(debt.amount, debt.currency)} - {debt.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="channel" className="text-right">
              ערוץ תקשורת
            </Label>
            <div className="col-span-3">
              <RadioGroup
                value={selectedChannel}
                onValueChange={setSelectedChannel}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2 ml-4">
                  <RadioGroupItem value="email" id="email" />
                  <Label htmlFor="email">אימייל</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="whatsapp" 
                    id="whatsapp" 
                    disabled={!isWhatsAppAvailable || userPlan === 'free'}
                  />
                  <Label htmlFor="whatsapp" className={!isWhatsAppAvailable || userPlan === 'free' ? "text-muted-foreground" : ""}>
                    WhatsApp
                  </Label>
                  {(userPlan === 'free') && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent side="right" align="start">
                          <p>שליחת הודעות WhatsApp זמינה רק במסלולים בתשלום</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </RadioGroup>
              
              {selectedChannel && selectedCustomer && (
                <p className="text-sm text-muted-foreground mt-2">
                  {getChannelDescription(selectedChannel)}
                </p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="template" className="text-right">
              תבנית
            </Label>
            <div className="col-span-3">
              <Select
                value={selectedTemplateId}
                onValueChange={setSelectedTemplateId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר תבנית" />
                </SelectTrigger>
                <SelectContent>
                  {channelTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}{template.isDefault ? " (ברירת מחדל)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {selectedChannel === 'email' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                נושא
              </Label>
              <div className="col-span-3">
                <Textarea
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="resize-none"
                  rows={1}
                />
              </div>
            </div>
          )}
          
          <Tabs value={previewMode} onValueChange={setPreviewMode} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit">עריכה</TabsTrigger>
              <TabsTrigger value="preview">תצוגה מקדימה</TabsTrigger>
            </TabsList>
            <TabsContent value="edit">
              <Textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="resize-none min-h-[200px]"
                rows={8}
              />
            </TabsContent>
            <TabsContent value="preview" className="border p-4 rounded-md min-h-[200px] whitespace-pre-wrap">
              {messageContent}
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSending}
          >
            ביטול
          </Button>
          <Button 
            onClick={handleSend}
            disabled={isSending}
          >
            {isSending ? 'שולח...' : 'שלח תזכורת'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
