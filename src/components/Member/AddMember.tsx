import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Member } from '../../types';
import { generateId, getStorageData, setStorageData } from '../../utils/helpers';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Toast } from '../UI/Toast';

export const AddMember: React.FC = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (mobile && !/^\d{10}$/.test(mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      const members = getStorageData<Member>('members');
      
      const newMember: Member = {
        id: generateId(),
        userId: user!.id,
        name: name.trim(),
        mobile: mobile.trim() || undefined,
        createdAt: new Date().toISOString(),
      };

      members.push(newMember);
      setStorageData('members', members);
      
      setToast({ message: 'Member added successfully!', type: 'success' });
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      setToast({ message: 'Failed to add member. Please try again.', type: 'error' });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Add Member</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
              <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Add New Member</h2>
            <p className="text-gray-600 dark:text-gray-400">Enter member details to start tracking transactions</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              label="Full Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={User}
              placeholder="Enter member's full name"
              error={errors.name}
            />

            <Input
              type="tel"
              label="Mobile Number (Optional)"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              icon={Phone}
              placeholder="Enter 10-digit mobile number"
              error={errors.mobile}
            />

            <div className="flex space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
              >
                Add Member
              </Button>
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