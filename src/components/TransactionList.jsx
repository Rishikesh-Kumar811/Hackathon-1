import React, { useState, useRef, useEffect } from 'react';
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
        setDeleteStage(4);
        
        setTimeout(() => {
          onRemove(transaction.id);
        }, 500);
      }, 600);
    }, 500);
  };

  const getLidClass = () => {
    if (deleteStage === 1 || deleteStage === 2) return '-translate-y-1.5 rotate-12';
    if (deleteStage >= 3) return 'translate-y-0 rotate-0';
    return 'group-hover/btn:-translate-y-1.5 group-hover/btn:rotate-12';
  };

  const handleTextChange = (e) => {
    const val = e.target.value;
    const hasNumbers = /[0-9]/.test(val);
    const hasSpecialChars = /[^a-zA-Z0-9\s]/.test(val);
    
    if (hasNumbers && hasSpecialChars) {
      setWarning('Letters only. No numbers and special characters.');
    } else if (hasNumbers) {
      setWarning('Letters only. No numbers.');
    } else if (hasSpecialChars) {
      setWarning('Letters only. No special characters.');
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
    <div 
      ref={itemRef}
      className={`flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/50 shadow-sm transition-all duration-500 ease-out overflow-hidden group/item
        ${deleteStage >= 4 ? 'max-h-0 opacity-0 py-0 mb-0 border-transparent scale-95 !gap-0' : 'max-h-48 sm:max-h-32 opacity-100 mb-4 scale-100 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-600'}`}
    >
      <div 
        className={`flex items-start space-x-4 w-full sm:w-auto sm:flex-1 min-w-0 transition-all duration-500 transform ease-out origin-left
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
              className={`w-full bg-slate-50 dark:bg-slate-900/50 border rounded-lg px-4 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none transition-all duration-300 ${warning ? 'border-danger focus:border-danger focus:ring-0 bg-danger/5 dark:bg-danger/10' : 'border-slate-300 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary/30'}`}
              placeholder="Transaction name"
            />
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${warning ? 'max-h-24 opacity-100 mt-1.5' : 'max-h-0 opacity-0 mt-0'}`}>
              <div className="flex items-start gap-1.5 px-1">
                <div className="flex items-center h-[18px] flex-shrink-0">
                  <AlertCircle className="w-3.5 h-3.5 text-danger mt-[0.2px] md:mt-[1px]" strokeWidth={2.5} />
                </div>
                <p className="text-danger text-[12px] font-semibold leading-[18px]">{warning}</p>
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
      
      <div className={`flex items-center justify-between sm:justify-end space-x-3 w-full sm:w-auto sm:ml-2 transition-all duration-500 ease-out flex-shrink-0 ${deleteStage >= 3 ? 'opacity-0 scale-95 translate-x-4' : 'opacity-100 scale-100 translate-x-0'}`}>
        
        {isEditing ? (
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">$</span>
            <input 
              type="number" 
              step="0.01" 
              value={editAmount} 
              onChange={(e) => setEditAmount(e.target.value)} 
              className="w-28 pl-7 pr-3 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-300"
            />
          </div>
        ) : (
          <span className={`font-bold transition-all duration-300 ${deleteStage >= 2 ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} ${transaction.type === 'income' ? 'text-success' : 'text-danger'}`}>
            {transaction.type === 'income' ? '+' : '-'}{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(transaction.amount)}
          </span>
        )}
        
        <div className={`flex space-x-2 transition-opacity duration-300 ${isEditing ? 'opacity-100' : 'opacity-100 lg:opacity-0 lg:group-hover/item:opacity-100'}`}>
          {isEditing ? (
            <>
              <button onClick={handleSaveEdit} disabled={!!warning} className="h-10 w-10 flex items-center justify-center rounded-full bg-success text-white shadow-lg shadow-success/30 hover:scale-110 hover:-translate-y-0.5 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 disabled:shadow-none disabled:hover:scale-100 disabled:hover:translate-y-0 disabled:cursor-not-allowed transition-all duration-300" title="Save">
                <Check className="w-5 h-5" strokeWidth={2.5} />
              </button>
              <button onClick={handleCancelEdit} className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 hover:scale-110 hover:-translate-y-0.5 transition-all duration-300" title="Cancel">
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                disabled={deleteStage > 0}
                className="h-10 w-10 flex items-center justify-center rounded-[12px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all duration-300 hover:bg-primary/20 hover:text-primary hover:-translate-y-0.5"
                title="Edit Transaction"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={handleDeleteClick}
                disabled={deleteStage > 0}
                className="group/btn relative flex h-10 w-10 items-center justify-center rounded-[12px] bg-danger text-white transition-all duration-300 shadow-sm hover:shadow-danger/50 hover:-translate-y-0.5 disabled:cursor-default"
                title="Delete Transaction"
              >
                <svg className="w-5 h-5 transition-transform duration-400 group-hover/btn:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path className={`transition-all duration-400 transform origin-bottom-right ${getLidClass()}`} strokeLinecap="round" strokeLinejoin="round" d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m4 0H4" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const TransactionList = () => {
  const transactions = useSelector(selectTransactions);
  const dispatch = useDispatch();

  const handleRemove = (id) => {
    dispatch(deleteTransaction(id));
  };

  const handleUpdate = (id, changes) => {
    dispatch(updateTransaction({ id, changes }));
  };

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-100 transition-colors">Recent Transactions</h3>
      
      <div className="flex-1 overflow-y-auto pr-2 no-scrollbar">
        {transactions.length === 0 ? (
          <div className="text-center text-slate-500 dark:text-slate-400 py-10 transition-colors">
            <p>No transactions yet.</p>
            <p className="text-sm mt-1">Add one to get started!</p>
          </div>
        ) : (
          <div className="flex flex-col-reverse">
            {transactions.map((transaction) => (
              <TransactionItem 
                key={transaction.id} 
                transaction={transaction} 
                onRemove={handleRemove} 
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
