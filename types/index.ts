export type TransactionType = "INCOME" | "EXPENSE";
export type SubscriptionFreq = "WEEKLY" | "MONTHLY" | "YEARLY";

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
  date: string | Date;
  paymentMethod: string;
  notes?: string | null;
  createdAt: string | Date;
}

export interface Budget {
  id: string;
  userId: string;
  category: string;
  limitAmount: number;
  month: number;
  year: number;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string | Date | null;
  icon: string;
  color: string;
}

export interface Subscription {
  id: string;
  userId: string;
  serviceName: string;
  cost: number;
  billingDate: number;
  frequency: SubscriptionFreq;
  category: string;
  isActive: boolean;
  icon?: string | null;
}

export interface DashboardStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
}
