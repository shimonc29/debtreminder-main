
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Star, Trash } from 'lucide-react';
import { Template } from '@/lib/db';

export interface TemplatesTableProps {
  templates: Template[];
  onEdit: (template: Template) => void;
  onDelete: (templateId: string) => void;
  onSetDefault: (templateId: string) => void;
}

export function TemplatesTable({ templates, onEdit, onDelete, onSetDefault }: TemplatesTableProps) {
  const getChannelBadge = (channel: string) => {
    return channel === 'email' 
      ? <Badge variant="outline" className="bg-blue-50">אימייל</Badge>
      : <Badge variant="outline" className="bg-green-50">וואטסאפ</Badge>;
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>שם תבנית</TableHead>
            <TableHead>ערוץ</TableHead>
            <TableHead>ברירת מחדל</TableHead>
            <TableHead>תאריך עדכון</TableHead>
            <TableHead>פעולות</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map(template => (
            <TableRow key={template.id}>
              <TableCell className="font-medium">{template.name}</TableCell>
              <TableCell>{getChannelBadge(template.channel)}</TableCell>
              <TableCell>
                {template.isDefault ? (
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">ברירת מחדל</Badge>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onSetDefault(template.id)}
                    title="הגדר כברירת מחדל"
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
              <TableCell>{new Date(template.updatedAt).toLocaleDateString('he-IL')}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit(template)}
                    title="ערוך תבנית"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onDelete(template.id)}
                    title="מחק תבנית"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {templates.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                לא נמצאו תבניות
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
