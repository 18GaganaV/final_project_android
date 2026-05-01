import { motion } from 'motion/react';
import React from 'react';

interface GlitchTextProps {
  children: string;
  className?: string;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ children, className = "" }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <span className="relative z-10 font-bold tracking-tight">
        {children}
      </span>
    </div>
  );
};
