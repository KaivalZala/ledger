import React from 'react';
import { User, Phone, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { MemberWithBalance } from '../../types';
import { formatCurrency, formatDate, getInitials } from '../../utils/helpers';

interface MemberCardProps {
  member: MemberWithBalance;
  onClick: () => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member, onClick }) => {
  const getStatusColor = () => {
    switch (member.status) {
      case 'due': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'credit': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50';
    }
  };

  const getBalanceDisplay = () => {
    if (member.status === 'due') {
      return `Due ${formatCurrency(Math.abs(member.balance))}`;
    } else if (member.status === 'credit') {
      return `Credit ${formatCurrency(Math.abs(member.balance))}`;
    }
    return 'Settled';
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {getInitials(member.name)}
            </span>
          </div>
          
          {/* Member Info */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {member.name}
            </h3>
            {member.mobile && (
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <Phone className="w-3 h-3 mr-1" />
                {member.mobile}
              </div>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {getBalanceDisplay()}
        </div>
      </div>

      {/* Balance and Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Given</span>
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {formatCurrency(member.totalGiven)}
          </p>
        </div>

        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Received</span>
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {formatCurrency(member.totalReceived)}
          </p>
        </div>
      </div>

      {/* Last Transaction */}
      {member.lastTransactionDate && (
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <Calendar className="w-3 h-3 mr-1" />
          Last transaction: {formatDate(member.lastTransactionDate)}
        </div>
      )}
    </div>
  );
};