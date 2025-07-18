
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
        <div className={`${logoSizes[size]} flex items-center justify-center overflow-hidden rounded-full`}>
          <img 
            src="/lovable-uploads/52010dde-2ada-455c-86a1-5930e906e0cd.png" 
            alt="Let's Do It English Logo" 
            className="w-full h-full object-contain"
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
