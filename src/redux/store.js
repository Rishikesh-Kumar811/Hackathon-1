import { configureStore } from '@reduxjs/toolkit';
import transactionsReducer from './transactionSlice';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('fintrack_transactions');
    if (serializedState === null) {
      return undefined;
    }
    return { transactions: { items: JSON.parse(serializedState) } };
  } catch (err) {
    console.error("Could not load state", err);
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state.transactions.items);
    localStorage.setItem('fintrack_transactions', serializedState);
  } catch (err) {
    console.error("Could not save state", err);
  }
};

export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
  },
  preloadedState: loadState(),
});

// Subscribe to store changes to automatically save to localStorage
// We can use a debounce here in a massive app, but for this it's fine
store.subscribe(() => {
  saveState(store.getState());
});
