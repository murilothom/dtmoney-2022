import { createContext, ReactNode, useEffect, useState } from "react";

interface ITransaction {
  id: number
  description: string
  type: 'income' | 'outcome'
  price: number
  category: string
  createdAt: string
}

interface ITransactionContextType {
  transactions: ITransaction[]
}

export const TransactionsContext = createContext({} as ITransactionContextType)

interface ITransactionsProviderProps {
  children: ReactNode
}

export function TransactionsProvider({ children }: ITransactionsProviderProps) {
  const [transactions, setTransactions] = useState<ITransaction[]>([])

  async function loadTransactions () {
    const response = await fetch("http://localhost:3000/transactions")
    const data = await response.json()
    setTransactions(data)
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  return (
    <TransactionsContext.Provider value={{ transactions }}>
      {children}
    </TransactionsContext.Provider>
  )
}