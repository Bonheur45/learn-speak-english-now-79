
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

const Logo = ({ size = 'medium' }: LogoProps) => {
  const sizeClasses = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-4xl'
  };

  const logoSizes = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-14 h-14'
  };

  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="bg-brand-yellow p-1 rounded-full">
        <div className={`${logoSizes[size]} flex items-center justify-center overflow-hidden`}>
          <img 
            src="/lovable-uploads/c82aba41-bfb1-45f2-8f3d-04ad8aad88fd.png" 
            alt="Thumbs up" 
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>
      <div className={`font-heading font-bold ${sizeClasses[size]}`}>
        <span className="text-brand-blue">Let's</span> 
        <span className="text-brand-yellow"> Do It</span> 
        <span className="text-brand-blue"> English</span>
      </div>
    </Link>
  );
};

export default Logo;
