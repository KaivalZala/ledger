import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Wallet } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Toast } from '../UI/Toast';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const success = await login(email, password);
    
    if (success) {
      setToast({ message: 'Login successful!', type: 'success' });
    } else {
      setError('Invalid email or password');
      setToast({ message: 'Login failed. Please check your credentials.', type: 'error' });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Member Ledger</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              placeholder="Enter your email"
              error={error && !email ? 'Email is required' : ''}
            />

            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              placeholder="Enter your password"
              error={error && !password ? 'Password is required' : ''}
            />

            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="h-12"
            >
              Login
            </Button>

            <div className="text-center">
              <Link 
                to="/signup" 
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
              >
                Don't have an account? Create one
              </Link>
            </div>
          </form>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={!!toast}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};