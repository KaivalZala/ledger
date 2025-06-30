import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Calendar, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Member, Transaction, MemberWithBalance } from '../../types';
import { getStorageData, calculateMemberBalance, formatCurrency, formatDate, getInitials } from '../../utils/helpers';
import { Button } from '../UI/Button';
import { TransactionModal } from './TransactionModal';
import { Toast } from '../UI/Toast';

export const MemberDetail: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const [member, setMember] = useState<MemberWithBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'given' | 'received'>('given');
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [memberId, user]);

  const loadData = () => {
    if (!memberId || !user) return;

    const members = getStorageData<Member>('members');
    const allTransactions = getStorageData<Transaction>('transactions');
    
    const foundMember = members.find(m => m.id === memberId && m.userId === user.id);
    
    if (!foundMember) {
      navigate('/');
      return;
    }

    const memberTransactions = allTransactions.filter(t => t.memberId === memberId && t.userId === user.id);
    const memberWithBalance = calculateMemberBalance(foundMember, allTransactions);
    
    setMember(memberWithBalance);
    setTransactions(memberTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setIsLoading(false);
  };

  const handleAddTransaction = (type: 'given' | 'received') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleTransactionSuccess = () => {
    loadData();
    setToast({
      message: `Transaction added successfully!`,
      type: 'success'
    });
  };

  const getStatusColor = () => {
    if (!member) return '';
    switch (member.status) {
      case 'due': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'credit': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50';
    }
  };

  const getBalanceDisplay = () => {
    if (!member) return '';
    if (member.status === 'due') {
      return `Due ${formatCurrency(Math.abs(member.balance))}`;
    } else if (member.status === 'credit') {
      return `Credit ${formatCurrency(Math.abs(member.balance))}`;
    }
    return 'Settled';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Member not found</h2>
          <Button onClick={() => navigate('/')}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
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
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{member.name}</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Member Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {getInitials(member.name)}
                </span>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{member.name}</h2>
                {member.mobile && (
                  <p className="text-gray-600 dark:text-gray-400">{member.mobile}</p>
                )}
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor()}`}>
                  {getBalanceDisplay()}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Given</span>
              </div>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(member.totalGiven)}
              </p>
            </div>

            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <TrendingDown className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Received</span>
              </div>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(member.totalReceived)}
              </p>
            </div>

            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Net Balance</span>
              </div>
              <p className={`text-xl font-bold ${
                member.balance > 0 ? 'text-red-600 dark:text-red-400' : 
                member.balance < 0 ? 'text-green-600 dark:text-green-400' : 
                'text-gray-600 dark:text-gray-400'
              }`}>
                {formatCurrency(Math.abs(member.balance))}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Button
            variant="success"
            size="lg"
            onClick={() => handleAddTransaction('received')}
            className="h-12"
          >
            <Plus className="w-5 h-5 mr-2" />
            Money Received
          </Button>
          
          <Button
            variant="danger"
            size="lg"
            onClick={() => handleAddTransaction('given')}
            className="h-12"
          >
            <Minus className="w-5 h-5 mr-2" />
            Money Given
          </Button>
        </div>

        {/* Transaction History */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Transaction History</h3>
          </div>

          {transactions.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No transactions yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Add your first transaction to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'given' 
                          ? 'bg-red-100 dark:bg-red-900/20' 
                          : 'bg-green-100 dark:bg-green-900/20'
                      }`}>
                        {transaction.type === 'given' ? (
                          <TrendingUp className="w-5 h-5 text-red-600 dark:text-red-400" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-green-600 dark:text-green-400" />
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.type === 'given'
                              ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                              : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                          }`}>
                            {transaction.type === 'given' ? 'Given' : 'Received'}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(transaction.date)}
                        </div>
                        
                        {transaction.note && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {transaction.note}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'given'
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-green-600 dark:text-green-400'
                      }`}>
                        {transaction.type === 'given' ? '-' : '+'}{formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        memberId={member.id}
        type={modalType}
        onSuccess={handleTransactionSuccess}
      />

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