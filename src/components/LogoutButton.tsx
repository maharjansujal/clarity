"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, AlertCircle } from "lucide-react";
import Modal from "./Modal";

export default function LogoutButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* The trigger button in Header */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>

      <Modal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Confirm Logout"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
            <AlertCircle className="w-6 h-6 text-amber-500" />
            <p>Are you sure you want to log out of your account? You will need to sign back in to access your dashboard.</p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}