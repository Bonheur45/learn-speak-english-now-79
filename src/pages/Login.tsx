
import React from 'react';
import Navbar from '@/components/Navbar';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={false} />
      
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <LoginForm />
      </div>
      
      <footer className="bg-gray-100 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} Let's Do It English. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Login;
