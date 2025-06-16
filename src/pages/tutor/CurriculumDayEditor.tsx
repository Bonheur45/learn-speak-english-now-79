import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { getCurriculumTemplate } from '@/services/curriculumTemplates';
import { getTrimesterDays, updateCurriculumDay } from '@/services/curriculum';
import DayContentEditor from '@/components/DayContentEditor';
import { toast } from '@/hooks/use-toast';

const CurriculumDayEditor = () => {
  const { curriculumId, trimesterId, dayId } = useParams();
  const navigate = useNavigate();
  
  // For now, fetch day data from API
  const [loading, setLoading] = useState(true);
  const [templateLevel, setTemplateLevel] = useState<string>('');
  const [trimesterName, setTrimesterName] = useState<string>('');
  const [dayData, setDayData] = useState<any | null>(null);

  useEffect(() => {
    if (!curriculumId || !trimesterId || !dayId) return;

    // Fetch template level, trimester name (optional), and day info
    Promise.all([
      getCurriculumTemplate(curriculumId),
      getTrimesterDays(trimesterId),
    ])
      .then(([tmpl, days]) => {
        setTemplateLevel(tmpl.level);
        const day = days.find((d) => d.id === dayId);
        if (!day) throw new Error('Day not found');
        setDayData(day);
        // trimester name is placeholder; ideally fetched from separate service
        setTrimesterName(`Trimester`);
      })
      .catch((err) => {
        console.error(err);
        toast({ title: 'Error', description: 'Failed to load day data', variant: 'destructive' });
      })
      .finally(() => setLoading(false));
  }, [curriculumId, trimesterId, dayId]);

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  if (!dayData) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar isLoggedIn={true} userRole="tutor" />
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Day Not Found</h1>
          </div>
        </div>
      </div>
    );
  }

  const handleSave = async (updatedDayData: any) => {
    try {
      await updateCurriculumDay(dayId!, updatedDayData);
      setDayData(updatedDayData);
      toast({
        title: 'Curriculum Template Saved',
        description: `Day ${updatedDayData.day_number} template has been updated successfully.`,
      });
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to save day', variant: 'destructive' });
    }
  };

  const handleSaveAndExit = async () => {
    try {
      await updateCurriculumDay(dayId!, dayData);
      toast({
        title: 'Template Saved',
        description: `All changes to Day ${dayData.day_number} have been saved.`,
      });
      navigate(`/tutor/curriculum/${curriculumId}/trimester/${trimesterId}`);
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to save day', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isLoggedIn={true} userRole="tutor" />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link to="/tutor/curriculum" className="hover:text-brand-blue">Curriculum Templates</Link>
            <span>/</span>
            <Link to={`/tutor/curriculum/${curriculumId}`} className="hover:text-brand-blue">{templateLevel}</Link>
            <span>/</span>
            <Link to={`/tutor/curriculum/${curriculumId}/trimester/${trimesterId}`} className="hover:text-brand-blue">{trimesterName}</Link>
            <span>/</span>
            <span className="font-medium">Day {dayData.day_number}</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-brand-blue">Edit Day {dayData.day_number}</h1>
              <p className="text-gray-600 mt-1">Update lesson content and materials</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" size="sm">
                <Link to={`/tutor/curriculum/${curriculumId}/trimester/${trimesterId}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Days
                </Link>
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button onClick={handleSaveAndExit} className="bg-brand-yellow text-brand-blue hover:brightness-95">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 mb-6">
            <p className="text-amber-800 text-sm">
              <strong>Template Editing:</strong> You are editing the master curriculum template. 
              This content will be available for new cohorts to use as their starting point.
            </p>
          </div>
        </div>

        {/* Content Editor */}
        <DayContentEditor 
          day={dayData}
          onSave={handleSave}
        />
      </main>
      
      <footer className="bg-white border-t py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Let's Do It English. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CurriculumDayEditor;
