
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export interface TemplatePreviewProps {
  content: string;
}

export function TemplatePreview({ content }: TemplatePreviewProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="p-4">
        <div 
          className="prose prose-sm max-w-none" 
          dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }} 
        />
      </CardContent>
    </Card>
  );
}
