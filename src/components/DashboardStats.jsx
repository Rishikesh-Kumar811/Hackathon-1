import React from 'react';
import { useSelector } from 'react-redux';
import { selectTotals } from '../redux/transactionSlice';
import { Wallet, TrendingUp, TrendingDown, Activity } from 'lucide-react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount).replace(/^(\D+)/, '$1 ');
};

const DashboardStats = () => {
  const { income, expense, balance } = useSelector(selectTotals);
  
  const expenseRatio = income > 0 ? Math.min((expense / income) * 100, 100) : (expense > 0 ? 100 : 0);
  const ratioColor = expenseRatio < 50 ? 'bg-success' : expenseRatio < 80 ? 'bg-yellow-500' : 'bg-danger';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      
      {/* Balance Card */}
      <div className="relative p-7 glass-card overflow-hidden group hover:shadow-[0_20px_40px_rgba(99,102,241,0.1)] transition-all duration-700 hover:-translate-y-2 cursor-default">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -mr-24 -mt-24 transition-transform duration-700 group-hover:scale-150"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[13px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Total Balance</p>
            <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-xl shadow-inner transition-all duration-500 text-primary group-hover:bg-primary group-hover:text-white group-hover:shadow-primary/50 group-hover:scale-110 group-hover:rotate-3 flex-shrink-0">
              <Wallet className="w-5 h-5" strokeWidth={2.5} />
            </div>
          </div>
          <h3 className="text-[clamp(1.75rem,4vw,2.5rem)] leading-tight font-extrabold text-slate-800 dark:text-white tracking-tight truncate">
            {formatCurrency(balance)}
          </h3>
        </div>
        
        <div className="relative z-10 mt-7 pt-5 border-t border-slate-100 dark:border-slate-700/50 flex text-[13px] font-semibold text-slate-500 dark:text-slate-400 transition-colors">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary mr-2.5 flex-shrink-0">
            <Activity className="w-3.5 h-3.5" strokeWidth={3} />
          </div>
          <span className="leading-[24px]">Available Funds</span>
        </div>
      </div>

      {/* Income Card */}
      <div className="relative p-7 glass-card overflow-hidden group hover:shadow-[0_20px_40px_rgba(16,185,129,0.1)] transition-all duration-700 hover:-translate-y-2 cursor-default">
        <div className="absolute top-0 right-0 w-48 h-48 bg-success/10 rounded-full blur-3xl -mr-24 -mt-24 transition-transform duration-700 group-hover:scale-150"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[13px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Total Income</p>
            <div className="p-3 bg-success/10 dark:bg-success/20 rounded-xl shadow-inner transition-all duration-500 text-success group-hover:bg-success group-hover:text-white group-hover:shadow-success/50 group-hover:scale-110 group-hover:rotate-3 flex-shrink-0">
              <TrendingUp className="w-5 h-5" strokeWidth={2.5} />
            </div>
          </div>
          <h3 className="text-[clamp(1.75rem,4vw,2.5rem)] leading-tight font-extrabold text-slate-800 dark:text-white tracking-tight truncate">
            {formatCurrency(income)}
          </h3>
        </div>
        
        <div className="relative z-10 mt-7 pt-5 border-t border-slate-100 dark:border-slate-700/50 flex text-[13px] font-semibold text-slate-500 dark:text-slate-400 transition-colors">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-success/10 text-success mr-2.5 flex-shrink-0">
            <TrendingUp className="w-3.5 h-3.5" strokeWidth={3} />
          </div>
          <span className="leading-[24px]">Earnings this period</span>
        </div>
      </div>

      {/* Expense Card */}
      <div className="relative p-7 glass-card overflow-hidden group hover:shadow-[0_20px_40px_rgba(239,68,68,0.1)] transition-all duration-700 hover:-translate-y-2 cursor-default">
        <div className="absolute top-0 right-0 w-48 h-48 bg-danger/10 rounded-full blur-3xl -mr-24 -mt-24 transition-transform duration-700 group-hover:scale-150"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[13px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Total Expense</p>
            <div className="p-3 bg-danger/10 dark:bg-danger/20 rounded-xl shadow-inner transition-all duration-500 text-danger group-hover:bg-danger group-hover:text-white group-hover:shadow-danger/50 group-hover:scale-110 group-hover:rotate-3 flex-shrink-0">
              <TrendingDown className="w-5 h-5" strokeWidth={2.5} />
            </div>
          </div>
          <h3 className="text-[clamp(1.75rem,4vw,2.5rem)] leading-tight font-extrabold text-slate-800 dark:text-white tracking-tight truncate">
            {formatCurrency(expense)}
          </h3>
        </div>
        
        {income > 0 ? (
          <div className="relative z-10 mt-7 pt-5 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between gap-2">
            <div className="flex items-center min-w-0">
              <span className={`px-2 py-1 rounded-lg text-[10px] sm:text-[11px] font-extrabold tracking-wide uppercase whitespace-nowrap ${expenseRatio < 50 ? 'bg-success/20 text-success dark:text-success/90' : expenseRatio < 80 ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' : 'bg-danger/20 text-danger dark:text-danger/90'}`}>
                {expenseRatio.toFixed(2)}% Used
              </span>
            </div>
            
            <div className="w-12 sm:w-24 md:w-12 lg:w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner flex-shrink-0" aria-label={`Expense ratio is ${expenseRatio.toFixed(2)}%`}>
              <div 
                className={`h-full ${ratioColor} transition-all duration-1000 ease-out`} 
                style={{ width: `${expenseRatio}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="relative z-10 mt-7 pt-5 border-t border-slate-100 dark:border-slate-700/50 flex text-[13px] font-semibold text-slate-500 dark:text-slate-400">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mr-2.5 flex-shrink-0">
              <span className="text-lg leading-none mb-0.5">-</span>
            </div>
            <span className="leading-[24px]">No income recorded</span>
          </div>
        )}
      </div>

    </div>
  );
};

export default DashboardStats;
