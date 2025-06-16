import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Cohort, getCohorts, CohortTrimester, getCohortTrimesters, getCohortTrimesterDays } from '@/services/cohorts';
import { toast } from '@/hooks/use-toast';
import { Upload, File, Check } from 'lucide-react';

const UploadPage = () => {
  const [cohortId, setCohortId] = useState('');
  const [trimesterId, setTrimesterId] = useState('');
  const [dayId, setDayId] = useState('');
  const [materialType, setMaterialType] = useState<'audio' | 'video' | 'doc' | 'form'>('doc');
  const [accent, setAccent] = useState<'American' | 'British' | null>(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [trimesters, setTrimesters] = useState<CohortTrimester[]>([]);
  const [days, setDays] = useState<any[]>([]);
  
  useEffect(() => {
    getCohorts()
      .then(setCohorts)
      .catch((err) => console.error(err));
  }, []);
  
  useEffect(() => {
    if (!cohortId) {
      setTrimesters([]);
      setTrimesterId('');
      return;
    }
    getCohortTrimesters(cohortId)
      .then((tris) => {
        setTrimesters(tris);
        if (!tris.find((t) => t.id === trimesterId)) {
          setTrimesterId('');
          setDays([]);
        }
      })
      .catch((err) => console.error(err));
  }, [cohortId]);
  
  useEffect(() => {
    if (!cohortId || !trimesterId) {
      setDays([]);
      setDayId('');
      return;
    }
    getCohortTrimesterDays(cohortId, trimesterId)
      .then((d) => {
        setDays(d);
        if (!d.find((d:any) => d.id === dayId)) {
          setDayId('');
        }
      })
      .catch((err) => console.error(err));
  }, [cohortId, trimesterId]);
  
  const availableTrimesters = trimesters;
  const availableDays = days;
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // In a real app, here we would prepare for upload
      setFileUploaded(true);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!cohortId || !trimesterId || !dayId || !materialType || (materialType === 'audio' && !accent)) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (!fileUploaded && materialType !== 'form') {
      toast({
        title: "No file selected",
        description: "Please upload a file",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate upload
    setIsUploading(true);
    
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 10;
        
        if (newProgress >= 100) {
          clearInterval(uploadInterval);
          setIsUploading(false);
          
          toast({
            title: "Upload Successful",
            description: "Your material has been uploaded successfully",
          });
          
          // Reset form after delay
          setTimeout(() => {
            setFileUploaded(false);
            setUploadProgress(0);
          }, 1000);
          
          return 100;
        }
        
        return newProgress;
      });
    }, 300);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isLoggedIn={true} userRole="tutor" />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-brand-blue">Upload Learning Materials</h1>
            <p className="text-gray-600">Add new content for your students to access</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button asChild variant="outline">
              <Link to="/tutor/materials">View All Materials</Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Upload New Material</CardTitle>
                <CardDescription>Select a cohort, trimester, and day to add materials to</CardDescription>
              </CardHeader>
              
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cohort">Cohort</Label>
                      <Select value={cohortId} onValueChange={setCohortId}>
                        <SelectTrigger id="cohort">
                          <SelectValue placeholder="Select a cohort" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Active Cohorts</SelectLabel>
                            {cohorts.filter(c => c.status === 'active').map((cohort) => (
                              <SelectItem key={cohort.id} value={cohort.id}>
                                {cohort.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Upcoming Cohorts</SelectLabel>
                            {cohorts.filter(c => c.status === 'upcoming').map((cohort) => (
                              <SelectItem key={cohort.id} value={cohort.id}>
                                {cohort.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="trimester">Trimester</Label>
                      <Select 
                        value={trimesterId} 
                        onValueChange={setTrimesterId}
                        disabled={!cohortId || availableTrimesters.length === 0}
                      >
                        <SelectTrigger id="trimester">
                          <SelectValue placeholder="Select a trimester" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTrimesters.map((trimester) => (
                            <SelectItem key={trimester.id} value={trimester.id}>
                              {trimester.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="day">Day</Label>
                      <Select 
                        value={dayId} 
                        onValueChange={setDayId}
                        disabled={!trimesterId || availableDays.length === 0}
                      >
                        <SelectTrigger id="day">
                          <SelectValue placeholder="Select a day" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableDays.map((day: any) => (
                            <SelectItem key={day.id} value={day.id}>
                              Day {day.day_number}: {day.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Material Type</Label>
                      <RadioGroup 
                        defaultValue="doc" 
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2"
                        onValueChange={(value) => setMaterialType(value as any)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="doc" id="doc" />
                          <Label htmlFor="doc" className="cursor-pointer">Document</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="audio" id="audio" />
                          <Label htmlFor="audio" className="cursor-pointer">Audio</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="video" id="video" />
                          <Label htmlFor="video" className="cursor-pointer">Video</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="form" id="form" />
                          <Label htmlFor="form" className="cursor-pointer">Form/Quiz</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {materialType === 'audio' && (
                      <div>
                        <Label>Accent</Label>
                        <RadioGroup 
                          className="grid grid-cols-2 gap-4 mt-2"
                          onValueChange={(value) => setAccent(value as any)}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="American" id="american" />
                            <Label htmlFor="american" className="cursor-pointer">American</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="British" id="british" />
                            <Label htmlFor="british" className="cursor-pointer">British</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="title">Material Title</Label>
                      <Input id="title" placeholder="Enter a title for this material" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea id="description" placeholder="Briefly describe this learning material" />
                    </div>
                    
                    {materialType === 'form' ? (
                      <div className="space-y-2">
                        <Label htmlFor="formUrl">Form URL</Label>
                        <Input id="formUrl" placeholder="Enter Google Form or quiz URL" type="url" />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="fileUpload">Upload File</Label>
                        <div className={`border-2 border-dashed rounded-lg p-6 ${fileUploaded ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'} transition-colors`}>
                          {!fileUploaded ? (
                            <div className="text-center">
                              <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                              <p className="text-sm font-medium mb-1">
                                {materialType === 'audio' ? (
                                  'Upload MP3 audio file'
                                ) : materialType === 'video' ? (
                                  'Upload MP4 video file'
                                ) : (
                                  'Upload PDF document'
                                )}
                              </p>
                              <p className="text-xs text-gray-500 mb-3">
                                Drag and drop or click to browse
                              </p>
                              <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('fileInput')?.click()}>
                                Select File
                              </Button>
                              <input 
                                id="fileInput" 
                                type="file" 
                                className="hidden" 
                                onChange={handleFileChange}
                                accept={
                                  materialType === 'audio' ? '.mp3,audio/*' : 
                                  materialType === 'video' ? '.mp4,video/*' : 
                                  '.pdf,application/pdf'
                                }
                              />
                            </div>
                          ) : (
                            <div className="text-center">
                              <div className="flex items-center justify-center">
                                <File className="h-8 w-8 text-green-500 mr-2" />
                                <Check className="h-6 w-6 text-green-500" />
                              </div>
                              <p className="mt-2 font-medium text-green-700">File ready to upload</p>
                              <p className="text-sm text-green-600 mt-1">example-file.pdf</p>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                className="mt-2"
                                onClick={() => setFileUploaded(false)}
                              >
                                Replace File
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {isUploading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between border-t pt-6">
                  <Button type="button" variant="outline">Cancel</Button>
                  <Button type="submit" disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Upload Material'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Upload Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Supported Formats</h3>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    <li>Documents: PDF files only</li>
                    <li>Audio: MP3 format (max 20MB)</li>
                    <li>Video: MP4 format (max 100MB)</li>
                    <li>Forms: Google Forms or Microsoft Forms links</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Best Practices</h3>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    <li>Use clear, descriptive titles</li>
                    <li>Keep audio and video files brief and focused</li>
                    <li>Ensure documents are accessible and readable</li>
                    <li>Test forms before sharing with students</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-blue-800 font-medium mb-2">Need Help?</h3>
                  <p className="text-sm text-blue-700">
                    If you're having trouble uploading materials or have questions about file formats, contact support.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Let's Do It English. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default UploadPage;
