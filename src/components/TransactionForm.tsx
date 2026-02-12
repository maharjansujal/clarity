"use client";

import { Transaction } from "@/types/transaction";
import {
  Calendar,
  DollarSign,
  FileText,
  Receipt,
  Tag,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type FormTransaction = Omit<Transaction, "id" | "user_id" | "created_at">;

export const initialState: FormTransaction = {
  title: "",
  description: "",
  type: "income",
  amount: "",
  category: "",
  date: "",
};

export const incomeCategories = [
  { value: "salary", label: "Salary" },
  { value: "freelance", label: "Freelance" },
  { value: "investment", label: "Investment" },
  { value: "other-income", label: "Other Income" },
];

export const expenseCategories = [
  { value: "food", label: "Food & Dining" },
  { value: "transportation", label: "Transportation" },
  { value: "shopping", label: "Shopping" },
  { value: "entertainment", label: "Entertainment" },
  { value: "bills", label: "Bills & Utilities" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "other-expense", label: "Other Expense" },
];

export default function TransactionForm({
  editingTransaction,
  onSubmit,
  onCancel,
}: {
  editingTransaction?: Transaction;
  onSubmit?: (data: Transaction) => void;
  onCancel?: () => void;
}) {
  const [formData, setFormData] = useState<FormTransaction>(initialState);
  const router = useRouter();

  useEffect(() => {
    if (editingTransaction) {
      console.log(editingTransaction);
      setFormData({
        title: editingTransaction.title,
        description: editingTransaction.description,
        type: editingTransaction.type,
        amount: editingTransaction.amount,
        category: editingTransaction.category,
        date: editingTransaction.date ? editingTransaction.date.split("T")[0] : "",
      });
    } else {
      setFormData(initialState);
    }
  }, [editingTransaction]);

  const categories =
    formData.type === "income" ? incomeCategories : expenseCategories;

  function handleInputChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const key = e.target.name;
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleTypeChange(type: "income" | "expense") {
    setFormData((prev) => ({
      ...prev,
      type,
      category: "", // reset category when switching type
    }));
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    const method = editingTransaction ? "PUT" : "POST";
    const url = editingTransaction
      ? `/api/transactions/${editingTransaction.id}`
      : "/api/transactions";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.status===401){
      router.push('/login')
    }

    if (!res.ok) {
      const error = await res.json();
      alert(error.message);
      return;
    }

    const savedTransaction = await res.json();
    if (onSubmit) onSubmit(savedTransaction);
    setFormData(initialState);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Transaction Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Transaction Type
        </label>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleTypeChange("income")}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all cursor-pointer
              ${
                formData.type === "income"
                  ? "bg-linear-to-r from-emerald-500 to-emerald-600 text-white"
                  : "border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
          >
            <TrendingUp className="w-5 h-5" />
            Income
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange("expense")}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all cursor-pointer
              ${
                formData.type === "expense"
                  ? "bg-linear-to-r from-red-500 to-red-600 text-white"
                  : "border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
          >
            <TrendingDown className="w-5 h-5" />
            Expense
          </button>
        </div>
      </div>
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Title <span className="text-red-500">*</span>
        </label>

        <div className="relative">
          <Receipt className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full pl-12 pr-4 py-3 rounded-xl 
            border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-indigo-500
            transition-all"
          />
        </div>
      </div>
      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Amount <span className="text-red-500">*</span>
        </label>

        <div className="relative">
          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

          <input
            name="amount"
            type="text"
            value={formData.amount}
            onChange={handleInputChange}
            className="w-full pl-12 pr-4 py-3 rounded-xl 
            border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-indigo-500
            transition-all"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category <span className="text-red-500">*</span>
        </label>

        <div className="relative">
          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full pl-12 pr-4 py-3 rounded-xl 
            border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-indigo-500
            appearance-none transition-all"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Date <span className="text-red-500">*</span>
        </label>

        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full pl-12 pr-4 py-3 rounded-xl 
            border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-indigo-500
            transition-all"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>

        <div className="relative">
          <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />

          <textarea
            name="description"
            rows={3}
            placeholder="Add a note about this transaction..."
            value={formData.description ?? ""}
            onChange={handleInputChange}
            className="w-full pl-12 pr-4 py-3 rounded-xl 
            border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-indigo-500
            resize-none transition-all"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl 
          border border-gray-300 dark:border-gray-600
          text-gray-700 dark:text-gray-300
          hover:bg-gray-100 dark:hover:bg-gray-800
          transition-colors font-semibold cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="flex-1 py-3 rounded-xl 
          bg-linear-to-r from-indigo-600 to-purple-600 
          text-white font-semibold 
          hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
          disabled:opacity-60 disabled:cursor-not-allowed
          transition-all cursor-pointer"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
