import React, { InputHTMLAttributes, forwardRef } from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="h-5 w-5 text-gray-400" />
            </div>
          )}
          
          <input
            ref={ref}
            className={`
              block w-full rounded-lg border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white 
              placeholder-gray-500 dark:placeholder-gray-400 
              focus:border-blue-500 focus:ring-blue-500 focus:ring-1 focus:outline-none
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              ${Icon ? 'pl-10' : ''}
              ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';