"use client";

import { Transaction } from "@/types/transaction";
import { Calendar, DollarSign, MoreVertical, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import TransactionForm from "./TransactionForm";

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch transactions on mount
  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch("/api/transactions");
        if (!res.ok) throw new Error("Failed to fetch transactions");
        const data = await res.json();
        setTransactions(data.transactions ?? []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchTransactions();
  }, []);

  // Function to add new transaction to state
  const handleAddTransaction = (newTransaction: Transaction) => {
    setTransactions((prev) => [newTransaction, ...prev]);
    setModalOpen(false);
  };

  return (
    <div className="rounded-3xl shadow-sm p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Transactions</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
        >
          + Add Transaction
        </button>
      </div>

      {/* Transaction List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {transactions.length > 0 ? (
          transactions.map((transaction, idx) => (
            <div
              key={transaction.id} // use transaction.id instead of idx
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      transaction.type === "income"
                        ? "bg-emerald-100"
                        : "bg-rose-100"
                    }`}
                  >
                    <DollarSign
                      className={`w-6 h-6 ${
                        transaction.type === "income"
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {transaction.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" />
                        {transaction.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {transaction.date}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p
                      className={`text-lg font-bold ${
                        transaction.type === "income"
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {transaction.type === "expense" ? "-" : ""}
                      {transaction.amount}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {transaction.type === "expense" ? "Expense" : "Income"}
                    </p>
                  </div>

                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Add Transaction"
        >
          <TransactionForm onSubmit={handleAddTransaction} />
        </Modal>
      )}
    </div>
  );
}
