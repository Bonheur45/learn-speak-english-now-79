
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import ImageCarousel from '@/components/ImageCarousel';

const Index = () => {
  const carouselImages = [
    "/lovable-uploads/57766084-0d04-442f-ac28-784b372f1897.png",
    "/lovable-uploads/ba0fe2a9-c3f7-43c1-b846-d9ceca512891.png"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={false} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-100 py-12 md:py-20 flex-grow">
        <div className="container mx-auto px-0 sm:px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 px-4 md:pr-8 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-brand-blue mb-4">
                Master English the <span className="text-brand-yellow">Right Way</span>
              </h1>
              <p className="text-lg mb-6 text-gray-700 max-w-lg">
                Join our structured learning program designed by expert tutors. Daily lessons, vocabulary practice, 
                assessments, and progress tracking all in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild className="bg-brand-yellow text-brand-blue hover:brightness-95">
                  <Link to="/register">Start Learning Today</Link>
                </Button>
                <Button asChild variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white">
                  <Link to="/login">Existing Users</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 w-full">
              <div className="md:rounded-lg overflow-hidden md:shadow-xl">
                <ImageCarousel 
                  images={carouselImages} 
                  altText="English learning presentation"
                  className="w-full aspect-[4/3] md:h-[400px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-brand-blue mb-12">Why Choose Our Platform?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="bg-brand-yellow p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Structured Learning</h3>
              <p className="text-gray-600">Follow our day-by-day curriculum designed by language experts to build your skills systematically.</p>
            </div>
            
            <div className="card text-center">
              <div className="bg-brand-yellow p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Dual Accent Practice</h3>
              <p className="text-gray-600">Practice with both American and British English recordings to improve your pronunciation and listening skills.</p>
            </div>
            
            <div className="card text-center">
              <div className="bg-brand-yellow p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Track Your Progress</h3>
              <p className="text-gray-600">Monitor your learning journey with detailed assessments and performance analytics.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 bg-brand-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Improve Your English?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already improving their English skills daily through our platform.
          </p>
          <Button asChild className="bg-brand-yellow text-brand-blue hover:brightness-95 px-8 py-3 text-lg">
            <Link to="/register">Get Started for Free</Link>
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo size="small" />
            <p className="text-gray-600 mt-4 md:mt-0">
              © {new Date().getFullYear()} Let's Do It English. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/about" className="text-gray-600 hover:text-brand-blue">About</Link>
              <Link to="/contact" className="text-gray-600 hover:text-brand-blue">Contact</Link>
              <Link to="/privacy" className="text-gray-600 hover:text-brand-blue">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
