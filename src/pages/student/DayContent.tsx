
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Headphones, FileText, FileCheck, Play } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

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
  
  // This would come from an API in a real application
  const content = {
    storyToRead: {
      title: "Breaking Free: Overcoming Procrastination and Unlocking Your Potential",
      link: "#",
      isCompleted: completedActivities.reading
    },
    listenToStory: {
      americanVersion: "#",
      britishVersion: "#",
      americanCompleted: completedActivities.listeningAmerican,
      britishCompleted: completedActivities.listeningBritish
    },
    storyGlossary: {
      link: "#",
      isCompleted: completedActivities.glossary
    },
    classTopic: {
      topics: [
        {
          title: "Aspects of Present Tenses",
          link: "#",
          isCompleted: completedActivities.topic1
        },
        {
          title: "Present Perfect Continuous Tense",
          link: "#",
          isCompleted: completedActivities.topic2
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
        
        <div className="space-y-4">
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
                    <Link to={content.storyToRead.link} className="text-blue-500 hover:underline">
                      Read Now
                    </Link>
                    <Button 
                      variant={content.storyToRead.isCompleted ? "outline" : "default"}
                      size="sm"
                      onClick={() => markAsComplete('reading')}
                      disabled={content.storyToRead.isCompleted}
                    >
                      {content.storyToRead.isCompleted ? 'Completed' : 'Mark as Complete'}
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
                      <Link to={content.listenToStory.americanVersion} className="text-blue-500 hover:underline flex items-center gap-2">
                        <Headphones className="h-4 w-4" />
                        American Version
                      </Link>
                      <Button 
                        variant={content.listenToStory.americanCompleted ? "outline" : "default"}
                        size="sm"
                        onClick={() => markAsComplete('listeningAmerican')}
                        disabled={content.listenToStory.americanCompleted}
                      >
                        {content.listenToStory.americanCompleted ? 'Completed' : 'Mark as Complete'}
                      </Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <Link to={content.listenToStory.britishVersion} className="text-blue-500 hover:underline flex items-center gap-2">
                        <Headphones className="h-4 w-4" />
                        British Version
                      </Link>
                      <Button 
                        variant={content.listenToStory.britishCompleted ? "outline" : "default"}
                        size="sm"
                        onClick={() => markAsComplete('listeningBritish')}
                        disabled={content.listenToStory.britishCompleted}
                      >
                        {content.listenToStory.britishCompleted ? 'Completed' : 'Mark as Complete'}
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
                    <Link to={content.storyGlossary.link} className="text-blue-500 hover:underline">View Glossary</Link>
                    <Button 
                      variant={content.storyGlossary.isCompleted ? "outline" : "default"}
                      size="sm"
                      onClick={() => markAsComplete('glossary')}
                      disabled={content.storyGlossary.isCompleted}
                    >
                      {content.storyGlossary.isCompleted ? 'Completed' : 'Mark as Complete'}
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
                      <div key={index} className="flex justify-between items-center">
                        <Link to={topic.link} className="text-blue-500 hover:underline">
                          {topic.title}
                        </Link>
                        <Button 
                          variant={topic.isCompleted ? "outline" : "default"}
                          size="sm"
                          onClick={() => markAsComplete(index === 0 ? 'topic1' : 'topic2')}
                          disabled={topic.isCompleted}
                        >
                          {topic.isCompleted ? 'Completed' : 'Mark as Complete'}
                        </Button>
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
                        <Link to={content.assessments.vocabularyTest} className="text-blue-500 hover:underline">
                          Vocabulary Test
                        </Link>
                        {content.assessments.vocabularyCompleted && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Score: {content.assessments.vocabularyScore}%
                          </span>
                        )}
                      </div>
                      <Button 
                        variant={content.assessments.vocabularyCompleted ? "outline" : "default"}
                        size="sm"
                        onClick={() => markAsComplete('vocabularyTest')}
                        disabled={content.assessments.vocabularyCompleted}
                      >
                        {content.assessments.vocabularyCompleted ? 'Completed' : 'Take Test'}
                      </Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Link to={content.assessments.topicTest} className="text-blue-500 hover:underline">
                          Topic Test
                        </Link>
                        {content.assessments.topicCompleted && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Score: {content.assessments.topicScore}%
                          </span>
                        )}
                      </div>
                      <Button 
                        variant={content.assessments.topicCompleted ? "outline" : "default"}
                        size="sm"
                        onClick={() => markAsComplete('topicTest')}
                        disabled={content.assessments.topicCompleted}
                      >
                        {content.assessments.topicCompleted ? 'Completed' : 'Take Test'}
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
                    <Link to={content.watchShortMovies.link} className="text-blue-500 hover:underline flex items-center gap-2">
                      <Play className="h-4 w-4" />
                      Watch Now
                    </Link>
                    <Button 
                      variant={content.watchShortMovies.isCompleted ? "outline" : "default"}
                      size="sm"
                      onClick={() => markAsComplete('watchShortMovie')}
                      disabled={content.watchShortMovies.isCompleted}
                    >
                      {content.watchShortMovies.isCompleted ? 'Completed' : 'Mark as Complete'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
};

export default DayContent;
