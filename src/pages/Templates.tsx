
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { templates, Template } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TemplatesTable } from '@/components/Templates/TemplatesTable';
import { TemplateDialog } from '@/components/Templates/TemplateDialog';
import { useToast } from "@/hooks/use-toast";

const TemplatesPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [allTemplates, setAllTemplates] = useState<Template[]>(templates);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>(templates);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);
  
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredTemplates(allTemplates);
    } else {
      setFilteredTemplates(allTemplates.filter(template => template.channel === activeFilter));
    }
  }, [activeFilter, allTemplates]);
  
  const handleOpenAddDialog = () => {
    setSelectedTemplate(null);
    setIsDialogOpen(true);
  };
  
  const handleOpenEditDialog = (template: Template) => {
    setSelectedTemplate(template);
    setIsDialogOpen(true);
  };
  
  const handleSaveTemplate = (templateData: Partial<Template>) => {
    if (templateData.isDefault) {
      // If this template is set as default, remove default from other templates of the same channel
      setAllTemplates(prev => 
        prev.map(t => 
          t.channel === templateData.channel && t.id !== templateData.id 
            ? { ...t, isDefault: false } 
            : t
        )
      );
    }
    
    if (templateData.id) {
      // Update existing template
      setAllTemplates(prev => 
        prev.map(t => t.id === templateData.id ? { ...t, ...templateData } : t)
      );
      
      toast({
        title: "התבנית עודכנה",
        description: "התבנית עודכנה בהצלחה",
      });
    } else {
      // Add new template
      const newTemplate: Template = {
        id: `tmpl_${Math.random().toString(36).substr(2, 9)}`,
        userId: 'usr_1', // In a real app, this would be the current user's ID
        name: templateData.name || '',
        channel: templateData.channel || 'email',
        subject: templateData.subject || '',
        body: templateData.body || '',
        isDefault: templateData.isDefault || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setAllTemplates(prev => [...prev, newTemplate]);
      
      toast({
        title: "התבנית נוספה",
        description: "התבנית נוספה בהצלחה",
      });
    }
  };
  
  const handleDeleteTemplate = (templateId: string) => {
    setAllTemplates(prev => prev.filter(t => t.id !== templateId));
    
    toast({
      title: "התבנית נמחקה",
      description: "התבנית נמחקה בהצלחה",
    });
  };
  
  const handleSetDefault = (templateId: string) => {
    const template = allTemplates.find(t => t.id === templateId);
    if (!template) return;
    
    setAllTemplates(prev => 
      prev.map(t => {
        if (t.channel === template.channel) {
          return { ...t, isDefault: t.id === templateId };
        }
        return t;
      })
    );
    
    toast({
      title: "תבנית ברירת מחדל עודכנה",
      description: `התבנית "${template.name}" הוגדרה כברירת מחדל`,
    });
  };
  
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">טוען...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Will redirect in the useEffect
  }
  
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      <div className="flex-1">
        <Navbar />
        
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="page-header">ניהול תבניות</h1>
            <Button onClick={handleOpenAddDialog}>
              <Plus className="ml-2 h-4 w-4" />
              הוסף תבנית חדשה
            </Button>
          </div>
          
          <div className="mb-6">
            <div className="flex space-x-2 space-x-reverse">
              <Button 
                variant={activeFilter === 'all' ? "default" : "outline"}
                onClick={() => handleFilterChange('all')}
                className="text-sm"
              >
                כל התבניות
              </Button>
              <Button 
                variant={activeFilter === 'email' ? "default" : "outline"}
                onClick={() => handleFilterChange('email')}
                className="text-sm"
              >
                אימייל
              </Button>
              <Button 
                variant={activeFilter === 'whatsapp' ? "default" : "outline"}
                onClick={() => handleFilterChange('whatsapp')}
                className="text-sm"
              >
                וואטסאפ
              </Button>
            </div>
          </div>
          
          <div className="mb-8">
            <TemplatesTable 
              templates={filteredTemplates} 
              onEdit={handleOpenEditDialog} 
              onDelete={handleDeleteTemplate}
              onSetDefault={handleSetDefault}
            />
          </div>
          
          <TemplateDialog
            template={selectedTemplate}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSave={handleSaveTemplate}
          />
        </main>
      </div>
    </div>
  );
};

export default TemplatesPage;
