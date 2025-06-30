import { Member, Transaction, MemberWithBalance } from '../types';

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export const calculateMemberBalance = (
  member: Member,
  transactions: Transaction[]
): MemberWithBalance => {
  const memberTransactions = transactions.filter(t => t.memberId === member.id);
  
  const totalGiven = memberTransactions
    .filter(t => t.type === 'given')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalReceived = memberTransactions
    .filter(t => t.type === 'received')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalGiven - totalReceived;
  
  let status: 'due' | 'credit' | 'settled' = 'settled';
  if (balance > 0) status = 'due';
  else if (balance < 0) status = 'credit';
  
  const lastTransaction = memberTransactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
  return {
    ...member,
    balance,
    totalGiven,
    totalReceived,
    status,
    lastTransactionDate: lastTransaction?.date,
  };
};

export const getStorageData = <T>(key: string): T[] => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
};

export const setStorageData = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};