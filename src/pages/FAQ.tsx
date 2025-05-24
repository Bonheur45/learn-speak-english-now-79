
import React from 'react';
import Layout from '@/components/Layout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ = () => {
  return (
    <Layout isLoggedIn={false}>
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold text-brand-blue mb-6">Frequently Asked Questions</h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">How The Program Works</h2>
          
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
              <AccordionTrigger>Is there a a fee for the program?</AccordionTrigger>
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
        
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Our Curriculum</h2>
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/0c7dbc41-1f03-4dc8-8f69-e24a5bcb43b7.png" 
              alt="Let's Do It English Curriculum" 
              className="w-full max-w-lg rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
