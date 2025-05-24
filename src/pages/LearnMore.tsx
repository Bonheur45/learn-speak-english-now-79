
import React from 'react';
import Layout from '@/components/Layout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const LearnMore = () => {
  return (
    <Layout isLoggedIn={false}>
      <div className="container mx-auto px-4 max-w-4xl">
        {/* About Us Section */}
        <section className="mb-16">
          <h1 className="text-4xl font-bold text-brand-blue mb-8">About Us</h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-lg mb-6">
              Let's Do It English Program is a youth-led, cohort-based initiative designed to equip its members, especially those from underserved English backgrounds, with world-class communication skills. With a tutor-to-student ratio of 1:10, we provide personalized mentorship to build English proficiency from the ground up to high-standard levels.
            </p>
            
            <p className="text-lg mb-6">
              Our goal is to bridge communication gaps and empower our members to stand out on both local and global stages, opening up new opportunities for collaboration, networking, and growth in their professional trajectories.
            </p>
            
            <p className="text-lg mb-8">
              Beyond English proficiency, the program also focuses on public speaking, strategic communication, project formulation and project presentation skills.
            </p>
            
            <div className="bg-brand-blue text-white p-8 rounded-lg mb-8">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-xl">To help our members express their full potential</p>
            </div>
            
            <h2 className="text-3xl font-bold mb-6">Our Curriculum</h2>
            <div className="flex justify-center mb-12">
              <img 
                src="/lovable-uploads/0c7dbc41-1f03-4dc8-8f69-e24a5bcb43b7.png" 
                alt="Let's Do It English Curriculum" 
                className="w-full max-w-lg rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-3xl font-bold text-brand-blue mb-8">Frequently Asked Questions</h2>
          
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-6">How The Program Works</h3>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is the program structure?</AccordionTrigger>
                <AccordionContent>
                  The program is free and organized into three Trims, each lasting two months. All class materials are digitally delivered through our e-learning system to each subscriber's portal.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>What learning materials are provided?</AccordionTrigger>
                <AccordionContent>
                  We provide video lessons, test forms, reading tasks, short movie episodes, listening challenges, podcasts, and more—all digitally delivered through our e-learning system.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>What happens in the final Trim?</AccordionTrigger>
                <AccordionContent>
                  The final Trim focuses on writing, with guidance from a mentor to help you develop advanced writing skills.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>Is there a fee for the program?</AccordionTrigger>
                <AccordionContent>
                  No, the program is completely free for accepted participants.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger>What is the tutor-to-student ratio?</AccordionTrigger>
                <AccordionContent>
                  We maintain a 1:10 tutor-to-student ratio to ensure personalized attention and feedback for each participant.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default LearnMore;
