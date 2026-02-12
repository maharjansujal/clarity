"use client";

import { Transaction } from "@/types/transaction";
import { Calendar, DollarSign, Loader2, MoreVertical, Tag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import TransactionForm, {
  expenseCategories,
  incomeCategories,
} from "./TransactionForm";
import {
  TransactionProvider,
  useTransactionContainer,
} from "@/container/TransactionContainer";

function Content() {
  const {
    transactions,
    loading,
    category,
    setCategory,
    from,
    setFrom,
    to,
    setTo,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearFilters,
  } = useTransactionContainer();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close menu if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle saving (add/update)
  async function handleSaveTransaction(transaction: Transaction) {
    if (editingTransaction) {
      await updateTransaction(transaction);
    } else {
      await addTransaction(transaction);
    }
    setModalOpen(false);
    setEditingTransaction(null);
  }

  // Handle delete
  async function handleDeleteTransaction(transaction: Transaction) {
    await deleteTransaction(transaction.id);
  }

  return (
    <div className="rounded-3xl shadow-sm p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Transactions</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition cursor-pointer"
        >
          + Add Transaction
        </button>
      </div>
      {/* Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
        {/* Category */}
        <div className="flex flex-col w-full md:w-auto">
          <label className="mb-1 text-sm text-gray-600 dark:text-gray-400">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-3 rounded-xl
        border border-gray-300 dark:border-gray-600
        bg-white dark:bg-gray-800
        text-gray-900 dark:text-gray-100
        focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {expenseCategories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
            {incomeCategories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* From Date */}
        <div className="flex flex-col w-full md:w-auto">
          <label className="mb-1 text-sm text-gray-600 dark:text-gray-400">
            From
          </label>
          <input
            type="date"
            value={from}
            min={from || undefined}
            onChange={(e) => setFrom(e.target.value)}
            className="px-4 py-3 rounded-xl
        border border-gray-300 dark:border-gray-600
        bg-white dark:bg-gray-800
        text-gray-900 dark:text-gray-100
        focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* To Date */}
        <div className="flex flex-col w-full md:w-auto">
          <label className="mb-1 text-sm text-gray-600 dark:text-gray-400">
            To
          </label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            max={to || undefined}
            className="px-4 py-3 rounded-xl
        border border-gray-300 dark:border-gray-600
        bg-white dark:bg-gray-800
        text-gray-900 dark:text-gray-100
        focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          disabled={!from && !to && !category}
          className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600
             disabled:cursor-not-allowed disabled:opacity-50"
          onClick={clearFilters}
        >
          Clear
        </button>
      </div>

      {/* Transaction List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {loading ? (
          <div className="py-10 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mb-2" />
            <p className="text-sm">Loading transactions...</p>
          </div>
        ) : transactions.length > 0 ? (
          (transactions || []).map((transaction) => (
            <div
              key={transaction.id}
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
                        {transaction.date ? transaction.date.split("T")[0] : ""}
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

                  {/* Menu Button */}
                  <div className="relative">
                    <button
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(
                          openMenuId === transaction.id ? null : transaction.id,
                        );
                      }}
                    >
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>

                    {openMenuId === transaction.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 mt-2 w-24 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md z-10"
                      >
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() => {
                            setEditingTransaction(transaction);
                            setModalOpen(true);
                            setOpenMenuId(null);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() => {
                            handleDeleteTransaction(transaction);
                            setOpenMenuId(null);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 text-center text-gray-500 dark:text-gray-400">
            No transactions found
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingTransaction ? "Edit Transaction" : "Add Transaction"}
        >
          <TransactionForm
            editingTransaction={editingTransaction ?? undefined}
            onSubmit={handleSaveTransaction}
            onCancel={() => setModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}

export default function TransactionList() {
  return (
    <TransactionProvider>
      <Content />
    </TransactionProvider>
  );
}
