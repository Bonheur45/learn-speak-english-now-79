
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

// Mock data for days/materials
const dayMaterials = [
  {
    id: 1,
    title: "Introduction to Present Tense",
    description: "Learn the basics of present tense verbs in English",
    materials: [
      { id: 1, type: "pdf", name: "Present Tense Guidelines.pdf", size: "1.2 MB", date: "2025-01-15" },
      { id: 2, type: "audio", name: "Present Tense Examples (US).mp3", size: "3.5 MB", date: "2025-01-15", accent: "American" },
      { id: 3, type: "audio", name: "Present Tense Examples (UK).mp3", size: "3.2 MB", date: "2025-01-15", accent: "British" },
      { id: 4, type: "video", name: "Present Tense Explained.mp4", size: "25 MB", date: "2025-01-16" },
    ]
  },
  {
    id: 2,
    title: "Daily Routines Vocabulary",
    description: "Essential vocabulary for describing daily activities",
    materials: [
      { id: 5, type: "pdf", name: "Daily Routines Word List.pdf", size: "0.8 MB", date: "2025-01-18" },
      { id: 6, type: "audio", name: "Daily Routines Pronunciation (US).mp3", size: "4.2 MB", date: "2025-01-18", accent: "American" },
      { id: 7, type: "audio", name: "Daily Routines Pronunciation (UK).mp3", size: "4.0 MB", date: "2025-01-18", accent: "British" },
      { id: 8, type: "form", name: "Daily Routines Practice Quiz", size: null, date: "2025-01-19", url: "https://forms.google.com/xyz" },
    ]
  },
  {
    id: 3,
    title: "Asking Questions",
    description: "How to form questions in English with examples",
    materials: [
      { id: 9, type: "pdf", name: "Question Formation Guide.pdf", size: "1.5 MB", date: "2025-01-22" },
      { id: 10, type: "audio", name: "Question Intonation (US).mp3", size: "3.8 MB", date: "2025-01-22", accent: "American" },
      { id: 11, type: "audio", name: "Question Intonation (UK).mp3", size: "3.7 MB", date: "2025-01-22", accent: "British" },
      { id: 12, type: "video", name: "Common Question Mistakes.mp4", size: "18 MB", date: "2025-01-23" },
    ]
  },
];

