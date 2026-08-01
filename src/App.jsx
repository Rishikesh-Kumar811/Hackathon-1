import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { Activity, Sun, Moon } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';

const DashboardStats = lazy(() => import('./components/DashboardStats'));
const TransactionForm = lazy(() => import('./components/TransactionForm'));
const TransactionList = lazy(() => import('./components/TransactionList'));

const LoadingSkeleton = () => (
  <div className="w-full h-48 rounded-3xl bg-slate-200/50 dark:bg-slate-800/50 animate-pulse glass-card flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

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

  useEffect(() => {
    if (!wrapperRef.current) return;
    
    let currentScale = 1;
    const BASE_WIDTH = 1536;
    
    const updateLayout = () => {
      const trueWidth = window.innerWidth;
      if (trueWidth > BASE_WIDTH) {
        currentScale = trueWidth / BASE_WIDTH;
        wrapperRef.current.style.transform = `scale(${currentScale})`;
        wrapperRef.current.style.transformOrigin = 'top left';
        wrapperRef.current.style.width = `${BASE_WIDTH}px`;
        wrapperRef.current.style.zoom = '';
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
        const originalHeight = wrapperRef.current.offsetHeight;
        const scaledHeight = originalHeight * currentScale;
        document.body.style.minHeight = `${scaledHeight}px`;
        document.documentElement.style.minHeight = `${scaledHeight}px`;
      } else {
        document.body.style.minHeight = '100dvh';
        document.documentElement.style.minHeight = '100dvh';
      }
    };

    window.addEventListener('resize', updateLayout);
    updateLayout(); 
    
    let rAF;
    const observer = new ResizeObserver(() => {
      if (currentScale > 1) {
        cancelAnimationFrame(rAF);
        rAF = window.requestAnimationFrame(() => {
          updateBodyHeight();
        });
      }
    });
    observer.observe(wrapperRef.current);
    
    return () => {
      window.removeEventListener('resize', updateLayout);
      observer.disconnect();
      cancelAnimationFrame(rAF);
    };
  }, []);

  return (
    <>
      <title>FinTrack | Modern Personal Finance Dashboard 2026</title>
      <meta name="description" content="Manage your personal finances with the ultra-HD, lag-free FinTrack application. Track incomes, expenses, and overall balance instantly." />
      <meta name="theme-color" content={isDark ? "#09090b" : "#f8fafc"} />
      <meta property="og:title" content="FinTrack Dashboard" />
      <meta property="og:description" content="Manage your personal finances with the ultra-HD, lag-free FinTrack application." />
      <meta property="og:type" content="website" />
      
      <main role="main" ref={wrapperRef} className="flex flex-col relative bg-[#f8fafc] dark:bg-[#09090b] min-h-dvh py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-700 subpixel-antialiased">
      <div aria-hidden="true" className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-400/40 to-transparent dark:from-indigo-600/30 dark:to-transparent opacity-80 md:animate-pulse duration-[8000ms]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-400/40 to-transparent dark:from-purple-600/30 dark:to-transparent opacity-80"></div>
        <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-300/30 to-transparent dark:from-blue-500/20 dark:to-transparent opacity-80"></div>
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
            <div className={`absolute transition-all duration-500 transform ${isDark ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-50'}`}>
               <Sun className="h-6 w-6 text-amber-500 flex-shrink-0" />
            </div>
            <div className={`absolute transition-all duration-500 transform ${isDark ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}`}>
               <Moon className="h-6 w-6 text-indigo-400 flex-shrink-0" />
            </div>
          </button>
        </header>

        <ErrorBoundary>
          <Suspense fallback={<LoadingSkeleton />}>
            <DashboardStats />

            <section aria-label="Transactions Workspace" className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6 mt-10">
              <div className="lg:col-span-1 self-start">
                <TransactionForm />
              </div>
              <div className="lg:col-span-2">
                <TransactionList />
              </div>
            </section>
          </Suspense>
        </ErrorBoundary>
        
        <footer className="mt-6 text-center text-slate-500 dark:text-slate-400 text-sm pb-8 transition-colors">
          <p>Built with React, Redux Toolkit & Tailwind CSS</p>
          <p className="mt-1">Hackathon Project Submission</p>
        </footer>
      </div>
      </main>
    </>
  );
}

export default App;
