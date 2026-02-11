'use client'
import { Transaction } from "@/types/transaction";
import { Calendar, DollarSign, MoreVertical, Tag } from "lucide-react";
import { useEffect, useState } from "react";

export default function TransactionList(){
    const [transactions, setTransactions] = useState<Transaction[] | []>([]);
     useEffect(() => {
        async function fetchTransaction() {
          const response = await fetch("/api/transactions");
          const data = (await response.json()) as Transaction[];
          setTransactions(data);
        }
        fetchTransaction();
      }, []);
    return(
        <div className="rounded-3xl shadow-sm">
          <div className="divide-y">
            {transactions.length > 0 ? (
              transactions.map(function (transaction, idx) {
                return (
                  <div
                    key={idx}
                    className="p-6 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
                          <DollarSign className="w-6 h-6 text-rose-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-1">
                            "transaction.title"
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-slate-500">
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
                          <p className="text-lg font-bold text-emerald-600">
                            {transaction.type === "expense" ? "-" : ""}
                            {transaction.amount}
                          </p>
                          <p className="text-sm text-slate-500">
                            {transaction.type === "expense"
                              ? "Expense"
                              : "Income"}
                          </p>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-slate-100 rounded-lg">
                          <MoreVertical className="w-5 h-5 text-slate-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No transactions found</p>
            )}
          </div>
        </div>
    )
}