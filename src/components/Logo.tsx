
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

  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="bg-brand-yellow p-2 rounded-full">
        <div className="w-8 h-8 flex items-center justify-center">
          <span role="img" aria-label="smile" className="text-2xl">😀</span>
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
