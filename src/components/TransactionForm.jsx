import React, { useState, useRef, useTransition } from 'react';
import { useDispatch } from 'react-redux';
import { addTransaction } from '../redux/transactionSlice';
import { PlusCircle } from 'lucide-react';
import { validateTransactionTitle } from '../utils/validation';
import InputField from './ui/InputField';

const TransactionForm = () => {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('');
  const [warning, setWarning] = useState('');
  
  const titleInputRef = useRef(null);
  const amountInputRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  
  const dispatch = useDispatch();

  const handleTextChange = (e) => {
    const val = e.target.value;
    setWarning(validateTransactionTitle(val));
    setText(val);
  };

  const submitForm = () => {
    if (!text.trim() || !amount || !type || warning || isPending) return;

    startTransition(() => {
      dispatch(addTransaction({
        text: text.trim(),
        amount: parseFloat(amount),
        type
      }));
      setText('');
      setAmount('');
      setType('');
      setWarning('');
    });
    
    
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    submitForm();
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (!text.trim() || warning) {
        return;
      }
      
      if (!amount) {
        amountInputRef.current?.focus();
        return;
      }
      
      if (!type) {
        amountInputRef.current?.focus();
        return;
      }
      
      submitForm();
    }
  };

  const handleAmountKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (!text.trim() || warning) {
        titleInputRef.current?.focus();
        return;
      }
      
      if (!amount) {
        return;
      }
      
      if (!type) {

        return; 
      }
      
      submitForm();
    }
  };

  return (
    <section aria-labelledby="transaction-form-heading" className="glass-card p-6 flex flex-col">
      <div>
        <h2 id="transaction-form-heading" className="text-xl lg:text-lg xl:text-fluid-xl whitespace-nowrap font-bold mb-6 flex items-center text-slate-800 dark:text-slate-100 transition-colors">
          <PlusCircle aria-hidden="true" className="mr-2 text-primary w-5 h-5 lg:w-6 lg:h-6" />
          Add New Transaction
        </h2>
        <form id="transaction-form" onSubmit={onSubmit} className="space-y-4">
          <InputField
            id="transaction-title"
            label="Transaction Title"
            labelClassName="text-fluid-sm"
            ref={titleInputRef}
            type="text"
            maxLength={25}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleTitleKeyDown}
            placeholder="e.g. Salary, Groceries..."
            required
            error={warning}
          />
          
          <InputField
            id="transaction-amount"
            label="Amount (₹)"
            labelClassName="text-sm"
            type="number"
            step="0.01"
            ref={amountInputRef}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={handleAmountKeyDown}
            placeholder="0.00"
            required
          />

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
        <button form="transaction-form" type="submit" disabled={!text.trim() || !amount || !type || !!warning || isPending} className={`btn-primary inline-flex items-center justify-center gap-2 group w-full sm:w-auto text-[15px] sm:text-[16px] tracking-wide transform-gpu ${isPending ? 'opacity-70 cursor-not-allowed' : ''}`}>
          <span>{isPending ? 'Saving...' : 'Save Transaction'}</span>
          <PlusCircle className={`w-5 h-5 flex-shrink-0 transition-transform duration-500 transform-gpu ${isPending ? 'animate-spin' : 'group-hover:rotate-180'}`} />
        </button>
      </div>
    </section>
  );
};

export default TransactionForm;

