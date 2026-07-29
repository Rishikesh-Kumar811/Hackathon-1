import React, { useState, useEffect, useRef } from 'react';
import DashboardStats from './components/DashboardStats';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import { Activity, Sun, Moon } from 'lucide-react';

function App() {
  const wrapperRef = useRef(null);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // CSS Transform Scaling for Ultra-wide / 4K Monitors (Replaces buggy CSS zoom)
  useEffect(() => {
    if (!wrapperRef.current) return;
    
    let currentScale = 1;
    const BASE_WIDTH = 1536; // Standard 2xl desktop width
    
    const updateLayout = () => {
      const trueWidth = window.innerWidth;
      if (trueWidth > BASE_WIDTH) {
        currentScale = trueWidth / BASE_WIDTH;
        wrapperRef.current.style.transform = `scale(${currentScale})`;
        wrapperRef.current.style.transformOrigin = 'top left';
        wrapperRef.current.style.width = `${BASE_WIDTH}px`;
        wrapperRef.current.style.zoom = ''; // Ensure zoom is removed
      } else {
        currentScale = 1;
        wrapperRef.current.style.transform = 'none';
        wrapperRef.current.style.width = '100%';
        wrapperRef.current.style.zoom = '';
      }
      updateBodyHeight();
    };
    
    const updateBodyHeight = () => {
      if (!wrapperRef.current) return;
      if (currentScale > 1) {
        // offsetHeight ignores transform scale, giving us the exact original height
        const originalHeight = wrapperRef.current.offsetHeight;
        const scaledHeight = originalHeight * currentScale;
        document.body.style.minHeight = `${scaledHeight}px`;
        document.documentElement.style.minHeight = `${scaledHeight}px`;
      } else {
        document.body.style.minHeight = '100vh';
        document.documentElement.style.minHeight = '100vh';
      }
    };

    window.addEventListener('resize', updateLayout);
    updateLayout(); 
    
    // Watch for content changes (like adding transactions) to update scroll height dynamically
    const observer = new ResizeObserver(() => {
      updateBodyHeight();
    });
    observer.observe(wrapperRef.current);
    
    return () => {
      window.removeEventListener('resize', updateLayout);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="flex flex-col relative overflow-hidden bg-[#f8fafc] dark:bg-[#09090b] min-h-screen py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-700">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/20 dark:bg-indigo-600/15 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse duration-[8000ms]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400/20 dark:bg-purple-600/15 blur-[120px] mix-blend-multiply dark:mix-blend-screen"></div>
        <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] rounded-full bg-blue-300/10 dark:bg-blue-500/10 blur-[100px] mix-blend-multiply dark:mix-blend-screen"></div>
      </div>

      <div className="w-full max-w-[1536px] mx-auto flex flex-col">
        <header className="mb-10 flex flex-row items-center justify-between">
          <div className="flex items-center text-left">
            <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-xl mr-4 shadow-sm">
              <Activity className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_auto] animate-gradient">
                FinTrack
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-medium transition-colors hidden sm:block">Modern Personal Finance Dashboard</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsDark(!isDark)}
            className="group relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/70 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-lg backdrop-blur-xl hover:shadow-indigo-500/20 transition-all duration-500 hover:-translate-y-1 overflow-hidden cursor-pointer"
            title="Toggle Day/Night Mode"
          >
            <div className={`absolute transition-all duration-500 transform ${isDark ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}`}>
               <Sun className="h-6 w-6 text-amber-500 drop-shadow-sm" />
            </div>
            <div className={`absolute transition-all duration-500 transform ${isDark ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-50'}`}>
               <Moon className="h-6 w-6 text-indigo-400 drop-shadow-sm" />
            </div>
          </button>
        </header>

        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
          <div className="lg:col-span-1 self-start">
            <TransactionForm />
          </div>
          <div className="lg:col-span-2">
            <TransactionList />
          </div>
        </div>
        
        <footer className="mt-6 text-center text-slate-500 dark:text-slate-400 text-sm pb-8 transition-colors">
          <p>Built with React, Redux Toolkit & Tailwind CSS</p>
          <p className="mt-1">Hackathon Project Submission</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
