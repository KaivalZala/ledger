import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className={`
        flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px]
        ${type === 'success' 
          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
          : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }
      `}>
        {type === 'success' ? (
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
        )}
        
        <p className={`flex-1 text-sm font-medium ${
          type === 'success' 
            ? 'text-green-800 dark:text-green-200' 
            : 'text-red-800 dark:text-red-200'
        }`}>
          {message}
        </p>
        
        <button
          onClick={onClose}
          className={`p-1 rounded-md transition-colors ${
            type === 'success'
              ? 'hover:bg-green-200 dark:hover:bg-green-800/50 text-green-600 dark:text-green-400' 
              : 'hover:bg-red-200 dark:hover:bg-red-800/50 text-red-600 dark:text-red-400'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};