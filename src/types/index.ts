export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface Member {
  id: string;
  userId: string;
  name: string;
  mobile?: string;
  createdAt: string;
  lastTransactionDate?: string;
}

export interface Transaction {
  id: string;
  memberId: string;
  userId: string;
  type: 'given' | 'received';
  amount: number;
  note?: string;
  date: string;
  createdAt: string;
}

export interface MemberWithBalance extends Member {
  balance: number;
  totalGiven: number;
  totalReceived: number;
  status: 'due' | 'credit' | 'settled';
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}