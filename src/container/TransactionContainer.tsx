"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Transaction } from "@/types/transaction";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface TransactionContainerType {
  transactions: Transaction[];
  loading: boolean;
  category: string;
  from: string;
  to: string;
  setCategory: (v: string) => void;
  setFrom: (v: string) => void;
  setTo: (v: string) => void;
  fetchTransactions: () => Promise<void>;
  addTransaction: (t: Transaction) => Promise<void>;
  updateTransaction: (t: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  clearFilters: () => void;
}

const TransactionContext = createContext<TransactionContainerType | null>(null);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) router.push("/login");
  }, [session, router]);

  const fetchTransactions = async () => {
    if (!session) return;

    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (from) params.append("from", from);
      if (to) params.append("to", to);

      const res = await fetch(`/api/transactions?${params.toString()}`);
      if (res.status === 401) {
        router.push("/login");
      }
      const data = await res.json();

      setTransactions(data.transactions ?? []);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch when filters change
  useEffect(() => {
    fetchTransactions();
  }, [category, from, to, session]);

  // CRUD APIs inside the container
  const addTransaction = async (t: Transaction) => {
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(t),
      });
      if (res.status === 401) {
        router.push("/login");
      }
      if (!res.ok) throw new Error("Failed to add transaction");
      const data = await res.json();
      setTransactions((prev) => [data.transaction, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const updateTransaction = async (t: Transaction) => {
    try {
      const res = await fetch(`/api/transactions/${t.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(t),
      });
      if (res.status === 401) {
        router.push("/login");
      }
      if (!res.ok) throw new Error("Failed to update transaction");
      const data = await res.json();
      setTransactions((prev) =>
        prev.map((tx) => (tx.id === t.id ? data.transaction : tx)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      if (res.status === 401) {
        router.push("/login");
      }
      if (!res.ok) throw new Error("Failed to delete transaction");
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const clearFilters = () => {
    setCategory("");
    setFrom("");
    setTo("");
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loading,
        category,
        from,
        to,
        setCategory,
        setFrom,
        setTo,
        fetchTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        clearFilters,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactionContainer() {
  const ctx = useContext(TransactionContext);
  if (!ctx) {
    throw new Error(
      "useTransactionContainer must be used inside TransactionProvider",
    );
  }
  return ctx;
}
