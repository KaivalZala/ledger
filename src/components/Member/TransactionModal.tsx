import React, { useState } from 'react';
import { Calendar, FileText, DollarSign } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Transaction } from '../../types';
import { generateId, getStorageData, setStorageData } from '../../utils/helpers';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string;
  type: 'given' | 'received';
  onSuccess: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  memberId,
  type,
  onSuccess,
}) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const amountValue = parseFloat(amount);
    
    if (!amountValue || amountValue <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsLoading(true);

    try {
      const transactions = getStorageData<Transaction>('transactions');
      
      const newTransaction: Transaction = {
        id: generateId(),
        memberId,
        userId: user!.id,
        type,
        amount: amountValue,
        note: note.trim() || undefined,
        date: date,
        createdAt: new Date().toISOString(),
      };

      transactions.push(newTransaction);
      setStorageData('transactions', transactions);
      
      // Reset form
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setNote('');
      
      onSuccess();
      onClose();
    } catch (error) {
      setError('Failed to add transaction. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleClose = () => {
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setNote('');
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Add ${type === 'given' ? 'Money Given' : 'Money Received'}`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="number"
          label="Amount *"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          icon={DollarSign}
          placeholder="Enter amount"
          min="0"
          step="0.01"
        />

        <Input
          type="date"
          label="Date *"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          icon={Calendar}
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Note (Optional)
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
              rows={3}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={handleClose}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            variant={type === 'given' ? 'danger' : 'success'}
            fullWidth
            isLoading={isLoading}
          >
            Add {type === 'given' ? 'Given' : 'Received'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};