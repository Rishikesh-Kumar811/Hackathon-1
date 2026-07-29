import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTransaction } from '../redux/transactionSlice';
import { PlusCircle, AlertCircle } from 'lucide-react';

const TransactionForm = () => {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('');
  const [warning, setWarning] = useState('');
  
  const dispatch = useDispatch();

  const getValidationWarning = (val) => {
    if (!val) return '';
    const hasNumbers = /[0-9]/.test(val);
    const hasSpecialChars = /[^a-zA-Z0-9\s]/.test(val);
    
    if (hasNumbers && hasSpecialChars) {
      return 'Letters only (no numbers or symbols).';
    } else if (hasNumbers) {
      return 'Letters only (no numbers).';
    } else if (hasSpecialChars) {
      return 'Letters only (no symbols).';
    }
    return '';
  };

  const handleTextChange = (e) => {
    const val = e.target.value;
    setWarning(getValidationWarning(val));
    setText(val);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!text || !amount || !type || warning) return;

    dispatch(addTransaction({
      text: text.trim(),
      amount: parseFloat(amount),
      type
    }));

    setText('');
    setAmount('');
    setWarning('');
  };

  return (
    <div className="glass-card p-6 flex flex-col">
      <div>
        <h3 className="text-xl font-bold mb-6 flex items-center text-slate-800 dark:text-slate-100 transition-colors">
          <PlusCircle className="mr-2 text-primary w-6 h-6" />
          Add New Transaction
        </h3>
        <form id="transaction-form" onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 transition-colors">Transaction Title</label>
            <input
              id="transaction-title"
              type="text"
              className={`input-field ${warning ? 'border-danger focus:border-danger focus:ring-0 bg-danger/5 dark:bg-danger/10' : ''}`}
              value={text}
              onChange={handleTextChange}
              placeholder="e.g. Salary, Groceries..."
              required
              aria-invalid={warning ? 'true' : 'false'}
              aria-describedby={warning ? "transaction-title-error" : undefined}
            />
            <div id="transaction-title-error" role="alert" className={`overflow-hidden transition-all duration-300 ease-in-out ${warning ? 'max-h-24 mt-2 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="flex items-center gap-1.5 px-1">
                <span className="flex items-center justify-center shrink-0 w-4 h-4">
                  <AlertCircle className="w-full h-full text-danger" strokeWidth={2} />
                </span>
                <p className="m-0 p-0 pt-[1px] pb-[2px] text-danger text-[13px] font-semibold leading-none tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">{warning}</p>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 transition-colors">Amount (₹)</label>
            <input
              type="number"
              step="0.01"
              className="input-field"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 transition-colors">Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className={`py-2.5 rounded-xl font-medium focus:outline-none focus:ring-0 transition duration-300 cursor-pointer ${type === 'income' ? 'bg-success/10 text-success border border-success/30 shadow-[0_2px_10px_-3px_rgba(16,185,129,0.3)] scale-[1.02]' : 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                onClick={() => setType(type === 'income' ? '' : 'income')}
              >
                Income
              </button>
              <button
                type="button"
                className={`py-2.5 rounded-xl font-medium focus:outline-none focus:ring-0 transition duration-300 cursor-pointer ${type === 'expense' ? 'bg-danger/10 text-danger border border-danger/30 shadow-[0_2px_10px_-3px_rgba(239,68,68,0.3)] scale-[1.02]' : 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                onClick={() => setType(type === 'expense' ? '' : 'expense')}
              >
                Expense
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="mt-8 flex justify-end">
        <button form="transaction-form" type="submit" disabled={!text.trim() || !amount || !type || !!warning} className="btn-primary inline-flex items-center justify-center gap-2 group w-full sm:w-auto text-[15px] sm:text-[16px] tracking-wide">
          <span>Save Transaction</span>
          <PlusCircle className="w-5 h-5 transition-transform duration-500 group-hover:rotate-180 flex-shrink-0" />
        </button>
      </div>
    </div>
  );
};

export default TransactionForm;
