import { createSlice, createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const transactionsAdapter = createEntityAdapter({

  sortComparer: (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
});

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: transactionsAdapter.getInitialState(),
  reducers: {
    addTransaction: {
      reducer: transactionsAdapter.addOne,
      prepare: (payload) => {
        return {
          payload: {
            id: uuidv4(),
            ...payload,
            date: new Date().toISOString(),
          }
        };
      }
    },
    deleteTransaction: transactionsAdapter.removeOne,
    updateTransaction: transactionsAdapter.updateOne,
  },
});

export const { addTransaction, deleteTransaction, updateTransaction } = transactionsSlice.actions;

export const {
  selectAll: selectTransactions,
  selectById: selectTransactionById,
} = transactionsAdapter.getSelectors((state) => state.transactions);

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

