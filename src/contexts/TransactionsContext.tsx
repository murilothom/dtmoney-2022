import { createContext, ReactNode, useEffect, useState } from 'react'
import { api } from '../lib/axios'

interface ITransaction {
  id: number
  description: string
  type: 'income' | 'outcome'
  price: number
  category: string
  createdAt: string
}

interface CreateTransactionInput {
  description: string
  price: number
  category: string
  type: 'income' | 'outcome'
}

interface ITransactionContextType {
  transactions: ITransaction[]
  fetchTransactions: (query?: string) => Promise<void>
  createTransaction: (data: CreateTransactionInput) => Promise<void>
}

export const TransactionsContext = createContext({} as ITransactionContextType)

interface ITransactionsProviderProps {
  children: ReactNode
}

export function TransactionsProvider({ children }: ITransactionsProviderProps) {
  const [transactions, setTransactions] = useState<ITransaction[]>([])

  async function fetchTransactions(query?: string) {
    const response = await api
      .get('transactions', {
        params: {
          _sort: 'createdAt',
          _order: 'desc',
          q: query,
        },
      })
      .then((x) => x.data)

    setTransactions(response)
  }

  async function createTransaction(data: CreateTransactionInput) {
    const { category, description, price, type } = data

    const response = await api
      .post('transactions', {
        category,
        description,
        price,
        type,
        createdAt: new Date(),
      })
      .then((x) => x.data)

    setTransactions((state) => [response, ...state])
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  return (
    <TransactionsContext.Provider
      value={{ transactions, fetchTransactions, createTransaction }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}
