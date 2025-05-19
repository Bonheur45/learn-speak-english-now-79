
import React from 'react';
import Navbar from './Navbar';
import { UserRole } from '@/lib/types';

interface LayoutProps {
  children: React.ReactNode;
  isLoggedIn: boolean;
  userRole?: UserRole;
}

const Layout = ({ children, isLoggedIn, userRole }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} userRole={userRole} />
      <main className="flex-1 pt-24 pb-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
