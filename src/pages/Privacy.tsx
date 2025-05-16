
import React from 'react';
import Navbar from '@/components/Navbar';
import Logo from '@/components/Logo';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={false} />
      
      <main className="container mx-auto px-4 py-8 flex-grow max-w-3xl">
        <h1 className="text-3xl font-bold text-brand-blue mb-6">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="mb-4">
            At <em>Let's Do It English Program</em>, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our website, mobile application, and educational services.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-3">1. Information We Collect</h3>
          <p className="mb-3">We may collect the following types of information:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2"><strong>Personal Information</strong>: Your name, email address, phone number, institution, and cohort details when you register or communicate with us.</li>
            <li className="mb-2"><strong>Learning Activity Data</strong>: Progress tracking, test scores, feedback records, and participation in program challenges or public speaking exercises.</li>
            <li className="mb-2"><strong>Technical Data</strong>: IP address, browser type, device information, and usage data collected through cookies and analytics tools.</li>
            <li className="mb-2"><strong>Multimedia Submissions</strong>: Video/audio recordings, and public speaking assignments you choose to submit as part of the program.</li>
          </ul>

          <h3 className="text-xl font-bold mt-6 mb-3">2. How We Use Your Information</h3>
          <p className="mb-3">We use your information to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">Facilitate your enrollment and participation in the program.</li>
            <li className="mb-2">Track and support your learning progress.</li>
            <li className="mb-2">Provide personalized content such as lessons, podcasts, and feedback.</li>
            <li className="mb-2">Communicate important updates, class schedules, or announcements.</li>
            <li className="mb-2">Improve our services through analytics and user feedback.</li>
            <li className="mb-2">Share anonymized insights to evaluate program impact.</li>
          </ul>

          <h3 className="text-xl font-bold mt-6 mb-3">3. Information Sharing</h3>
          <p className="mb-3">We <strong>do not sell or rent</strong> your personal information. Your data may be shared only in the following cases:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">With internal team members (tutors or coordinators) for academic follow-up.</li>
            <li className="mb-2">With third-party services (e.g., email platforms, analytics tools) that help us operate the program—under strict confidentiality agreements.</li>
            <li className="mb-2">When required by law or legal obligation.</li>
          </ul>

          <h3 className="text-xl font-bold mt-6 mb-3">4. Your Choices and Rights</h3>
          <p className="mb-3">You have the right to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">Access, correct, or delete your personal data.</li>
            <li className="mb-2">Opt out of certain communications.</li>
            <li className="mb-2">Request that we stop using your data for analytics or non-essential services.</li>
          </ul>
          <p className="mb-4">To make such requests, please contact us via our contact form.</p>

          <h3 className="text-xl font-bold mt-6 mb-3">5. Data Security</h3>
          <p className="mb-4">We implement industry-standard measures to protect your information, including encrypted storage, restricted access, and secure data handling practices.</p>

          <h3 className="text-xl font-bold mt-6 mb-3">6. Use by Minors</h3>
          <p className="mb-4">The program is designed for university-level participants. If you are under 18, you must have permission from a parent or legal guardian to use the platform.</p>

          <h3 className="text-xl font-bold mt-6 mb-3">7. Updates to this Policy</h3>
          <p className="mb-4">We may update this Privacy Policy periodically. When we do, we'll revise the "last updated" date and notify you through the platform or email if changes are significant.</p>

          <p className="mt-6 text-sm font-bold">Last updated: 15/05/2025</p>
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

export default Privacy;
