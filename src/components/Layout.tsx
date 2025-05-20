
import React from 'react';
import Navbar from './Navbar';
import { UserRole } from '@/lib/types';
import { Toaster } from "@/components/ui/sonner";

interface LayoutProps {
  children: React.ReactNode;
  isLoggedIn: boolean;
  userRole?: UserRole;
}

const Layout = ({ children, isLoggedIn, userRole }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} userRole={userRole} />
      <main className="flex-1 pt-32 md:pt-28 lg:pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default Layout;