const Materials = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter days based on search query
  const filteredDays = dayMaterials.filter(day =>
    day.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    day.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get icon based on material type
  const getMaterialIcon = (type: string) => {
    switch(type) {
      case 'pdf':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'audio':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414-1.414m-2.828 4.242a9 9 0 002.828-2.828" />
          </svg>
        );
      case 'video':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'form':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>
        );
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isLoggedIn={true} userRole="tutor" />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-brand-blue">Learning Materials</h1>
            <p className="text-gray-600">Manage materials across all days</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-4">
            <Button asChild variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white">
              <Link to="/tutor/assessments">Manage Assessments</Link>
            </Button>
            <Button asChild className="bg-brand-yellow text-brand-blue hover:brightness-95">
              <Link to="/tutor/upload">Upload New Material</Link>
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search days by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/3"
          />
        </div>
        
        <div className="space-y-6">
          {filteredDays.length > 0 ? (
            filteredDays.map((day) => (
              <Card key={day.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 border-b">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle>{day.title}</CardTitle>
                      <CardDescription className="mt-1">{day.description}</CardDescription>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <Button asChild variant="outline" size="sm" className="text-brand-blue">
                        <Link to={`/tutor/day/${day.id}`}>Edit Day</Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="all">All Materials</TabsTrigger>
                      <TabsTrigger value="documents">Documents</TabsTrigger>
                      <TabsTrigger value="audio">Audio</TabsTrigger>
                      <TabsTrigger value="video">Video</TabsTrigger>
                      <TabsTrigger value="forms">Forms</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left border-b">
                              <th className="pb-3">Type</th>
                              <th className="pb-3">Name</th>
                              <th className="pb-3">Size</th>
                              <th className="pb-3">Date Added</th>
                              <th className="pb-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {day.materials.map((material) => (
                              <tr key={material.id} className="border-b">
                                <td className="py-3">
                                  <div className="flex items-center">
                                    {getMaterialIcon(material.type)}
                                    <span className="ml-2 capitalize">{material.type}</span>
                                    {material.accent && (
                                      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                        material.accent === 'American' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                                      }`}>
                                        {material.accent}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3">{material.name}</td>
                                <td className="py-3">{material.size || 'N/A'}</td>
                                <td className="py-3">{material.date}</td>
                                <td className="py-3">
                                  <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600">
                                      Preview
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-600">
                                      Replace
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-red-600">
                                      Remove
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="documents">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left border-b">
                              <th className="pb-3">Name</th>
                              <th className="pb-3">Size</th>
                              <th className="pb-3">Date Added</th>
                              <th className="pb-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {day.materials.filter(m => m.type === 'pdf').map((material) => (
                              <tr key={material.id} className="border-b">
                                <td className="py-3 flex items-center">
                                  {getMaterialIcon(material.type)}
                                  <span className="ml-2">{material.name}</span>
                                </td>
                                <td className="py-3">{material.size}</td>
                                <td className="py-3">{material.date}</td>
                                <td className="py-3">
                                  <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600">
                                      Preview
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-600">
                                      Replace
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-red-600">
                                      Remove
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>
                    
                    {/* Similar TabsContent for other material types */}
                    <TabsContent value="audio">
                      {day.materials.filter(m => m.type === 'audio').length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="text-left border-b">
                                <th className="pb-3">Name</th>
                                <th className="pb-3">Accent</th>
                                <th className="pb-3">Size</th>
                                <th className="pb-3">Date Added</th>
                                <th className="pb-3">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {day.materials.filter(m => m.type === 'audio').map((material) => (
                                <tr key={material.id} className="border-b">
                                  <td className="py-3 flex items-center">
                                    {getMaterialIcon(material.type)}
                                    <span className="ml-2">{material.name}</span>
                                  </td>
                                  <td className="py-3">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                      material.accent === 'American' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                      {material.accent}
                                    </span>
                                  </td>
                                  <td className="py-3">{material.size}</td>
                                  <td className="py-3">{material.date}</td>
                                  <td className="py-3">
                                    <div className="flex items-center space-x-2">
                                      <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600">
                                        Listen
                                      </Button>
                                      <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-600">
                                        Replace
                                      </Button>
                                      <Button variant="ghost" size="sm" className="h-8 px-2 text-red-600">
                                        Remove
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-center py-8 text-gray-500">No audio materials available for this day.</p>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="video">
                      {day.materials.filter(m => m.type === 'video').length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="text-left border-b">
                                <th className="pb-3">Name</th>
                                <th className="pb-3">Size</th>
                                <th className="pb-3">Date Added</th>
                                <th className="pb-3">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {day.materials.filter(m => m.type === 'video').map((material) => (
                                <tr key={material.id} className="border-b">
                                  <td className="py-3 flex items-center">
                                    {getMaterialIcon(material.type)}
                                    <span className="ml-2">{material.name}</span>
                                  </td>
                                  <td className="py-3">{material.size}</td>
                                  <td className="py-3">{material.date}</td>
                                  <td className="py-3">
                                    <div className="flex items-center space-x-2">
                                      <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600">
                                        Watch
                                      </Button>
                                      <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-600">
                                        Replace
                                      </Button>
                                      <Button variant="ghost" size="sm" className="h-8 px-2 text-red-600">
                                        Remove
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-center py-8 text-gray-500">No video materials available for this day.</p>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="forms">
                      {day.materials.filter(m => m.type === 'form').length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="text-left border-b">
                                <th className="pb-3">Name</th>
                                <th className="pb-3">URL</th>
                                <th className="pb-3">Date Added</th>
                                <th className="pb-3">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {day.materials.filter(m => m.type === 'form').map((material) => (
                                <tr key={material.id} className="border-b">
                                  <td className="py-3 flex items-center">
                                    {getMaterialIcon(material.type)}
                                    <span className="ml-2">{material.name}</span>
                                  </td>
                                  <td className="py-3 text-blue-600 underline cursor-pointer truncate max-w-[200px]">
                                    {material.url}
                                  </td>
                                  <td className="py-3">{material.date}</td>
                                  <td className="py-3">
                                    <div className="flex items-center space-x-2">
                                      <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600">
                                        Open
                                      </Button>
                                      <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-600">
                                        Edit
                                      </Button>
                                      <Button variant="ghost" size="sm" className="h-8 px-2 text-red-600">
                                        Remove
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-center py-8 text-gray-500">No form materials available for this day.</p>
                      )}
                    </TabsContent>
                  </Tabs>
                  
                  <div className="mt-4 pt-4 border-t flex justify-end">
                    <Button asChild size="sm" className="bg-brand-yellow text-brand-blue hover:brightness-95">
                      <Link to={`/tutor/day/${day.id}/upload`}>Add Material</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500 mb-4">No days found matching your search criteria.</p>
                <Button onClick={() => setSearchQuery('')} variant="outline">Clear Search</Button>
              </CardContent>
            </Card>
          )}
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

export default Materials;
