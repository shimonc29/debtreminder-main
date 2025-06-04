
import { Info, Mail, Smartphone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface WhatsAppChannelOptionProps {
  isWhatsAppEnabled: boolean;
  userPlan: string;
  remainingQuota: number;
  onActivate?: () => void;
}

export function WhatsAppChannelOption({ 
  isWhatsAppEnabled, 
  userPlan, 
  remainingQuota,
  onActivate 
}: WhatsAppChannelOptionProps) {
  // Determine if WhatsApp is available for this user's plan
  const isAvailableForPlan = userPlan !== 'free';
  
  // If not available for plan, explain why
  if (!isAvailableForPlan) {
    return (
      <div className="p-4 border rounded-md bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-lg font-medium">WhatsApp</span>
            <Badge variant="outline" className="ml-2">מסלול בתשלום</Badge>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>שליחת הודעות WhatsApp זמינה רק במסלולים בתשלום</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          שדרג למסלול בתשלום כדי לשלוח תזכורות באמצעות WhatsApp
        </p>
        <div className="mt-4">
          <Button variant="outline">שדרג מסלול</Button>
        </div>
      </div>
    );
  }
  
  // If not enabled yet, show activation option
  if (!isWhatsAppEnabled) {
    return (
      <div className="p-4 border rounded-md">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">WhatsApp</span>
          <Badge variant="outline">לא מופעל</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          הפעל שליחת תזכורות באמצעות WhatsApp
        </p>
        <div className="mt-4">
          <Button onClick={onActivate}>הפעל WhatsApp</Button>
        </div>
      </div>
    );
  }
  
  // If enabled, show quota information
  return (
    <div className="p-4 border rounded-md">
      <div className="flex items-center justify-between">
        <span className="text-lg font-medium">WhatsApp</span>
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">מופעל</Badge>
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        ההודעות נשלחות מהמספר המרכזי של המערכת
      </p>
      <p className="text-sm mt-1">
        <span className="font-medium">מכסה חודשית:</span> {remainingQuota} הודעות נותרו
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        המכסה מתחדשת בתחילת כל חודש
      </p>
    </div>
  );
}

// New component for email channel options
interface EmailChannelOptionProps {
  isCustomDomainEnabled: boolean;
  userPlan: string;
  remainingQuota: number;
  onSetupCustomDomain?: () => void;
}

export function EmailChannelOption({ 
  isCustomDomainEnabled, 
  userPlan, 
  remainingQuota,
  onSetupCustomDomain 
}: EmailChannelOptionProps) {
  const isPremiumPlan = userPlan !== 'free';
  
  return (
    <div className="p-4 border rounded-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-lg font-medium">אימייל</span>
          <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">מופעל תמיד</Badge>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>שליחת אימיילים זמינה בכל המסלולים</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex items-center gap-2 mt-2">
        <Mail className="h-4 w-4 text-blue-500" />
        <p className="text-sm text-muted-foreground">
          האימיילים נשלחים מכתובת המערכת המרכזית
        </p>
      </div>
      
      {isPremiumPlan && !isCustomDomainEnabled && (
        <div className="mt-3 p-2 border rounded bg-blue-50">
          <p className="text-sm">במסלול שלך ניתן להגדיר כתובת אימייל מדומיין מותאם אישית</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={onSetupCustomDomain}>
            הגדר אימייל מותאם
          </Button>
        </div>
      )}
      
      {isCustomDomainEnabled && (
        <div className="mt-2">
          <p className="text-sm text-green-600 font-medium">✓ מוגדר עם דומיין מותאם אישית</p>
        </div>
      )}
      
      <p className="text-sm mt-3">
        <span className="font-medium">מכסה חודשית:</span> {isPremiumPlan ? 'ללא הגבלה' : `${remainingQuota} אימיילים נותרו`}
      </p>
      
      {!isPremiumPlan && (
        <p className="text-xs text-muted-foreground mt-1">
          שדרג למסלול בתשלום לקבלת אימיילים ללא הגבלה
        </p>
      )}
    </div>
  );
}
