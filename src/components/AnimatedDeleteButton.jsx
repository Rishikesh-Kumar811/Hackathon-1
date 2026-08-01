import React from 'react';

const AnimatedDeleteButton = ({ deleteStage, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={deleteStage > 0}
      className={`group/btn relative w-10 h-10 flex items-center justify-center rounded-[12px] bg-slate-200 dark:bg-slate-800 transform-gpu subpixel-antialiased transition-all duration-300 ${deleteStage === 0 ? 'hover:bg-danger/20 hover:text-danger hover:shadow-lg hover:-translate-y-0.5' : ''}`}
      aria-label="Delete transaction"
    >
      <svg 
        viewBox="0 0 100 120" 
        className={`w-7 h-7 overflow-visible transition-transform duration-300 ${deleteStage >= 4 ? 'scale-0 opacity-0' : 'scale-100 group-hover/btn:scale-110'}`}
        shapeRendering="geometricPrecision"
      >
        <defs>
          <linearGradient id="bin-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" className="text-slate-500 dark:text-slate-700" stopColor="currentColor" />
            <stop offset="20%" className="text-slate-300 dark:text-slate-400" stopColor="currentColor" />
            <stop offset="50%" className="text-slate-500 dark:text-slate-600" stopColor="currentColor" />
            <stop offset="85%" className="text-slate-400 dark:text-slate-500" stopColor="currentColor" />
            <stop offset="100%" className="text-slate-600 dark:text-slate-800" stopColor="currentColor" />
          </linearGradient>
          
          <linearGradient id="lid-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className="text-slate-100 dark:text-slate-400" stopColor="currentColor" />
            <stop offset="100%" className="text-slate-400 dark:text-slate-700" stopColor="currentColor" />
          </linearGradient>
          
          <linearGradient id="rim-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" className="text-slate-500 dark:text-slate-800" stopColor="currentColor" />
            <stop offset="30%" className="text-slate-200 dark:text-slate-500" stopColor="currentColor" />
            <stop offset="70%" className="text-slate-300 dark:text-slate-600" stopColor="currentColor" />
            <stop offset="100%" className="text-slate-600 dark:text-slate-900" stopColor="currentColor" />
          </linearGradient>
          
          <filter id="inner-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="4" floodColor="#000" floodOpacity="0.4" />
          </filter>
        </defs>

        {}
        {}
        <ellipse cx="50" cy="40" rx="30" ry="10" fill="#0f172a" className="dark:fill-black" />

        {}
        <path d="M 20 40 v 48 c 0 11, 60 11, 60 0 v -48 z" fill="url(#bin-grad)" stroke="currentColor" className="text-slate-300 dark:text-transparent" strokeWidth="1" />

        {}
        <path d="M 20 40 c 0 10, 60 10, 60 0" fill="none" stroke="url(#rim-grad)" strokeWidth="1.5" />

        {}
        <path d="M 32 50 v 33 M 41 52 v 34 M 50 53 v 34 M 59 52 v 34 M 68 50 v 33" 
              fill="none" 
              stroke="rgba(0,0,0,0.15)" 
              strokeWidth="2" 
              strokeLinecap="round" 
              className="dark:stroke-black/40" />
        
        {}
        <path d="M 33 50 v 33 M 42 52 v 34 M 51 53 v 34 M 60 52 v 34 M 69 50 v 33" 
              fill="none" 
              stroke="rgba(255,255,255,0.4)" 
              strokeWidth="1" 
              strokeLinecap="round" 
              className="dark:stroke-white/10" />

        {}
        <g 
          className="transition-all duration-500 ease-in-out origin-bottom-right"
          style={{
            transform: (deleteStage >= 1 && deleteStage < 3)
              ? 'translate(18px, -22px) rotate(30deg)' 
              : 'translate(0px, 0px) rotate(0deg)'
          }}
        >
          {}
          <g className={`transition-transform duration-300 ${deleteStage === 0 ? 'group-hover/btn:-translate-y-[6px]' : ''}`}>
            
            {}
            <path d="M 18 38 v 5 c 0 12, 64 12, 64 0 v -5 z" fill="rgba(0,0,0,0.3)" filter="url(#inner-shadow)" className="dark:fill-black/50" />
            
            {}
            <path d="M 17 38 v 4 c 0 12, 66 12, 66 0 v -4 z" fill="url(#rim-grad)" />
            
            {}
            <ellipse cx="50" cy="38" rx="33" ry="11" fill="url(#lid-grad)" />
            
            {}
            <ellipse cx="50" cy="35" rx="12" ry="4" fill="url(#rim-grad)" />
            
            {}
            <path d="M 42 34 c 0 -3, 16 -3, 16 0 v 2 h -16 z" fill="url(#rim-grad)" />
            
            {}
            <path d="M 44 34 c 0 -9, 12 -9, 12 0" fill="none" stroke="url(#rim-grad)" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 44 34 c 0 -9, 12 -9, 12 0" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeLinecap="round" className="dark:stroke-white/10" />
          </g>
        </g>
      </svg>
    </button>
  );
};

export default AnimatedDeleteButton;

