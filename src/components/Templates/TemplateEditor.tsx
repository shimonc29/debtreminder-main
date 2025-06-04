
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline, List } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface TemplateEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const TemplateEditor = ({ value, onChange, placeholder }: TemplateEditorProps) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const applyFormat = (format: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let formattedText = '';
    let newCursorPos = end;
    
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        newCursorPos = end + 4;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        newCursorPos = end + 2;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        newCursorPos = end + 4;
        break;
      case 'list':
        formattedText = `\n- ${selectedText}`;
        newCursorPos = end + 3;
        break;
      default:
        return;
    }
    
    const newValue = value.substring(0, start) + formattedText + value.substring(end);
    onChange(newValue);
    
    // Set cursor position after the formatting is applied
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start === end ? newCursorPos : start, newCursorPos);
    }, 0);
  };

  const addTag = (tag: string) => {
    const tagText = `{{${tag}}}`;
    const newValue = value + tagText;
    onChange(newValue);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        <ToggleGroup type="multiple">
          <ToggleGroupItem value="bold" aria-label="Toggle bold" onClick={() => applyFormat('bold')}>
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic" onClick={() => applyFormat('italic')}>
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Toggle underline" onClick={() => applyFormat('underline')}>
            <Underline className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="Add list" onClick={() => applyFormat('list')}>
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-40 min-h-[160px] font-sans"
        dir="rtl"
      />
    </div>
  );
};
