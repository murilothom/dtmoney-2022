import { createContext, ReactNode, useEffect, useState } from 'react';
import { api } from '../lib/axios';

interface ITransaction {
  id: number;
  description: string;
  type: 'income' | 'outcome';
  price: number;
  category: string;
  createdAt: string;
}

interface ITransactionContextType {
  transactions: ITransaction[];
  fetchTransactions: (query?: string) => Promise<void>;
}

export const TransactionsContext = createContext({} as ITransactionContextType);

interface ITransactionsProviderProps {
  children: ReactNode;
}

export function TransactionsProvider({ children }: ITransactionsProviderProps) {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);

  async function fetchTransactions(query?: string) {
    const response = await api
      .get('transactions', {
        params: {
          q: query,
        },
      })
      .then((x) => x.data);

    setTransactions(response);
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <TransactionsContext.Provider value={{ transactions, fetchTransactions }}>
      {children}
    </TransactionsContext.Provider>
  );
}
