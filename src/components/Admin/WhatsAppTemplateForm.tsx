
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { toast } from '@/components/ui/sonner';

type TemplateVariable = {
  id: string;
  name: string;
  example: string;
};

interface WhatsAppTemplateFormProps {
  initialTemplate?: {
    id?: string;
    name: string;
    content: string;
    language: string;
    category: string;
    variables: TemplateVariable[];
  };
  onSubmit: (template: any) => void;
  onCancel: () => void;
}

export function WhatsAppTemplateForm({ initialTemplate, onSubmit, onCancel }: WhatsAppTemplateFormProps) {
  const defaultTemplate = {
    name: '',
    content: '',
    language: 'he',
    category: 'MARKETING',
    variables: [] as TemplateVariable[],
  };

  const [template, setTemplate] = useState(initialTemplate || defaultTemplate);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const languages = [
    { value: 'he', label: 'עברית' },
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'العربية' },
    { value: 'ru', label: 'Русский' },
  ];

  const categories = [
    { value: 'MARKETING', label: 'שיווק' },
    { value: 'UTILITY', label: 'שירות' },
    { value: 'AUTHENTICATION', label: 'אימות' },
  ];

  const handleChange = (field: string, value: string) => {
    setTemplate({ ...template, [field]: value });
    
    // Clear validation error when user types
    if (validationErrors[field]) {
      const newErrors = { ...validationErrors };
      delete newErrors[field];
      setValidationErrors(newErrors);
    }
  };

  const handleVariableChange = (index: number, field: string, value: string) => {
    const updatedVariables = [...template.variables];
    updatedVariables[index] = { 
      ...updatedVariables[index], 
      [field]: value 
    };
    
    setTemplate({ ...template, variables: updatedVariables });
  };

  const addVariable = () => {
    setTemplate({
      ...template,
      variables: [
        ...template.variables,
        { id: crypto.randomUUID(), name: '', example: '' }
      ]
    });
  };

  const removeVariable = (index: number) => {
    const updatedVariables = [...template.variables];
    updatedVariables.splice(index, 1);
    setTemplate({ ...template, variables: updatedVariables });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!template.name.trim()) {
      errors.name = 'שם התבנית הוא שדה חובה';
    }
    
    if (!template.content.trim()) {
      errors.content = 'תוכן ההודעה הוא שדה חובה';
    }
    
    // Validate variables
    template.variables.forEach((variable, index) => {
      if (!variable.name.trim()) {
        errors[`variable_${index}_name`] = 'שם המשתנה הוא שדה חובה';
      }
      if (!variable.example.trim()) {
        errors[`variable_${index}_example`] = 'דוגמה היא שדה חובה';
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(template);
      toast.success("התבנית נשמרה בהצלחה");
    }
  };

  const renderVariableInContent = (variable: TemplateVariable) => {
    return (
      <Badge key={variable.id} variant="secondary" className="mx-1">
        {`{{${variable.name}}}`}
      </Badge>
    );
  };

  const renderContentPreview = () => {
    if (!template.content) return null;
    
    let content = template.content;
    const segments = [];
    let lastIndex = 0;
    
    // Replace variables with badges
    template.variables.forEach(variable => {
      const placeholder = `{{${variable.name}}}`;
      const index = content.indexOf(placeholder, lastIndex);
      
      if (index !== -1) {
        // Add text before the variable
        if (index > lastIndex) {
          segments.push(content.substring(lastIndex, index));
        }
        
        // Add the variable badge
        segments.push(renderVariableInContent(variable));
        
        lastIndex = index + placeholder.length;
      }
    });
    
    // Add remaining text
    if (lastIndex < content.length) {
      segments.push(content.substring(lastIndex));
    }
    
    return segments;
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{initialTemplate ? 'ערוך תבנית' : 'צור תבנית חדשה'}</CardTitle>
          <CardDescription>
            יצירת תבנית הודעות WhatsApp לשימוש בתזכורות
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">שם התבנית</Label>
            <Input
              id="name"
              value={template.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="שם התבנית לשימוש פנימי"
              className={validationErrors.name ? "border-red-500" : ""}
            />
            {validationErrors.name && (
              <p className="text-red-500 text-sm">{validationErrors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">שפה</Label>
              <Select
                value={template.language}
                onValueChange={(value) => handleChange('language', value)}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="בחר שפה" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.value} value={language.value}>
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">קטגוריה</Label>
              <Select
                value={template.category}
                onValueChange={(value) => handleChange('category', value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="בחר קטגוריה" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">תוכן ההודעה</Label>
            <Textarea
              id="content"
              value={template.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="הכנס את תוכן ההודעה. השתמש ב-{{variable_name}} להכנסת משתנים."
              className={`min-h-[120px] ${validationErrors.content ? "border-red-500" : ""}`}
            />
            {validationErrors.content && (
              <p className="text-red-500 text-sm">{validationErrors.content}</p>
            )}
          </div>

          {template.content && (
            <div className="bg-muted p-4 rounded-md">
              <Label className="mb-2 block">תצוגה מקדימה:</Label>
              <div className="text-sm">{renderContentPreview()}</div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>משתנים</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addVariable}
              >
                <Plus className="h-4 w-4 mr-2" /> הוסף משתנה
              </Button>
            </div>
            
            {template.variables.length === 0 ? (
              <p className="text-sm text-muted-foreground">אין משתנים. הוסף משתנים כדי ליצור הודעות דינמיות.</p>
            ) : (
              <div className="space-y-4">
                {template.variables.map((variable, index) => (
                  <div key={variable.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-start">
                    <div>
                      <Input
                        value={variable.name}
                        onChange={(e) => handleVariableChange(index, 'name', e.target.value)}
                        placeholder="שם המשתנה"
                        className={validationErrors[`variable_${index}_name`] ? "border-red-500" : ""}
                      />
                      {validationErrors[`variable_${index}_name`] && (
                        <p className="text-red-500 text-sm">{validationErrors[`variable_${index}_name`]}</p>
                      )}
                    </div>
                    <div>
                      <Input
                        value={variable.example}
                        onChange={(e) => handleVariableChange(index, 'example', e.target.value)}
                        placeholder="דוגמה"
                        className={validationErrors[`variable_${index}_example`] ? "border-red-500" : ""}
                      />
                      {validationErrors[`variable_${index}_example`] && (
                        <p className="text-red-500 text-sm">{validationErrors[`variable_${index}_example`]}</p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeVariable(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            ביטול
          </Button>
          <Button type="submit">
            {initialTemplate ? 'עדכן תבנית' : 'צור תבנית'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
