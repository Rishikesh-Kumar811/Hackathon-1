import React, { useState, useRef, useEffect, startTransition } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTransactions, deleteTransaction, updateTransaction } from '../redux/transactionSlice';
import { Edit2, Check, X, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import AnimatedDeleteButton from './AnimatedDeleteButton';
import { useVirtualizer } from '@tanstack/react-virtual';
import { validateTransactionTitle } from '../utils/validation';

const TransactionItem = React.memo(({ transaction, onRemove, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editAmount, setEditAmount] = useState(transaction.amount);
  const [editText, setEditText] = useState(transaction.text);
  
  const [deleteStage, setDeleteStage] = useState(0);
  
  const [warning, setWarning] = useState('');
  const itemRef = useRef(null);
  const btnRef = useRef(null);
  const charRefs = useRef([]);
  const [letterDists, setLetterDists] = useState([]);

  const baseFlightTime = 850;
  const trimmedLength = Math.max(1, transaction.text.trim().length);
  const charStagger = Math.min(20, 300 / trimmedLength); 
  const totalFlightTime = baseFlightTime + (trimmedLength * charStagger);

  useEffect(() => {
    setEditAmount(transaction.amount);
    setEditText(transaction.text);
  }, [transaction.amount, transaction.text, isEditing]);

  const handleSaveEdit = () => {
    const parsedAmount = parseFloat(editAmount);
    if (!isNaN(parsedAmount) && parsedAmount > 0 && editText.trim().length > 0) {
      onUpdate(transaction.id, { amount: parsedAmount, text: editText.trim() });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditAmount(transaction.amount);
    setEditText(transaction.text);
    setWarning('');
    setIsEditing(false);
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setEditText(newText);
    setWarning(validateTransactionTitle(newText));
  };

  const handleDeleteClick = () => {
    if (deleteStage !== 0) return;
    
    if (btnRef.current) {
      const btnRect = btnRef.current.getBoundingClientRect();
      const targetX = btnRect.left + (btnRect.width * 0.5) + 6; 
      const targetY = btnRect.top + (btnRect.height * 0.45);
      
      const dists = charRefs.current.map(el => {
        if (!el) return { x: 0, y: 0 };
        const rect = el.getBoundingClientRect();
        return {
          x: targetX - rect.left - (rect.width / 2),
          y: targetY - rect.top - (rect.height / 2)
        };
      });
      setLetterDists(dists);
    }
    
    setDeleteStage(1);
    
    setTimeout(() => {
      setDeleteStage(2);
    }, 450); 
    
    setTimeout(() => {
      setDeleteStage(3);
    }, 450 + totalFlightTime + 350); 
    
    setTimeout(() => {
      setDeleteStage(4);
    }, 450 + totalFlightTime + 350 + 1000); 
    
    setTimeout(() => {
      onRemove(transaction.id);
    }, 450 + totalFlightTime + 350 + 1000 + 750);
  };

  return (
    <div 
      ref={itemRef}
      className={`group/item flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 mb-2 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-700 ease-out transform-gpu overflow-hidden
        ${deleteStage >= 4 ? 'opacity-0 scale-95 blur-md h-0 mb-0 py-0 border-transparent shadow-none' : 'opacity-100 scale-100 blur-0'}`}
    >
      <style>
        {`
          @keyframes projectileX {
            0% { transform: translateX(0); opacity: 1; }
            100% { transform: translateX(var(--target-x)); opacity: 0; }
          }
          @keyframes projectileY {
            0% { transform: translateY(0) scale(1) rotate(0deg); }
            40% { transform: translateY(-80px) scale(1.2) rotate(180deg); } 
            100% { transform: translateY(var(--target-y)) scale(0) rotate(720deg); }
          }
          
          .animate-proj-x {
            animation: projectileX 0.8s linear forwards;
          }
          .animate-proj-y {
            animation: projectileY 0.8s cubic-bezier(0.5, -0.2, 0.8, 1) forwards;
          }
        `}
      </style>
      <div 
        className={`flex items-start space-x-4 w-full sm:w-auto sm:flex-1 min-w-0 transition-all duration-500 transform-gpu ease-out origin-left`}
      >
        <div className={`p-2.5 rounded-lg shadow-sm flex-shrink-0 transition-all duration-500 ease-out transform-gpu ${deleteStage >= 2 ? 'opacity-0 -translate-x-4 blur-sm scale-95' : 'opacity-100 translate-x-0 blur-0 scale-100'} ${transaction.type === 'income' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
          {transaction.type === 'income' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
        </div>
        
        {isEditing ? (
          <div className="flex-1 min-w-0 pr-4">
            <div className="relative">
                <input 
                  type="text" 
                  value={editText} 
                  onChange={handleTextChange}
                  maxLength={25}
                  className={`w-full bg-slate-50 dark:bg-slate-900/50 border ${warning ? 'border-danger focus:ring-danger/30' : 'border-slate-300 dark:border-slate-700 focus:ring-primary/30'} rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary focus:ring-1 transition duration-300`}
                />
                <p className="text-danger/90 text-[clamp(10.5px,2.5vw,13px)] font-medium tracking-wide px-1 pb-1 whitespace-nowrap leading-normal" title={warning}>{warning}</p>
            </div>
          </div>
        ) : (
          <div className="min-w-0 flex-1">
            <h4 className={`font-semibold text-slate-800 dark:text-slate-100 transition-colors whitespace-nowrap flex ${deleteStage >= 2 ? 'overflow-visible z-50 relative' : 'overflow-hidden text-ellipsis'}`}>
              {transaction.text.split('').map((char, index) => {
                const dist = letterDists[index] || { x: 0, y: 0 };
                return (
                  <span 
                    key={index} 
                    className={`inline-block transform-gpu ${deleteStage >= 2 ? 'animate-proj-x' : ''}`}
                    style={{ 
                      '--target-x': `${dist.x}px`,
                      animationDelay: deleteStage >= 2 ? `${index * charStagger}ms` : '0ms',
                      opacity: deleteStage >= 2 ? 0 : 1
                    }}
                  >
                    <span 
                      ref={el => charRefs.current[index] = el}
                      className={`inline-block transform-gpu ${deleteStage >= 2 ? 'animate-proj-y origin-center' : ''}`}
                      style={{ 
                        '--target-y': `${dist.y}px`,
                        animationDelay: deleteStage >= 2 ? `${index * charStagger}ms` : '0ms',
                        whiteSpace: 'pre'
                      }}
                    >
                      {char}
                    </span>
                  </span>
                );
              })}
            </h4>
            <p className={`text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 transition-all duration-500 ease-out transform-gpu truncate ${deleteStage >= 2 ? 'opacity-0 -translate-x-4 blur-sm scale-95' : 'opacity-100 translate-x-0 blur-0 scale-100'}`}>
              {new Date(transaction.date).toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric'
              })}
            </p>
          </div>
        )}
      </div>
      
      <div className={`flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto sm:ml-2 transition-all duration-500 transform-gpu ease-out flex-shrink-0 ${deleteStage >= 4 ? 'opacity-0 scale-95 translate-x-4' : 'opacity-100 scale-100 translate-x-0'}`}>
        
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
          <span className={`font-bold transition duration-300 text-[clamp(15px,4vw,18px)] flex items-center min-w-0 flex-1 sm:flex-none transform-gpu ${deleteStage >= 2 ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} ${transaction.type === 'income' ? 'text-success [text-shadow:0_0_8px_rgba(16,185,129,0.4)]' : 'text-danger [text-shadow:0_0_8px_rgba(239,68,68,0.4)]'}`}>
            <span className="mr-1.5 flex-shrink-0">{transaction.type === 'income' ? '+' : '-'}</span>
            <span className="truncate">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(transaction.amount).replace('₹', '₹ ')}
            </span>
          </span>
        )}
        
        <div className={`flex gap-2 flex-shrink-0 transition-opacity duration-300 ${isEditing ? 'opacity-100' : 'opacity-100 lg:opacity-0 lg:group-hover/item:opacity-100'}`}>
          {isEditing ? (
            <>
              <button onClick={handleSaveEdit} disabled={!!warning} className="action-btn action-btn-success" title="Save">
                <Check className="w-5 h-5" strokeWidth={2.5} />
              </button>
              <button onClick={handleCancelEdit} className="action-btn action-btn-cancel" title="Cancel">
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                disabled={deleteStage > 0}
                className="action-btn action-btn-edit"
                title="Edit Transaction"
              >
                <Edit2 className="w-4 h-4" strokeWidth={2.5} style={{ shapeRendering: 'geometricPrecision' }} />
              </button>
              <div ref={btnRef} className="flex-shrink-0">
                <AnimatedDeleteButton deleteStage={deleteStage} onClick={handleDeleteClick} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

const TransactionList = () => {
  const transactions = useSelector(selectTransactions);
  const dispatch = useDispatch();
  
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: transactions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 92,
    overscan: 10,
    getItemKey: React.useCallback((index) => transactions[index]?.id || index, [transactions]),
  });

  const handleRemove = React.useCallback((id) => {
    startTransition(() => {
      dispatch(deleteTransaction(id));
    });
  }, [dispatch]);

  const handleUpdate = React.useCallback((id, changes) => {
    startTransition(() => {
      dispatch(updateTransaction({ id, changes }));
    });
  }, [dispatch]);

  return (
    <section aria-labelledby="transaction-list-heading" className="glass-card p-6 h-[clamp(400px,80vh,550px)] flex flex-col">
      <h2 id="transaction-list-heading" className="text-fluid-xl font-bold mb-6 text-slate-800 dark:text-slate-100 transition-colors">Recent Transactions</h2>
      
      <div 
        ref={parentRef}
        className="flex-1 overflow-y-auto pr-2 touch-pan-y [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400"
      >
        {transactions.length === 0 ? (
          <div className="text-center text-slate-500 dark:text-slate-400 py-10 transition-colors">
            <p className="text-fluid-base">No transactions yet.</p>
            <p className="text-fluid-sm mt-1">Add one to get started!</p>
          </div>
        ) : (
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const transaction = transactions[virtualRow.index];
              return (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={rowVirtualizer.measureElement}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                    paddingTop: '4px',
                    paddingBottom: '4px'
                  }}
                >
                  <div className="scroll-driven-item w-full">
                    <TransactionItem 
                      transaction={transaction} 
                      onRemove={handleRemove} 
                      onUpdate={handleUpdate}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default TransactionList;
