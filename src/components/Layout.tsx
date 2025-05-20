
import React from 'react';
import Navbar from './Navbar';
import { UserRole } from '@/lib/types';
import { Toaster } from "@/components/ui/sonner";

interface LayoutProps {
  children: React.ReactNode;
  isLoggedIn: boolean;
  userRole?: UserRole;
  fullWidth?: boolean;
}

const Layout = ({ children, isLoggedIn, userRole, fullWidth = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} userRole={userRole} />
      <main className={`flex-1 pt-32 md:pt-28 lg:pt-24 pb-8 ${fullWidth ? 'px-0' : 'px-2 sm:px-4 lg:px-6'}`}>
        {children}
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default Layout;
