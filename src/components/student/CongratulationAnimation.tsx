
import React, { useEffect, useState } from 'react';
import { Trophy, Sparkles } from 'lucide-react';

const CongratulationAnimation: React.FC = () => {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, color: string, rotation: number}>>([]);
  const [showMessage, setShowMessage] = useState(false);
  
  // Generate random particles for confetti effect
  useEffect(() => {
    const colors = ['#FFD700', '#1A365D', '#3182CE', '#D946EF', '#F97316', '#0EA5E9'];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -20 - Math.random() * 80,
      size: 5 + Math.random() * 15,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360
    }));
    
    setParticles(newParticles);
    
    // Show congratulatory message after a short delay
    setTimeout(() => {
      setShowMessage(true);
    }, 300);
    
    return () => {
      setParticles([]);
      setShowMessage(false);
    };
  }, []);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {/* Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-fall"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: particle.color,
            borderRadius: '2px',
            transform: `rotate(${particle.rotation}deg)`,
            animation: `fall 3s linear forwards, rotate-${Math.floor(Math.random() * 3)} 2s ease-in-out infinite alternate`
          }}
        />
      ))}
      
      {/* Congratulation Message */}
      <div 
        className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-r from-blue-900/80 to-yellow-500/80 backdrop-blur-sm transition-opacity duration-500 ${
          showMessage ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="text-center p-6 rounded-lg">
          <div className="flex justify-center mb-4">
            <Trophy className="h-16 w-16 text-yellow-400 animate-bounce" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Congratulations!</h2>
          <p className="text-xl text-white/90">
            You've completed all activities for this day!
          </p>
        </div>
      </div>
    </div>
  );
};

export default CongratulationAnimation;
