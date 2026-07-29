import { createSlice, createSelector } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  items: [],
};

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action) => {
      state.items.push({
        id: uuidv4(),
        ...action.payload,
        date: new Date().toISOString(),
      });
    },
    deleteTransaction: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateTransaction: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.changes };
      }
    },
  },
});
export const { addTransaction, deleteTransaction, updateTransaction } = transactionsSlice.actions;

export const selectTransactions = (state) => state.transactions.items;

export const selectTotals = createSelector(
  [selectTransactions],
  (items) => {
    return items.reduce(
      (acc, transaction) => {
        const amount = parseFloat(transaction.amount);
        if (transaction.type === 'income') {
          acc.income += amount;
          acc.balance += amount;
        } else {
          acc.expense += amount;
          acc.balance -= amount;
        }
        return acc;
      },
      { income: 0, expense: 0, balance: 0 }
    );
  }
);

export default transactionsSlice.reducer;
