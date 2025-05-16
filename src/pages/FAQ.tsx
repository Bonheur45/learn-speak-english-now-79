
import React from 'react';
import Navbar from '@/components/Navbar';
import Logo from '@/components/Logo';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={false} />
      
      <main className="container mx-auto px-4 py-8 flex-grow max-w-3xl">
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
      </main>

      <footer className="bg-gray-100 py-8 mt-8">
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

export default FAQ;
