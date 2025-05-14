
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserRole } from '@/lib/types';
import Logo from './Logo';

interface NavbarProps {
  userRole?: UserRole;
  isLoggedIn: boolean;
}

const Navbar = ({ userRole, isLoggedIn }: NavbarProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'nav-link-active' : '';
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo size="medium" />
          
          <nav className="hidden md:flex items-center space-x-2">
            {!isLoggedIn ? (
              <>
                <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
                <Link to="/login" className={`nav-link ${isActive('/login')}`}>Login</Link>
                <Link to="/register" className={`nav-link ${isActive('/register')}`}>Register</Link>
                <Link to="/login" className="btn-primary">Start Learning</Link>
              </>
            ) : userRole === 'student' ? (
              <>
                <Link to="/student/dashboard" className={`nav-link ${isActive('/student/dashboard')}`}>Dashboard</Link>
                <Link to="/student/days" className={`nav-link ${isActive('/student/days')}`}>Lessons</Link>
                <Link to="/student/assessments" className={`nav-link ${isActive('/student/assessments')}`}>Assessments</Link>
                <Link to="/student/progress" className={`nav-link ${isActive('/student/progress')}`}>Progress</Link>
                <button className="btn-secondary">Logout</button>
              </>
            ) : (
              <>
                <Link to="/tutor/dashboard" className={`nav-link ${isActive('/tutor/dashboard')}`}>Dashboard</Link>
                <Link to="/tutor/materials" className={`nav-link ${isActive('/tutor/materials')}`}>Materials</Link>
                <Link to="/tutor/students" className={`nav-link ${isActive('/tutor/students')}`}>Students</Link>
                <Link to="/tutor/upload" className={`nav-link ${isActive('/tutor/upload')}`}>Upload</Link>
                <button className="btn-secondary">Logout</button>
              </>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
