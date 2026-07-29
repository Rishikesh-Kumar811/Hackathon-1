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
    <div ref={wrapperRef} className="flex flex-col relative overflow-hidden bg-slate-50 dark:bg-slate-900 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 dark:bg-primary/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-success/10 blur-[120px]"></div>
      </div>

      <div className="w-full max-w-[1536px] mx-auto flex flex-col">
        <header className="mb-10 flex flex-row items-center justify-between">
          <div className="flex items-center text-left">
            <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-xl mr-4 shadow-sm">
              <Activity className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-400 dark:to-emerald-400">
                FinTrack
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-medium transition-colors hidden sm:block">Modern Personal Finance Dashboard</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsDark(!isDark)}
            className="group relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 hover:bg-slate-50 dark:hover:bg-slate-700 overflow-hidden cursor-pointer"
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
