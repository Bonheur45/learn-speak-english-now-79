
import React from 'react';
import Layout from '@/components/Layout';

const About = () => {
  return (
    <Layout isLoggedIn={false}>
      <div className="container mx-auto px-4 max-w-3xl">
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
      </div>
    </Layout>
  );
};

export default About;
