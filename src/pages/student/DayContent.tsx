import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Headphones, FileText, FileCheck, Play, X, Trophy, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import CongratulationAnimation from '@/components/student/CongratulationAnimation';

const DayContent = () => {
  const { dayId } = useParams<{ dayId: string }>();
  const navigate = useNavigate();
  
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
    type: 'glossary' | 'reading' | 'listening' | 'video' | 'test' | 'notes';
    content: any;
  } | null>(null);

  const [showCongratulations, setShowCongratulations] = useState(false);
  
  // Load completion state from localStorage
  useEffect(() => {
    if (dayId) {
      const storedActivities = localStorage.getItem(`day-${dayId}-activities`);
      if (storedActivities) {
        setCompletedActivities(JSON.parse(storedActivities));
      }
      
      // Check if tests have been completed
      const vocabScore = localStorage.getItem(`day${dayId}-vocabulary-score`);
      const topicScore = localStorage.getItem(`day${dayId}-topic-score`);
      
      if (vocabScore && !completedActivities.vocabularyTest) {
        setCompletedActivities(prev => ({ ...prev, vocabularyTest: true }));
      }
      
      if (topicScore && !completedActivities.topicTest) {
        setCompletedActivities(prev => ({ ...prev, topicTest: true }));
      }
    }
  }, [dayId]);
  
  // Save completion state to localStorage whenever it changes
  useEffect(() => {
    if (dayId) {
      localStorage.setItem(`day-${dayId}-activities`, JSON.stringify(completedActivities));
      
      // Check if all activities are completed
      const allCompleted = Object.values(completedActivities).every(Boolean);
      if (allCompleted) {
        setShowCongratulations(true);
        
        // Hide congratulations after 5 seconds
        const timer = setTimeout(() => {
          setShowCongratulations(false);
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [completedActivities, dayId]);
  
  // Sample glossary items
  const glossaryItems = [
    { term: "Procrastination", definition: "The act of delaying or postponing tasks." },
    { term: "Overcome", definition: "To succeed in dealing with a problem or difficulty." },
    { term: "Potential", definition: "Latent qualities or abilities that may be developed and lead to future success." },
    { term: "Consistency", definition: "The quality of always behaving or performing in a similar way, or of always happening in a similar way." },
    { term: "Discipline", definition: "Training that corrects, molds, or perfects the mental faculties or moral character; control gained by enforcing obedience or order." },
    { term: "Introspection", definition: "Examining one's own thoughts and feelings." },
  ];
  
  // This would come from an API in a real application
  const content = {
    storyToRead: {
      title: "Breaking Free: Overcoming Procrastination and Unlocking Your Potential",
      link: "#",
      isCompleted: completedActivities.reading,
      content: `
        <h2>Breaking Free: Overcoming Procrastination and Unlocking Your Potential</h2>
        
        <p>
          Sarah had always been known as someone with exceptional talent. Her teachers recognized her intelligence, and her friends admired her creativity. But there was one persistent challenge that kept her from reaching her full potential: procrastination.
        </p>
        
        <p>
          Every night, Sarah would promise herself that tomorrow would be different. She would wake up early, tackle her tasks head-on, and finally make progress on that project she'd been putting off for weeks. Yet, when morning came, she'd find herself scrolling through social media, watching "just one more" video, or suddenly becoming very interested in reorganizing her bookshelf.
        </p>
        
        <p>
          This cycle continued until she reached a breaking point during her final year of university. With deadlines looming and opportunities slipping away, Sarah realized something had to change. She began researching why she procrastinated and discovered that it wasn't about laziness or poor time management—it was often rooted in fear of failure, perfectionism, or feeling overwhelmed.
        </p>
        
        <p>
          Armed with this new understanding, Sarah developed strategies to overcome her procrastination:
        </p>
        
        <ol>
          <li>
            <strong>Breaking tasks into smaller steps:</strong> Instead of facing a mountain of work, she divided projects into manageable chunks.
          </li>
          <li>
            <strong>Setting specific times for difficult tasks:</strong> She blocked out dedicated time periods for challenging work when her energy was highest.
          </li>
          <li>
            <strong>Using the two-minute rule:</strong> If something took less than two minutes, she would do it immediately rather than putting it off.
          </li>
          <li>
            <strong>Creating accountability:</strong> She shared her goals with friends who would check in on her progress.
          </li>
          <li>
            <strong>Practicing self-compassion:</strong> She learned to be kinder to herself when she slipped up, rather than falling into a cycle of self-criticism.
          </li>
        </ol>
        
        <p>
          The change didn't happen overnight. There were days when old habits resurfaced, but gradually, Sarah began to notice a shift. She started completing assignments well before deadlines. Her stress levels decreased, and her confidence grew. Most importantly, she began to recognize and fulfill her potential.
        </p>
        
        <p>
          By the end of the academic year, Sarah had not only caught up on her work but had excelled. Her final project received the highest grade in her class, and she was offered an internship at a prestigious company—an opportunity she would have missed had she continued procrastinating.
        </p>
        
        <p>
          Sarah's journey taught her that overcoming procrastination wasn't simply about becoming more productive—it was about removing the barriers that prevented her from becoming the person she was capable of being. By breaking free from the cycle of delay and avoidance, she had finally unlocked her potential.
        </p>
      `,
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
          notesUrl: "#",
          notes: `
            <h2>Aspects of Present Tenses</h2>
            
            <p>Present tenses in English are used to talk about actions and states that exist now or that happen regularly. There are four main present tenses:</p>
            
            <h3>1. Present Simple</h3>
            <p><strong>Form:</strong> Subject + base form of verb (+ s/es for third person singular)</p>
            <p><strong>Example:</strong> I work at a bank. She works at a hospital.</p>
            <p><strong>Usage:</strong> Facts, habits, routines, general truths, scheduled events</p>
            
            <h3>2. Present Continuous (Progressive)</h3>
            <p><strong>Form:</strong> Subject + am/is/are + present participle (verb + ing)</p>
            <p><strong>Example:</strong> I am working on a project. They are studying for an exam.</p>
            <p><strong>Usage:</strong> Actions happening right now, temporary situations, planned future arrangements</p>
            
            <h3>3. Present Perfect</h3>
            <p><strong>Form:</strong> Subject + have/has + past participle</p>
            <p><strong>Example:</strong> I have finished my homework. She has lived here for five years.</p>
            <p><strong>Usage:</strong> Past actions with present results, experiences, changes over time, unfinished time periods</p>
            
            <h3>4. Present Perfect Continuous</h3>
            <p><strong>Form:</strong> Subject + have/has + been + present participle (verb + ing)</p>
            <p><strong>Example:</strong> I have been waiting for an hour. He has been working here since 2020.</p>
            <p><strong>Usage:</strong> Actions that started in the past and continue to the present, often emphasizing duration</p>
            
            <h3>Key Differences:</h3>
            <ul>
              <li>Present Simple focuses on <strong>facts and routines</strong></li>
              <li>Present Continuous focuses on <strong>current or temporary actions</strong></li>
              <li>Present Perfect focuses on <strong>completion and results</strong></li>
              <li>Present Perfect Continuous focuses on <strong>duration and continuity</strong></li>
            </ul>
          `
        },
        {
          title: "Present Perfect Continuous Tense",
          link: "#",
          isCompleted: completedActivities.topic2,
          videoUrl: "#",
          notesUrl: "#",
          notes: `
            <h2>Present Perfect Continuous Tense</h2>
            
            <p>The Present Perfect Continuous tense (also called Present Perfect Progressive) is used to talk about actions that started in the past and have been continuing up until the present moment.</p>
            
            <h3>Form:</h3>
            <p><strong>Subject + have/has + been + verb-ing</strong></p>
            
            <h3>Positive Sentences:</h3>
            <ul>
              <li>I <strong>have been studying</strong> English for five years.</li>
              <li>She <strong>has been working</strong> at this company since 2020.</li>
              <li>They <strong>have been waiting</strong> for the bus for 30 minutes.</li>
            </ul>
            
            <h3>Negative Sentences:</h3>
            <ul>
              <li>I <strong>haven't been sleeping</strong> well lately.</li>
              <li>He <strong>hasn't been feeling</strong> well all week.</li>
              <li>We <strong>haven't been playing</strong> football since last summer.</li>
            </ul>
            
            <h3>Questions:</h3>
            <ul>
              <li><strong>Have</strong> you <strong>been learning</strong> Spanish?</li>
              <li><strong>Has</strong> she <strong>been living</strong> in London for long?</li>
              <li>How long <strong>have</strong> they <strong>been waiting</strong>?</li>
            </ul>
            
            <h3>Key Uses:</h3>
            <ol>
              <li><strong>Duration up to present:</strong> To emphasize the duration of an action that started in the past and continues to the present moment
                <p><em>Example:</em> I have been working on this report all morning.</p>
              </li>
              <li><strong>Temporary situations:</strong> For situations that have been happening recently but are not permanent
                <p><em>Example:</em> She has been staying with her parents until her apartment is ready.</p>
              </li>
              <li><strong>Explaining results:</strong> To explain the reason for a present result, especially with visible evidence
                <p><em>Example:</em> I'm tired because I have been running. (The result is being tired)</p>
              </li>
            </ol>
            
            <h3>Time Expressions:</h3>
            <ul>
              <li>With <strong>"for"</strong> to indicate a period of time: for two hours, for six months, for many years</li>
              <li>With <strong>"since"</strong> to indicate a starting point: since morning, since 2010, since I was a child</li>
              <li>Other expressions: lately, recently, all day, all week, in the last few days</li>
            </ul>
          `
        }
      ]
    },
    assessments: {
      vocabularyTest: "#",
      topicTest: "#",
      vocabularyCompleted: completedActivities.vocabularyTest,
      topicCompleted: completedActivities.topicTest,
      vocabularyScore: localStorage.getItem(`day${dayId}-vocabulary-score`) ? parseInt(localStorage.getItem(`day${dayId}-vocabulary-score`) || "0") : 85,
      topicScore: localStorage.getItem(`day${dayId}-topic-score`) ? parseInt(localStorage.getItem(`day${dayId}-topic-score`) || "0") : 92
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
  
  const openActivity = (activityId: string, type: 'glossary' | 'reading' | 'listening' | 'video' | 'test' | 'notes', title: string, content: any) => {
    // For test activities, navigate to the appropriate test page
    if (type === 'test') {
      if (activityId === 'vocabularyTest') {
        navigate(`/student/days/${dayId}/vocabulary-test`);
        return;
      } else if (activityId === 'topicTest') {
        navigate(`/student/days/${dayId}/topic-test`);
        return;
      }
    }
    
    // For other activities, open the dialog
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
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-1">{item.term}</h3>
                  <p className="text-gray-700 text-lg">{item.definition}</p>
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
            <div className="prose prose-lg max-w-none mb-10" dangerouslySetInnerHTML={{ __html: openDialogContent.content }} />
          </>
        );
      
      case 'notes':
        return (
          <>
            <div className="mb-4">
              <span className="text-gray-500">Course Materials</span>
            </div>
            <div className="prose prose-lg max-w-none mb-10" dangerouslySetInnerHTML={{ __html: openDialogContent.content }} />
          </>
        );
      
      case 'video':
        return (
          <div className="flex flex-col items-center space-y-4 mb-10">
            <div className="w-full aspect-video bg-gray-200 flex items-center justify-center border rounded-lg">
              <div className="flex flex-col items-center">
                <Play className="h-16 w-16 text-gray-500 mb-2" />
                <span className="text-lg text-center max-w-md px-4">
                  Video player would appear here with {openDialogContent.title} content
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-100 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">{openDialogContent.title}</h3>
              <p className="text-gray-700 text-lg">
                This video covers the essential concepts related to {openDialogContent.title.toLowerCase()}. 
                Watch the full video to gain a comprehensive understanding of the topic.
              </p>
              <div className="mt-4 flex space-x-3">
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" /> Download Transcript
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" /> Download Slides
                </Button>
              </div>
            </div>
          </div>
        );
        
      case 'listening':
        return (
          <div className="flex flex-col items-center space-y-6 mb-10">
            <div className="w-full bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">{openDialogContent.title} Audio</h3>
              
              <div className="w-full bg-white p-4 rounded-lg border mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Play className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium">Breaking Free</span>
                  </div>
                  <span className="text-sm text-gray-500">5:32</span>
                </div>
                
                <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                  <div className="bg-blue-600 h-2 rounded-full w-3/5"></div>
                </div>
                
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>3:12</span>
                  <span>5:32</span>
                </div>
              </div>
              
              <p className="text-gray-700 text-lg mb-4">
                Listen to the complete audio to practice your pronunciation and comprehension.
                This recording features a {openDialogContent.title.includes('American') ? 'North American' : 'British'} accent.
              </p>
              
              <div className="space-y-4">
                <details className="bg-white p-3 rounded-lg border">
                  <summary className="font-medium cursor-pointer text-lg">Listening Tips</summary>
                  <div className="pt-3 text-gray-700">
                    <ul className="list-disc pl-5 space-y-2 text-lg">
                      <li>Listen for main ideas first before focusing on details</li>
                      <li>Pay attention to stress and intonation patterns</li>
                      <li>Try to visualize what you're hearing</li>
                      <li>Don't worry if you don't understand every word</li>
                    </ul>
                  </div>
                </details>
                
                <details className="bg-white p-3 rounded-lg border">
                  <summary className="font-medium cursor-pointer text-lg">Transcript</summary>
                  <div className="pt-3 text-gray-700">
                    <p className="text-lg">Sarah had always been known as someone with exceptional talent. Her teachers recognized her intelligence, and her friends admired her creativity...</p>
                    <Button variant="link" className="mt-2 p-0 h-auto">Show full transcript</Button>
                  </div>
                </details>
              </div>
            </div>
          </div>
        );
        
      default:
        return <p className="text-lg">Content not available</p>;
    }
  };

  return (
    <Layout isLoggedIn={true} userRole="student">
      <div className="container mx-auto">
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
        <Card className="mb-6 relative">
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-2">
              <Progress value={(completedCount / totalActivities) * 100} className="h-2" />
              <div className="flex justify-between text-sm">
                <span>{completedCount} of {totalActivities} activities completed</span>
                <span>{Math.round((completedCount / totalActivities) * 100)}%</span>
              </div>
            </div>
            
            {/* Congratulations Animation */}
            {showCongratulations && (
              <div className="absolute top-0 left-0 w-full h-full">
                <CongratulationAnimation />
              </div>
            )}
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
                  <p className="mb-4 text-lg">{content.storyToRead.title}</p>
                  <div className="flex justify-between items-center">
                    <Button 
                      variant="link" 
                      className="text-blue-500 p-0 h-auto hover:underline text-lg"
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
                            onClick={() => openActivity(`topic${index+1}Notes`, 'notes', `${topic.title} - Notes`, topic.notes)}
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
      </div>
      
      {/* Activity Dialog */}
      <Sheet open={!!openDialogContent} onOpenChange={(open) => {
        if (!open) {
          setOpenActivityId(null);
          setOpenDialogContent(null);
        }
      }}>
        <SheetContent side="right" className="w-full max-w-3xl p-0 sm:p-0">
          <div className="h-full flex flex-col">
            <SheetHeader className="p-6 border-b">
              <SheetTitle className="text-2xl">{openDialogContent?.title || ''}</SheetTitle>
              <SheetClose className="absolute right-4 top-4">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </SheetClose>
            </SheetHeader>
            
            <div className="flex-grow overflow-auto p-6">
              {renderDialogContent()}
            </div>
            
            <SheetFooter className="p-6 border-t">
              <Button 
                onClick={() => openActivityId && markAsComplete(openActivityId)} 
                className="bg-yellow-400 text-blue-900 hover:bg-yellow-500 w-full md:w-auto"
              >
                Mark as Complete
              </Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </Layout>
  );
};

export default DayContent;
