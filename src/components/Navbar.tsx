import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserRole } from '@/lib/types';
import Logo from './Logo';

interface NavbarProps {
  userRole?: UserRole;
  isLoggedIn: boolean;
}

const Navbar = ({ userRole, isLoggedIn }: NavbarProps) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path ? 'nav-link-active' : '';
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
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
                <Link to="/student/cohorts" className={`nav-link ${isActive('/student/cohorts')}`}>Cohorts</Link>
                <Link to="/student/trimesters" className={`nav-link ${isActive('/student/trimesters')}`}>Trimesters</Link>
                <Link to="/student/days" className={`nav-link ${isActive('/student/days')}`}>Lessons</Link>
                <Link to="/student/assessments" className={`nav-link ${isActive('/student/assessments')}`}>Assessments</Link>
                <Link to="/student/progress" className={`nav-link ${isActive('/student/progress')}`}>Progress</Link>
                <button className="btn-secondary">Logout</button>
              </>
            ) : (
              <>
                <Link to="/tutor/dashboard" className={`nav-link ${isActive('/tutor/dashboard')}`}>Dashboard</Link>
                <Link to="/tutor/cohorts" className={`nav-link ${isActive('/tutor/cohorts')}`}>Cohorts</Link>
                <Link to="/tutor/materials" className={`nav-link ${isActive('/tutor/materials')}`}>Materials</Link>
                <Link to="/tutor/students" className={`nav-link ${isActive('/tutor/students')}`}>Students</Link>
                <Link to="/tutor/upload" className={`nav-link ${isActive('/tutor/upload')}`}>Upload</Link>
                <button className="btn-secondary">Logout</button>
              </>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-2" onClick={toggleMobileMenu} aria-label="Toggle menu">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-2 border-t border-gray-100 bg-white">
            <nav className="flex flex-col space-y-2">
              {!isLoggedIn ? (
                <>
                  <Link to="/" className={`py-1 px-2 ${isActive('/')}`} onClick={toggleMobileMenu}>Home</Link>
                  <Link to="/login" className={`py-1 px-2 ${isActive('/login')}`} onClick={toggleMobileMenu}>Login</Link>
                  <Link to="/register" className={`py-1 px-2 ${isActive('/register')}`} onClick={toggleMobileMenu}>Register</Link>
                  <Link to="/login" className="btn-primary mt-2" onClick={toggleMobileMenu}>Start Learning</Link>
                </>
              ) : userRole === 'student' ? (
                <>
                  <Link to="/student/dashboard" className={`py-1 px-2 ${isActive('/student/dashboard')}`} onClick={toggleMobileMenu}>Dashboard</Link>
                  <Link to="/student/cohorts" className={`py-1 px-2 ${isActive('/student/cohorts')}`} onClick={toggleMobileMenu}>Cohorts</Link>
                  <Link to="/student/trimesters" className={`py-1 px-2 ${isActive('/student/trimesters')}`} onClick={toggleMobileMenu}>Trimesters</Link>
                  <Link to="/student/days" className={`py-1 px-2 ${isActive('/student/days')}`} onClick={toggleMobileMenu}>Lessons</Link>
                  <Link to="/student/assessments" className={`py-1 px-2 ${isActive('/student/assessments')}`} onClick={toggleMobileMenu}>Assessments</Link>
                  <Link to="/student/progress" className={`py-1 px-2 ${isActive('/student/progress')}`} onClick={toggleMobileMenu}>Progress</Link>
                  <button className="btn-secondary mt-2" onClick={toggleMobileMenu}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/tutor/dashboard" className={`py-1 px-2 ${isActive('/tutor/dashboard')}`} onClick={toggleMobileMenu}>Dashboard</Link>
                  <Link to="/tutor/cohorts" className={`py-1 px-2 ${isActive('/tutor/cohorts')}`} onClick={toggleMobileMenu}>Cohorts</Link>
                  <Link to="/tutor/materials" className={`py-1 px-2 ${isActive('/tutor/materials')}`} onClick={toggleMobileMenu}>Materials</Link>
                  <Link to="/tutor/students" className={`py-1 px-2 ${isActive('/tutor/students')}`} onClick={toggleMobileMenu}>Students</Link>
                  <Link to="/tutor/upload" className={`py-1 px-2 ${isActive('/tutor/upload')}`} onClick={toggleMobileMenu}>Upload</Link>
                  <button className="btn-secondary mt-2" onClick={toggleMobileMenu}>Logout</button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
