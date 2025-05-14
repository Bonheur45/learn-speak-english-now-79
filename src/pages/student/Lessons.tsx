
import React from 'react';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Lessons = () => {
  // Sample data - in a real app, this would come from an API
  const days = [
    { id: 1, title: "Day 1: Introduction", description: "Basic introduction to the course" },
    { id: 2, title: "Day 2: Basics", description: "Fundamentals of English language" },
    { id: 3, title: "Day 3: Simple Present", description: "Learning the simple present tense" },
    { id: 4, title: "Day 4: Past Tense", description: "Understanding the past tense" },
    { id: 5, title: "Day 5: Future Tense", description: "Working with future tense" },
  ];

  return (
    <>
      <Navbar isLoggedIn={true} userRole="student" />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Available Lessons</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {days.map((day) => (
            <Link to={`/student/days/${day.id}`} key={day.id}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>{day.title}</CardTitle>
                  <CardDescription>{day.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end">
                  <span className="text-blue-500 hover:underline">View Lesson</span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
};

export default Lessons;
