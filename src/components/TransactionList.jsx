import React, { useState, useRef, useEffect, useTransition } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTransactions, deleteTransaction, updateTransaction } from '../redux/transactionSlice';
import { ArrowUpRight, ArrowDownRight, Edit2, Check, X, AlertCircle } from 'lucide-react';

const TransactionItem = ({ transaction, onRemove, onUpdate }) => {
  const [deleteStage, setDeleteStage] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(transaction.text);
  const [editAmount, setEditAmount] = useState(transaction.amount);
  const [warning, setWarning] = useState('');
  const itemRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isEditing && itemRef.current && !itemRef.current.contains(event.target)) {
        handleCancelEdit();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditing, transaction.text, transaction.amount]);

  const handleDeleteClick = () => {
    if (deleteStage !== 0) return;
    
    setDeleteStage(1);
    
    setTimeout(() => {
      setDeleteStage(2);
      
      setTimeout(() => {
        setDeleteStage(3);
        
        setTimeout(() => {
          setDeleteStage(4);
          
          setTimeout(() => {
            onRemove(transaction.id);
          }, 800);
        }, 800);
      }, 800);
    }, 800);
  };

  const getLidClass = () => {
    if (deleteStage === 1 || deleteStage === 2) return '-translate-y-1.5 rotate-12';
    return 'translate-y-0 rotate-0';
  };

  const handleTextChange = (e) => {
    const val = e.target.value;
    const hasNumbers = /[0-9]/.test(val);
    const hasSpecialChars = /[^a-zA-Z0-9\s]/.test(val);
    
    if (hasNumbers && hasSpecialChars) {
      setWarning('Letters only (no numbers or symbols).');
    } else if (hasNumbers) {
      setWarning('Letters only (no numbers).');
    } else if (hasSpecialChars) {
      setWarning('Letters only (no symbols).');
    } else {
      setWarning('');
    }
    setEditText(val);
  };

  const handleSaveEdit = () => {
    if (!editText.trim() || !editAmount || warning) return;
    onUpdate(transaction.id, { text: editText.trim(), amount: parseFloat(editAmount) });
    setIsEditing(false);
    setWarning('');
  };

  const handleCancelEdit = () => {
    setEditText(transaction.text);
    setEditAmount(transaction.amount);
    setIsEditing(false);
    setWarning('');
  };

  return (
    <li 
      ref={itemRef}
      className={`flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 rounded-2xl bg-white/40 dark:bg-black/20 border border-slate-200/50 dark:border-white/5 backdrop-blur-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] transition-all duration-500 ease-out overflow-hidden group/item
        ${deleteStage >= 4 ? 'max-h-0 opacity-0 py-0 mb-0 border-transparent scale-95 !gap-0' : 'max-h-48 sm:max-h-32 opacity-100 mb-4 scale-100 hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:border-slate-300 dark:hover:border-white/10 hover:-translate-y-0.5'}`}
      style={{ contain: 'content' }}
    >
      <div 
        className={`flex items-start space-x-4 w-full sm:w-auto sm:flex-1 min-w-0 transition-all duration-500 transform-gpu ease-out origin-left
          ${deleteStage >= 2 ? '-translate-x-8 opacity-0 scale-95' : 'translate-x-0 opacity-100 scale-100'}`}
      >
        <div className={`p-2.5 rounded-lg shadow-sm flex-shrink-0 ${transaction.type === 'income' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
          {transaction.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
        </div>
        
        {isEditing ? (
          <div className="flex-1 w-full sm:mr-4">
            <input 
              type="text" 
              value={editText} 
              onChange={handleTextChange} 
              className={`w-full bg-slate-50 dark:bg-slate-900/50 border rounded-lg px-4 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none transition duration-300 ${warning ? 'border-danger focus:border-danger focus:ring-0 bg-danger/5 dark:bg-danger/10' : 'border-slate-300 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary/30'}`}
              placeholder="Transaction name"
            />
            <div className={`overflow-hidden transition duration-300 ease-in-out ${warning ? 'max-h-24 opacity-100 mt-1.5' : 'max-h-0 opacity-0 mt-0'}`}>
              <div className="flex items-center gap-1.5 px-1 py-[2px]">
                <span className="flex items-center justify-center shrink-0 w-4 h-4 translate-y-[0.08px] md:translate-y-0">
                  <AlertCircle className="w-full h-full text-danger" strokeWidth={2} />
                </span>
                <p className="m-0 p-0 pt-[1px] pb-[2px] -translate-y-[0.02px] md:-translate-y-[0.37px] lg:-translate-y-[1.1px] text-danger text-[13px] font-semibold leading-none tracking-tight whitespace-nowrap">{warning}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-slate-800 dark:text-slate-100 transition-colors truncate">{transaction.text}</h4>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 transition-colors truncate">
              {new Date(transaction.date).toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric'
              })}
            </p>
          </div>
        )}
      </div>
      
      <div className={`flex items-center justify-between sm:justify-end space-x-3 w-full sm:w-auto sm:ml-2 transition-all duration-500 transform-gpu ease-out flex-shrink-0 ${deleteStage >= 4 ? 'opacity-0 scale-95 translate-x-4' : 'opacity-100 scale-100 translate-x-0'}`}>
        
        {isEditing ? (
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
            <input 
              type="number" 
              step="0.01" 
              value={editAmount} 
              onChange={(e) => setEditAmount(e.target.value)} 
              className="w-28 pl-7 pr-3 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition duration-300"
            />
          </div>
        ) : (
          <span className={`font-bold transition duration-300 text-lg flex items-center transform-gpu ${deleteStage >= 2 ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} ${transaction.type === 'income' ? 'text-success [text-shadow:0_0_8px_rgba(16,185,129,0.4)]' : 'text-danger [text-shadow:0_0_8px_rgba(239,68,68,0.4)]'}`}>
            <span className="mr-1.5">{transaction.type === 'income' ? '+' : '-'}</span>
            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(transaction.amount).replace('₹', '₹ ')}
          </span>
        )}
        
        <div className={`flex space-x-2 transition-opacity duration-300 ${isEditing ? 'opacity-100' : 'opacity-100 lg:opacity-0 lg:group-hover/item:opacity-100'}`}>
          {isEditing ? (
            <>
              <button onClick={handleSaveEdit} disabled={!!warning} className="h-10 w-10 flex items-center justify-center rounded-full bg-success text-white shadow-lg shadow-success/30 hover:scale-110 hover:-translate-y-0.5 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 disabled:shadow-none disabled:hover:scale-100 disabled:hover:translate-y-0 disabled:cursor-not-allowed transition duration-300" title="Save">
                <Check className="w-5 h-5" strokeWidth={2.5} />
              </button>
              <button onClick={handleCancelEdit} className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 hover:scale-110 hover:-translate-y-0.5 transition duration-300" title="Cancel">
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                disabled={deleteStage > 0}
                className="h-10 w-10 flex items-center justify-center rounded-[12px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 transition duration-300 hover:bg-primary/20 hover:text-primary hover:-translate-y-0.5"
                title="Edit Transaction"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={handleDeleteClick}
                disabled={deleteStage > 0}
                className="group/btn relative flex h-10 w-10 items-center justify-center rounded-[12px] bg-danger text-white transition duration-300 shadow-sm hover:shadow-danger/50 hover:-translate-y-0.5 disabled:cursor-default"
                title="Delete Transaction"
              >
                <svg className="w-5 h-5 transition-transform transform-gpu duration-400 group-hover/btn:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path className={`transition-all duration-400 transform-gpu origin-bottom-right ${getLidClass()}`} strokeLinecap="round" strokeLinejoin="round" d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m4 0H4" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  );
};

const TransactionList = () => {
  const transactions = useSelector(selectTransactions);
  const dispatch = useDispatch();
  
  const [visibleCount, setVisibleCount] = useState(30);
  const observerRef = useRef(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startTransition(() => {
            setVisibleCount((prevCount) => Math.min(prevCount + 30, transactions.length));
          });
        }
      },
      { threshold: 0.1, rootMargin: '800px' }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [transactions.length, visibleCount]);

  const handleRemove = (id) => {
    dispatch(deleteTransaction(id));
  };

  const handleUpdate = (id, changes) => {
    dispatch(updateTransaction({ id, changes }));
  };

  const startIndex = Math.max(0, transactions.length - visibleCount);
  const visibleTransactions = transactions.slice(startIndex);

  return (
    <section aria-labelledby="transaction-list-heading" className="glass-card p-6 h-full flex flex-col">
      <h2 id="transaction-list-heading" className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-100 transition-colors">Recent Transactions</h2>
      
      <div className="flex-1 overflow-y-auto pr-2 no-scrollbar">
        {transactions.length === 0 ? (
          <div className="text-center text-slate-500 dark:text-slate-400 py-10 transition-colors">
            <p>No transactions yet.</p>
            <p className="text-sm mt-1">Add one to get started!</p>
          </div>
        ) : (
          <ul role="list" className="flex flex-col-reverse m-0 p-0 list-none">
            {visibleCount < transactions.length && (
              <div ref={observerRef} className="h-1 w-full shrink-0 pointer-events-none" aria-hidden="true"></div>
            )}
            {isPending && (
              <div className="w-full shrink-0 flex flex-col items-center justify-center py-8 space-y-3">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-10 h-10 rounded-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-20 bg-primary transform-gpu will-change-transform"></div>
                  <svg className="relative w-8 h-8 animate-spin text-primary transform-gpu will-change-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                    <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                </div>
                <span className="text-[10px] font-bold text-primary tracking-widest uppercase animate-pulse opacity-80 transform-gpu will-change-[opacity]">Loading</span>
              </div>
            )}
            {visibleTransactions.map((transaction) => (
              <TransactionItem 
                key={transaction.id} 
                transaction={transaction} 
                onRemove={handleRemove} 
                onUpdate={handleUpdate}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default TransactionList;
