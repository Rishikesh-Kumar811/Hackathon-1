import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectTotals } from '../redux/transactionSlice';
import { Wallet, TrendingUp, TrendingDown, Activity } from 'lucide-react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount).replace('-', '- ').replace('₹', '₹ ');
};

const useCountUp = (end, duration = 1200) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTimestamp = null;
    let animationFrameId;
    const startValue = count;
    const distance = end - startValue;
    
    if (distance === 0) return;
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(startValue + (easeProgress * distance));
      
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    
    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [end, duration]);
  
  return count;
};

const StatCard = ({ title, amount, icon: Icon, styles, mounted, children }) => (
  <article className={`@container relative p-7 glass-card overflow-hidden group ${styles.shadowHover} hover:-translate-y-1 cursor-default min-h-[170px] flex flex-col justify-between`}>
    {!mounted ? (
      <div className="animate-pulse w-full h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
          <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
        </div>
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mt-4"></div>
      </div>
    ) : (
      <>
        <div aria-hidden="true" className={`absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] -mr-24 -mt-24 transition-transform duration-1000 group-hover:scale-150 ${styles.blobBg}`}></div>
        <div className="relative z-10 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <p className={`text-[13px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase transition-colors ${styles.textHover}`}>{title}</p>
            <div className={`p-3 rounded-xl shadow-inner transition-all duration-500 group-hover:text-white group-hover:scale-105 flex-shrink-0 ${styles.iconBg}`}>
              <Icon className="w-5 h-5" strokeWidth={2.5} />
            </div>
          </div>
          <h3 className="text-[clamp(1rem,6cqi,2.5rem)] leading-tight font-extrabold text-slate-800 dark:text-white tracking-tighter truncate drop-shadow-sm">
            {formatCurrency(amount)}
          </h3>
        </div>
        
        <div className="relative z-10 mt-7 pt-5 border-t border-slate-100 dark:border-slate-700/50 flex animate-fade-in">
          {children}
        </div>
      </>
    )}
  </article>
);

const DashboardStats = () => {
  const { income, expense, balance } = useSelector(selectTotals);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);
  
  const animatedBalance = useCountUp(balance);
  const animatedIncome = useCountUp(income);
  const animatedExpense = useCountUp(expense);
  
  const expenseRatio = income > 0 ? Math.min((expense / income) * 100, 100) : (expense > 0 ? 100 : 0);
  const ratioColor = expenseRatio < 50 ? 'bg-success' : expenseRatio < 80 ? 'bg-yellow-500' : 'bg-danger';

  const statsConfig = [
    {
      title: "Total Balance",
      amount: animatedBalance,
      icon: Wallet,
      styles: {
        shadowHover: 'hover:shadow-[0_20px_40px_rgba(99,102,241,0.15)]',
        blobBg: 'from-primary/20 to-transparent group-hover:from-primary/30',
        textHover: 'group-hover:text-primary',
        iconBg: 'bg-primary/10 dark:bg-primary/20 text-primary group-hover:bg-primary group-hover:shadow-primary/50'
      },
      footer: (
        <>
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary mr-2.5 flex-shrink-0 group-hover:animate-pulse" style={{ animationDelay: '800ms' }}>
            <Activity className="w-3.5 h-3.5" strokeWidth={3} />
          </div>
          <span className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 transition-colors leading-[24px]">Available Funds</span>
        </>
      )
    },
    {
      title: "Total Income",
      amount: animatedIncome,
      icon: TrendingUp,
      styles: {
        shadowHover: 'hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)]',
        blobBg: 'from-success/20 to-transparent group-hover:from-success/30',
        textHover: 'group-hover:text-success',
        iconBg: 'bg-success/10 dark:bg-success/20 text-success group-hover:bg-success group-hover:shadow-success/50'
      },
      footer: (
        <>
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-success/10 text-success mr-2.5 flex-shrink-0 group-hover:animate-smooth-bounce" style={{ animationDelay: '800ms' }}>
            <TrendingUp className="w-3.5 h-3.5" strokeWidth={3} />
          </div>
          <span className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 transition-colors leading-[24px]">Earnings this period</span>
        </>
      )
    },
    {
      title: "Total Expense",
      amount: animatedExpense,
      icon: TrendingDown,
      styles: {
        shadowHover: 'hover:shadow-[0_20px_40px_rgba(239,68,68,0.15)]',
        blobBg: 'from-danger/20 to-transparent group-hover:from-danger/30',
        textHover: 'group-hover:text-danger',
        iconBg: 'bg-danger/10 dark:bg-danger/20 text-danger group-hover:bg-danger group-hover:shadow-danger/50'
      },
      footer: income > 0 ? (
        <div className="flex items-center justify-between gap-2 w-full">
          <div className="flex items-center min-w-0">
            <span className={`px-2 py-1 rounded-lg text-fluid-xs font-extrabold tracking-wide uppercase whitespace-nowrap transition-colors duration-500 ${expenseRatio < 50 ? 'bg-success/20 text-success dark:text-success/90' : expenseRatio < 80 ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' : 'bg-danger/20 text-danger dark:text-danger/90'}`}>
              {expenseRatio.toFixed(2)}% Used
            </span>
          </div>
          <div className="w-12 sm:w-24 md:w-12 lg:w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner flex-shrink-0" aria-label={`Expense ratio is ${expenseRatio.toFixed(2)}%`}>
            <div 
              className={`h-full w-full ${ratioColor} transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] origin-left transform-gpu`} 
              style={{ transform: `scaleX(${expenseRatio / 100})`, transitionDelay: '100ms' }}
            ></div>
          </div>
        </div>
      ) : (
        <div className="flex items-center w-full">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mr-2.5 flex-shrink-0">
            <span className="text-lg leading-none mb-0.5">-</span>
          </div>
          <span className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 leading-[24px]">No income recorded</span>
        </div>
      )
    }
  ];

  return (
    <section aria-label="Financial Summary" className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
      {statsConfig.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          amount={stat.amount}
          icon={stat.icon}
          styles={stat.styles}
          mounted={mounted}
        >
          {stat.footer}
        </StatCard>
      ))}
    </section>
  );
};

export default DashboardStats;
