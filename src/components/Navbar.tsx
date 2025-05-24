import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserRole } from '@/lib/types';
import Logo from './Logo';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';
import { BookOpen, GraduationCap, Layout, Layers } from 'lucide-react';

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

  // Create stylized NavLink component for desktop menu
  const NavLink = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
  >(({ className, title, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </a>
    );
  });
  NavLink.displayName = "NavLink";

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo size="medium" />
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            {!isLoggedIn ? (
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link to="/" className={`${navigationMenuTriggerStyle()} ${location.pathname === '/' ? 'bg-accent' : ''}`}>
                      Home
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>About</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[400px] gap-3 p-4">
                        <NavLink href="/about" title="About Us">
                          Learn about our mission and teaching philosophy
                        </NavLink>
                        <NavLink href="/contact" title="Contact Us">
                          Get in touch with our team for any questions
                        </NavLink>
                        <NavLink href="/faq" title="FAQ">
                          Find answers to commonly asked questions
                        </NavLink>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/login" className={`${navigationMenuTriggerStyle()} ${location.pathname === '/login' ? 'bg-accent' : ''}`}>
                      Login
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/register" className="inline-flex items-center justify-center rounded-md bg-brand-yellow px-4 py-2 text-sm font-medium text-brand-blue transition-colors hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-offset-2 disabled:opacity-50">
                      Start Learning
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            ) : userRole === 'student' ? (
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link to="/student/dashboard" className={`${navigationMenuTriggerStyle()} ${location.pathname === '/student/dashboard' ? 'bg-accent' : ''}`}>
                      Dashboard
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Learning</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[400px] grid-cols-1 gap-3 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <GraduationCap className="h-4 w-4 text-brand-blue" />
                          <span className="font-medium">Your Learning Path</span>
                        </div>
                        <NavLink href="/student/cohorts" title="Cohorts">
                          Browse and join available learning cohorts
                        </NavLink>
                        <NavLink href="/student/trimesters" title="Trimesters">
                          View your trimester progress and materials
                        </NavLink>
                        <NavLink href="/student/days" title="Daily Lessons">
                          Access your daily learning materials
                        </NavLink>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Assessment</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-4 w-[400px]">
                        <div className="flex items-center gap-2 mb-2">
                          <Layout className="h-4 w-4 text-brand-blue" />
                          <span className="font-medium">Your Assessments</span>
                        </div>
                        <NavLink href="/student/assessments" title="All Assessments">
                          View all vocabulary and topic tests
                        </NavLink>
                        <NavLink href="/student/writing-submissions" title="Writing Submissions">
                          Check your writing assessment status
                        </NavLink>
                        <NavLink href="/student/progress" title="Progress Report">
                          Track your learning progress and scores
                        </NavLink>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <Link to="/student/profile" className={navigationMenuTriggerStyle()}>
                      Profile
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <button className="inline-flex items-center justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none disabled:opacity-50">
                      Logout
                    </button>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            ) : (
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link to="/tutor/dashboard" className={`${navigationMenuTriggerStyle()} ${location.pathname === '/tutor/dashboard' ? 'bg-accent' : ''}`}>
                      Dashboard
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Manage</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[400px] grid-cols-1 gap-3 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Layers className="h-4 w-4 text-brand-blue" />
                          <span className="font-medium">Cohort Management</span>
                        </div>
                        <NavLink href="/tutor/cohorts" title="Cohorts">
                          Manage your assigned cohorts
                        </NavLink>
                        <NavLink href="/tutor/students" title="Students">
                          View and manage student progress
                        </NavLink>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Content</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[400px] grid-cols-1 gap-3 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="h-4 w-4 text-brand-blue" />
                          <span className="font-medium">Learning Materials</span>
                        </div>
                        <NavLink href="/tutor/materials" title="Materials Library">
                          Browse all available learning materials
                        </NavLink>
                        <NavLink href="/tutor/upload" title="Upload Materials">
                          Create and upload new learning content
                        </NavLink>
                        <NavLink href="/tutor/assessments" title="Manage Assessments">
                          Create and edit assessments
                        </NavLink>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <Link to="/tutor/profile" className={navigationMenuTriggerStyle()}>
                      Profile
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <button className="inline-flex items-center justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none disabled:opacity-50">
                      Logout
                    </button>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
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
                  <Link to="/about" className={`py-1 px-2 ${isActive('/about')}`} onClick={toggleMobileMenu}>About</Link>
                  <Link to="/contact" className={`py-1 px-2 ${isActive('/contact')}`} onClick={toggleMobileMenu}>Contact</Link>
                  <Link to="/faq" className={`py-1 px-2 ${isActive('/faq')}`} onClick={toggleMobileMenu}>FAQ</Link>
                  <Link to="/login" className={`py-1 px-2 ${isActive('/login')}`} onClick={toggleMobileMenu}>Login</Link>
                  <Link to="/register" className="btn-primary mt-2" onClick={toggleMobileMenu}>Start Learning</Link>
                </>
              ) : userRole === 'student' ? (
                <>
                  <Link to="/student/dashboard" className={`py-1 px-2 ${isActive('/student/dashboard')}`} onClick={toggleMobileMenu}>Dashboard</Link>
                  <div className="pl-2 border-l-2 border-gray-200 ml-2">
                    <Link to="/student/cohorts" className={`py-1 px-2 ${isActive('/student/cohorts')}`} onClick={toggleMobileMenu}>Cohorts</Link>
                    <Link to="/student/trimesters" className={`py-1 px-2 ${isActive('/student/trimesters')}`} onClick={toggleMobileMenu}>Trimesters</Link>
                    <Link to="/student/days" className={`py-1 px-2 ${isActive('/student/days')}`} onClick={toggleMobileMenu}>Lessons</Link>
                    <Link to="/student/assessments" className={`py-1 px-2 ${isActive('/student/assessments')}`} onClick={toggleMobileMenu}>Assessments</Link>
                    <Link to="/student/progress" className={`py-1 px-2 ${isActive('/student/progress')}`} onClick={toggleMobileMenu}>Progress</Link>
                  </div>
                  <Link to="/student/profile" className={`py-1 px-2 ${isActive('/student/profile')}`} onClick={toggleMobileMenu}>Profile</Link>
                  <button className="btn-secondary mt-2" onClick={toggleMobileMenu}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/tutor/dashboard" className={`py-1 px-2 ${isActive('/tutor/dashboard')}`} onClick={toggleMobileMenu}>Dashboard</Link>
                  <div className="pl-2 border-l-2 border-gray-200 ml-2">
                    <Link to="/tutor/cohorts" className={`py-1 px-2 ${isActive('/tutor/cohorts')}`} onClick={toggleMobileMenu}>Cohorts</Link>
                    <Link to="/tutor/students" className={`py-1 px-2 ${isActive('/tutor/students')}`} onClick={toggleMobileMenu}>Students</Link>
                    <Link to="/tutor/materials" className={`py-1 px-2 ${isActive('/tutor/materials')}`} onClick={toggleMobileMenu}>Materials</Link>
                  </div>
                  <Link to="/tutor/upload" className={`py-1 px-2 ${isActive('/tutor/upload')}`} onClick={toggleMobileMenu}>Upload</Link>
                  <Link to="/tutor/profile" className={`py-1 px-2 ${isActive('/tutor/profile')}`} onClick={toggleMobileMenu}>Profile</Link>
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
