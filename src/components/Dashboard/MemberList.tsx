import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Users, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Member, Transaction, MemberWithBalance } from '../../types';
import { getStorageData, calculateMemberBalance } from '../../utils/helpers';
import { Header } from '../Layout/Header';
import { MemberCard } from './MemberCard';
import { Button } from '../UI/Button';

export const MemberList: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = () => {
    const allMembers = getStorageData<Member>('members');
    const allTransactions = getStorageData<Transaction>('transactions');
    
    const userMembers = allMembers.filter(m => m.userId === user?.id);
    const userTransactions = allTransactions.filter(t => t.userId === user?.id);
    
    setMembers(userMembers);
    setTransactions(userTransactions);
    setIsLoading(false);
  };

  const membersWithBalance = useMemo(() => {
    return members
      .map(member => calculateMemberBalance(member, transactions))
      .filter(member => 
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.mobile?.includes(searchQuery)
      )
      .sort((a, b) => {
        // Sort by status: due first, then credit, then settled
        if (a.status !== b.status) {
          if (a.status === 'due') return -1;
          if (b.status === 'due') return 1;
          if (a.status === 'credit') return -1;
          if (b.status === 'credit') return 1;
        }
        return b.balance - a.balance;
      });
  }, [members, transactions, searchQuery]);

  const stats = useMemo(() => {
    const totalDue = membersWithBalance
      .filter(m => m.status === 'due')
      .reduce((sum, m) => sum + Math.abs(m.balance), 0);
    
    const totalCredit = membersWithBalance
      .filter(m => m.status === 'credit')
      .reduce((sum, m) => sum + Math.abs(m.balance), 0);

    return { totalDue, totalCredit };
  }, [membersWithBalance]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showSearch={true}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Members</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{membersWithBalance.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Amount Due</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">₹{stats.totalDue.toLocaleString()}</p>
              </div>
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <span className="text-red-600 dark:text-red-400 font-bold">↗</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Credit Amount</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">₹{stats.totalCredit.toLocaleString()}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 font-bold">↙</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar (Mobile) */}
        <div className="sm:hidden mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {membersWithBalance.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onClick={() => navigate(`/member/${member.id}`)}
            />
          ))}
        </div>

        {/* Empty State */}
        {membersWithBalance.length === 0 && !searchQuery && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No members yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Start by adding your first member to track transactions</p>
            <Button onClick={() => navigate('/add-member')}>Add First Member</Button>
          </div>
        )}

        {/* No Search Results */}
        {membersWithBalance.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search terms</p>
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => navigate('/add-member')}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};