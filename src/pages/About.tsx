
import React from 'react';
import Navbar from '@/components/Navbar';
import Logo from '@/components/Logo';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={false} />
      
      <main className="container mx-auto px-4 py-8 flex-grow max-w-3xl">
        <h1 className="text-3xl font-bold text-brand-blue mb-6">About Us</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="mb-4">
            Let's Do It English Program is a youth-led, cohort-based initiative designed to equip its members, especially those from underserved English backgrounds, with world-class communication skills. With a tutor-to-student ratio of 1:10, we provide personalized mentorship to build English proficiency from the ground up to high-standard levels.
          </p>
          
          <p className="mb-4">
            Our goal is to bridge communication gaps and empower our members to stand out on both local and global stages, opening up new opportunities for collaboration, networking, and growth in their professional trajectories.
          </p>
          
          <p className="mb-4">
            Beyond English proficiency, the program also focuses on public speaking, strategic communication, project formulation and project presentation skills.
          </p>
          
          <div className="bg-brand-blue text-white p-6 rounded-lg mt-8 mb-8">
            <h2 className="text-2xl font-bold mb-2">Our Mission</h2>
            <p className="text-lg">To help our members express their full potential</p>
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Our Curriculum</h2>
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/0c7dbc41-1f03-4dc8-8f69-e24a5bcb43b7.png" 
              alt="Let's Do It English Curriculum" 
              className="w-full max-w-lg rounded-lg shadow-lg"
            />
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <Logo size="small" />
            <p className="text-gray-600 mt-4 md:mt-0">
              © {new Date().getFullYear()} Let's Do It English. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="/about" className="text-gray-600 hover:text-brand-blue">About</a>
              <a href="/contact" className="text-gray-600 hover:text-brand-blue">Contact</a>
              <a href="/privacy" className="text-gray-600 hover:text-brand-blue">Privacy</a>
              <a href="/faq" className="text-gray-600 hover:text-brand-blue">FAQ</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
