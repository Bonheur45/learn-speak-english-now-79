
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Headphones, FileText, FileCheck, Play, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

const DayContent = () => {
  const { dayId } = useParams<{ dayId: string }>();
  const [completedActivities, setCompletedActivities] = useState<{
    [key: string]: boolean;
  }>({
    reading: false,
    listeningAmerican: false,
    listeningBritish: false,
    glossary: false,
    topic1: false,
    topic2: false,
    vocabularyTest: false,
    topicTest: false,
    watchShortMovie: false,
  });
  
  const [openActivityId, setOpenActivityId] = useState<string | null>(null);
  const [openDialogContent, setOpenDialogContent] = useState<{
    title: string;
    type: 'glossary' | 'reading' | 'listening' | 'video' | 'test';
    content: any;
  } | null>(null);
  
  // Sample glossary items
  const glossaryItems = [
    { term: "Procrastination", definition: "The act of delaying or postponing tasks." },
    { term: "Overcome", definition: "To succeed in dealing with a problem or difficulty." },
    { term: "Potential", definition: "Latent qualities or abilities that may be developed and lead to future success." },
  ];
  
  // This would come from an API in a real application
  const content = {
    storyToRead: {
      title: "Breaking Free: Overcoming Procrastination and Unlocking Your Potential",
      link: "#",
      isCompleted: completedActivities.reading,
      content: "This is the full story content that would be displayed when opened...",
      date: "5/11/2025"
    },
    listenToStory: {
      americanVersion: "#",
      britishVersion: "#",
      americanCompleted: completedActivities.listeningAmerican,
      britishCompleted: completedActivities.listeningBritish
    },
    storyGlossary: {
      link: "#",
      isCompleted: completedActivities.glossary,
      items: glossaryItems,
      title: "Glossary for Breaking Free",
      date: "5/11/2025"
    },
    classTopic: {
      topics: [
        {
          title: "Aspects of Present Tenses",
          link: "#",
          isCompleted: completedActivities.topic1,
          videoUrl: "#",
          notesUrl: "#"
        },
        {
          title: "Present Perfect Continuous Tense",
          link: "#",
          isCompleted: completedActivities.topic2,
          videoUrl: "#",
          notesUrl: "#"
        }
      ]
    },
    assessments: {
      vocabularyTest: "#",
      topicTest: "#",
      vocabularyCompleted: completedActivities.vocabularyTest,
      topicCompleted: completedActivities.topicTest,
      vocabularyScore: 85,
      topicScore: 92
    },
    watchShortMovies: {
      title: "Episode 1 - A new Neighbor: British",
      link: "#",
      isCompleted: completedActivities.watchShortMovie
    }
  };

  const totalActivities = Object.keys(completedActivities).length;
  const completedCount = Object.values(completedActivities).filter(Boolean).length;

  const markAsComplete = (activity: string) => {
    setCompletedActivities(prev => ({
      ...prev,
      [activity]: true
    }));
    toast({
      title: "Activity Completed",
      description: `You've completed this activity. Great job!`,
      variant: "default",
    });
    
    // Close the dialog after marking as complete
    setOpenActivityId(null);
    setOpenDialogContent(null);
  };
  
  const openActivity = (activityId: string, type: 'glossary' | 'reading' | 'listening' | 'video' | 'test', title: string, content: any) => {
    setOpenActivityId(activityId);
    setOpenDialogContent({
      title,
      type,
      content
    });
  };
  
  const renderDialogContent = () => {
    if (!openDialogContent) return null;
    
    switch (openDialogContent.type) {
      case 'glossary':
        return (
          <>
            <div className="mb-4">
              <span className="text-gray-500">{content.storyGlossary.date}</span>
            </div>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-3xl font-bold">{openDialogContent.title}</h2>
              <span className="bg-green-100 text-green-800 px-4 py-1 rounded-lg">GLOSSARY</span>
            </div>
            <div className="space-y-6 mb-10">
              {openDialogContent.content.map((item: any, index: number) => (
                <div key={index}>
                  <p className="text-xl mb-1">{item.term}: {item.definition}</p>
                </div>
              ))}
            </div>
          </>
        );
      
      case 'reading':
        return (
          <>
            <div className="mb-4">
              <span className="text-gray-500">{content.storyToRead.date}</span>
            </div>
            <div className="prose max-w-none mb-10">
              <p>{openDialogContent.content}</p>
            </div>
          </>
        );
      
      case 'video':
        return (
          <div className="flex flex-col items-center space-y-4 mb-10">
            <div className="w-full aspect-video bg-gray-200 flex items-center justify-center">
              <Play className="h-12 w-12 text-gray-500" />
              <span className="ml-2">Video would play here</span>
            </div>
            <p className="text-lg text-center">{openDialogContent.title}</p>
          </div>
        );
        
      default:
        return <p>Content not available</p>;
    }
  };

  return (
    <>
      <Navbar isLoggedIn={true} userRole="student" />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" asChild className="mr-4">
            <Link to="/student/days">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Lessons
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Day {dayId} Content</h1>
        </div>

        {/* Progress Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={(completedCount / totalActivities) * 100} className="h-2" />
              <div className="flex justify-between text-sm">
                <span>{completedCount} of {totalActivities} activities completed</span>
                <span>{Math.round((completedCount / totalActivities) * 100)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4 max-w-3xl mx-auto">
          {/* The Story to Read */}
          <Card className={`border-l-4 ${content.storyToRead.isCompleted ? 'border-l-green-500' : 'border-l-gray-300'}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${content.storyToRead.isCompleted ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <BookOpen className={`h-6 w-6 ${content.storyToRead.isCompleted ? 'text-green-500' : 'text-gray-500'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">The Story to Read</h3>
                  <p className="mb-4">{content.storyToRead.title}</p>
                  <div className="flex justify-between items-center">
                    <Button 
                      variant="link" 
                      className="text-blue-500 p-0 h-auto hover:underline"
                      onClick={() => openActivity('reading', 'reading', content.storyToRead.title, content.storyToRead.content)}
                    >
                      Read Now
                    </Button>
                    <Button 
                      variant={content.storyToRead.isCompleted ? "outline" : "default"}
                      size="sm"
                      onClick={() => openActivity('reading', 'reading', content.storyToRead.title, content.storyToRead.content)}
                      disabled={content.storyToRead.isCompleted}
                    >
                      {content.storyToRead.isCompleted ? 'Completed' : 'Start'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Listen to the Story */}
          <Card className={`border-l-4 ${content.listenToStory.americanCompleted && content.listenToStory.britishCompleted ? 'border-l-green-500' : 'border-l-gray-300'}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${content.listenToStory.americanCompleted && content.listenToStory.britishCompleted ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Headphones className={`h-6 w-6 ${content.listenToStory.americanCompleted && content.listenToStory.britishCompleted ? 'text-green-500' : 'text-gray-500'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Listen to the Story</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Button
                        variant="link"
                        className="text-blue-500 p-0 h-auto hover:underline flex items-center gap-2"
                        onClick={() => openActivity('listeningAmerican', 'listening', 'American Version', 'Audio player would be here')}
                      >
                        <Headphones className="h-4 w-4" />
                        American Version
                      </Button>
                      <Button 
                        variant={content.listenToStory.americanCompleted ? "outline" : "default"}
                        size="sm"
                        onClick={() => openActivity('listeningAmerican', 'listening', 'American Version', 'Audio player would be here')}
                        disabled={content.listenToStory.americanCompleted}
                      >
                        {content.listenToStory.americanCompleted ? 'Completed' : 'Start'}
                      </Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <Button
                        variant="link"
                        className="text-blue-500 p-0 h-auto hover:underline flex items-center gap-2"
                        onClick={() => openActivity('listeningBritish', 'listening', 'British Version', 'Audio player would be here')}
                      >
                        <Headphones className="h-4 w-4" />
                        British Version
                      </Button>
                      <Button 
                        variant={content.listenToStory.britishCompleted ? "outline" : "default"}
                        size="sm"
                        onClick={() => openActivity('listeningBritish', 'listening', 'British Version', 'Audio player would be here')}
                        disabled={content.listenToStory.britishCompleted}
                      >
                        {content.listenToStory.britishCompleted ? 'Completed' : 'Start'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* The Story Glossary */}
          <Card className={`border-l-4 ${content.storyGlossary.isCompleted ? 'border-l-green-500' : 'border-l-gray-300'}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${content.storyGlossary.isCompleted ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <FileText className={`h-6 w-6 ${content.storyGlossary.isCompleted ? 'text-green-500' : 'text-gray-500'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">The Story Glossary</h3>
                  <div className="flex justify-between items-center">
                    <Button
                      variant="link"
                      className="text-blue-500 p-0 h-auto hover:underline"
                      onClick={() => openActivity('glossary', 'glossary', content.storyGlossary.title, content.storyGlossary.items)}
                    >
                      View Glossary
                    </Button>
                    <Button 
                      variant={content.storyGlossary.isCompleted ? "outline" : "default"}
                      size="sm"
                      onClick={() => openActivity('glossary', 'glossary', content.storyGlossary.title, content.storyGlossary.items)}
                      disabled={content.storyGlossary.isCompleted}
                    >
                      {content.storyGlossary.isCompleted ? 'Completed' : 'Start'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Class Topic */}
          <Card className={`border-l-4 ${content.classTopic.topics.every(t => t.isCompleted) ? 'border-l-green-500' : 'border-l-gray-300'}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${content.classTopic.topics.every(t => t.isCompleted) ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <FileText className={`h-6 w-6 ${content.classTopic.topics.every(t => t.isCompleted) ? 'text-green-500' : 'text-gray-500'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Class Topic</h3>
                  <div className="space-y-4">
                    {content.classTopic.topics.map((topic, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Button
                            variant="link"
                            className="text-blue-500 p-0 h-auto hover:underline"
                            onClick={() => openActivity(`topic${index+1}`, 'video', topic.title, topic.title)}
                          >
                            {topic.title}
                          </Button>
                          <Button 
                            variant={topic.isCompleted ? "outline" : "default"}
                            size="sm"
                            onClick={() => openActivity(`topic${index+1}`, 'video', topic.title, topic.title)}
                            disabled={topic.isCompleted}
                          >
                            {topic.isCompleted ? 'Completed' : 'Start'}
                          </Button>
                        </div>
                        <div className="flex gap-2 ml-4 text-sm">
                          <Button
                            variant="link"
                            className="text-blue-500 p-0 h-auto hover:underline flex items-center gap-1"
                            onClick={() => openActivity(`topic${index+1}Video`, 'video', `${topic.title} - Video`, topic.title)}
                          >
                            <Play className="h-3 w-3" />
                            Video Lesson
                          </Button>
                          <span>|</span>
                          <Button
                            variant="link"
                            className="text-blue-500 p-0 h-auto hover:underline flex items-center gap-1"
                            onClick={() => openActivity(`topic${index+1}Notes`, 'reading', `${topic.title} - Notes`, "Notes content would be here")}
                          >
                            <FileText className="h-3 w-3" />
                            Notes
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Assessments */}
          <Card className={`border-l-4 ${content.assessments.vocabularyCompleted && content.assessments.topicCompleted ? 'border-l-green-500' : 'border-l-gray-300'}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${content.assessments.vocabularyCompleted && content.assessments.topicCompleted ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <FileCheck className={`h-6 w-6 ${content.assessments.vocabularyCompleted && content.assessments.topicCompleted ? 'text-green-500' : 'text-gray-500'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Assessments</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="link"
                          className="text-blue-500 p-0 h-auto hover:underline"
                          onClick={() => openActivity('vocabularyTest', 'test', 'Vocabulary Test', "Test content would be here")}
                        >
                          Vocabulary Test
                        </Button>
                        {content.assessments.vocabularyCompleted && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Score: {content.assessments.vocabularyScore}%
                          </span>
                        )}
                      </div>
                      <Button 
                        variant={content.assessments.vocabularyCompleted ? "outline" : "default"}
                        size="sm"
                        onClick={() => openActivity('vocabularyTest', 'test', 'Vocabulary Test', "Test content would be here")}
                        disabled={content.assessments.vocabularyCompleted}
                      >
                        {content.assessments.vocabularyCompleted ? 'Completed' : 'Start Test'}
                      </Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="link"
                          className="text-blue-500 p-0 h-auto hover:underline"
                          onClick={() => openActivity('topicTest', 'test', 'Topic Test', "Test content would be here")}
                        >
                          Topic Test
                        </Button>
                        {content.assessments.topicCompleted && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Score: {content.assessments.topicScore}%
                          </span>
                        )}
                      </div>
                      <Button 
                        variant={content.assessments.topicCompleted ? "outline" : "default"}
                        size="sm"
                        onClick={() => openActivity('topicTest', 'test', 'Topic Test', "Test content would be here")}
                        disabled={content.assessments.topicCompleted}
                      >
                        {content.assessments.topicCompleted ? 'Completed' : 'Start Test'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Watch Short Movies */}
          <Card className={`border-l-4 ${content.watchShortMovies.isCompleted ? 'border-l-green-500' : 'border-l-gray-300'}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${content.watchShortMovies.isCompleted ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Play className={`h-6 w-6 ${content.watchShortMovies.isCompleted ? 'text-green-500' : 'text-gray-500'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Watch Short Movies</h3>
                  <p className="mb-4">{content.watchShortMovies.title}</p>
                  <div className="flex justify-between items-center">
                    <Button
                      variant="link"
                      className="text-blue-500 p-0 h-auto hover:underline flex items-center gap-2"
                      onClick={() => openActivity('watchShortMovie', 'video', content.watchShortMovies.title, content.watchShortMovies.title)}
                    >
                      <Play className="h-4 w-4" />
                      Watch Now
                    </Button>
                    <Button 
                      variant={content.watchShortMovies.isCompleted ? "outline" : "default"}
                      size="sm"
                      onClick={() => openActivity('watchShortMovie', 'video', content.watchShortMovies.title, content.watchShortMovies.title)}
                      disabled={content.watchShortMovies.isCompleted}
                    >
                      {content.watchShortMovies.isCompleted ? 'Completed' : 'Start'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Activity Dialog */}
      <Dialog open={!!openDialogContent} onOpenChange={(open) => {
        if (!open) {
          setOpenActivityId(null);
          setOpenDialogContent(null);
        }
      }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{openDialogContent?.title || ''}</DialogTitle>
            <DialogClose className="absolute right-4 top-4">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          
          <div className="py-4">
            {renderDialogContent()}
          </div>
          
          <DialogFooter>
            <Button 
              onClick={() => openActivityId && markAsComplete(openActivityId)} 
              className="bg-yellow-400 text-blue-900 hover:bg-yellow-500 w-full md:w-auto"
            >
              Mark as Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DayContent;
