
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const DayContent = () => {
  const { dayId } = useParams<{ dayId: string }>();
  
  // This would come from an API in a real application
  const content = {
    storyToRead: {
      title: "Breaking Free: Overcoming Procrastination and Unlocking Your Potential",
      link: "#"
    },
    listenToStory: {
      americanVersion: "#",
      britishVersion: "#"
    },
    storyGlossary: {
      link: "#"
    },
    classTopic: {
      topics: [
        {
          title: "Aspects of Present Tenses",
          link: "#"
        },
        {
          title: "Present Perfect Continuous Tense",
          link: "#"
        }
      ]
    },
    assessments: {
      vocabularyTest: "#",
      topicTest: "#"
    },
    watchShortMovies: {
      title: "Episode 1 - A new Neighbor: British",
      link: "#"
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* The Story to Read */}
          <Card>
            <CardHeader>
              <CardTitle>The Story to Read</CardTitle>
            </CardHeader>
            <CardContent>
              <Link to={content.storyToRead.link} className="text-blue-500 hover:underline">
                {content.storyToRead.title}
              </Link>
            </CardContent>
          </Card>
          
          {/* Listen to the Story */}
          <Card>
            <CardHeader>
              <CardTitle>Listen to the Story</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>American Version: <Link to={content.listenToStory.americanVersion} className="text-blue-500 hover:underline">Listen</Link></p>
              <p>British Version: <Link to={content.listenToStory.britishVersion} className="text-blue-500 hover:underline">Listen</Link></p>
            </CardContent>
          </Card>
          
          {/* The Story Glossary */}
          <Card>
            <CardHeader>
              <CardTitle>The Story Glossary</CardTitle>
            </CardHeader>
            <CardContent>
              <Link to={content.storyGlossary.link} className="text-blue-500 hover:underline">Glossary</Link>
            </CardContent>
          </Card>
          
          {/* Class Topic */}
          <Card>
            <CardHeader>
              <CardTitle>Class Topic</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {content.classTopic.topics.map((topic, index) => (
                <p key={index}>
                  <Link to={topic.link} className="text-blue-500 hover:underline">{topic.title}</Link>
                </p>
              ))}
            </CardContent>
          </Card>
          
          {/* Assessments */}
          <Card>
            <CardHeader>
              <CardTitle>Assessments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><Link to={content.assessments.vocabularyTest} className="text-blue-500 hover:underline">Vocabulary Test</Link></p>
              <p><Link to={content.assessments.topicTest} className="text-blue-500 hover:underline">Topic Test</Link></p>
            </CardContent>
          </Card>
          
          {/* Watch Short Movies */}
          <Card>
            <CardHeader>
              <CardTitle>Watch Short Movies</CardTitle>
            </CardHeader>
            <CardContent>
              <Link to={content.watchShortMovies.link} className="text-blue-500 hover:underline">{content.watchShortMovies.title}</Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
};

export default DayContent;
