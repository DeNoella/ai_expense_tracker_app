'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import ExpensePieChart from '@/components/ExpensePieChart';
import ExpenseTrendChart from '@/components/ExpenseTrendChart';
import { expensesAPI, budgetAPI } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Plus,
  ArrowRight,
  Settings,
  X
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [budget, setBudget] = useState<any>(null);
  const [income, setIncome] = useState(0);
  const [insights, setInsights] = useState<string[]>([]);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeSource, setIncomeSource] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, budgetRes, incomeRes] = await Promise.all([
        expensesAPI.getStats(),
        budgetAPI.get(),
        budgetAPI.getIncome(),
      ]);

      setStats(statsRes.data);
      setBudget(budgetRes.data.budget);
      setIncome(incomeRes.data.totalIncome || 0);
      generateInsights(statsRes.data, budgetRes.data.budget, incomeRes.data.totalIncome || 0);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await budgetAPI.set(parseFloat(budgetAmount));
      setShowBudgetModal(false);
      setBudgetAmount('');
      fetchData();
    } catch (error) {
      console.error('Error setting budget:', error);
    }
  };

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await budgetAPI.addIncome({
        amount: parseFloat(incomeAmount),
        source: incomeSource,
        date: new Date().toISOString().split('T')[0],
      });
      setIncomeAmount('');
      setIncomeSource('');
      fetchData();
    } catch (error) {
      console.error('Error adding income:', error);
    }
  };

  const generateInsights = (stats: any, budget: any, income: number) => {
    const insightsList: string[] = [];
    const totalExpenses = stats?.totalExpenses || 0;

    if (budget) {
      const usagePercent = (totalExpenses / budget.monthly_budget) * 100;
      if (usagePercent > 100) {
        insightsList.push(`⚠️ You're ${usagePercent.toFixed(1)}% over budget this month`);
      } else if (usagePercent > 80) {
        insightsList.push(`You're at ${usagePercent.toFixed(1)}% of your budget - be mindful`);
      } else {
        insightsList.push(`✅ Great job! You're within budget`);
      }
    }

    if (stats?.byCategory && stats.byCategory.length > 0) {
      const topCategory = stats.byCategory[0];
      insightsList.push(`Top spending category: ${topCategory.category} ($${topCategory.total.toFixed(2)})`);
    }

    if (income > 0) {
      const savings = income - totalExpenses;
      if (savings > 0) {
        insightsList.push(`You're saving $${savings.toFixed(2)} this month`);
      } else {
        insightsList.push(`Your expenses exceed income by $${Math.abs(savings).toFixed(2)}`);
      }
    }

    setInsights(insightsList);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  const totalExpenses = stats?.totalExpenses || 0;
  const remaining = budget ? budget.remaining : 0;
  const usagePercent = budget ? budget.usagePercent : 0;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Overview of your financial health</p>
          </div>
          <Link
            href="/expenses"
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Add Expense</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">${totalExpenses.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Income</p>
                <p className="text-2xl font-bold text-gray-900">${income.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Remaining Budget</p>
                <p className="text-2xl font-bold text-gray-900">${remaining.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <button
              onClick={() => setShowBudgetModal(true)}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <Settings className="w-4 h-4" />
              <span>{budget ? 'Update Budget' : 'Set Budget'}</span>
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Budget Usage</p>
                <p className="text-2xl font-bold text-gray-900">{usagePercent.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">AI Insights</h2>
            <ul className="space-y-2">
              {insights.map((insight, index) => (
                <li key={index} className="flex items-start space-x-2 text-gray-700">
                  <ArrowRight className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h2>
            <ExpensePieChart data={stats?.byCategory || []} />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Spending Trend (Last 6 Months)</h2>
            <ExpenseTrendChart data={stats?.trend || []} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/expenses"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">View Expenses</p>
                <p className="text-sm text-gray-600">See all your expenses</p>
              </div>
            </Link>

            <Link
              href="/ai-chat"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Ask AI Assistant</p>
                <p className="text-sm text-gray-600">Get smart insights</p>
              </div>
            </Link>

            <Link
              href="/expenses?action=add"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Add Expense</p>
                <p className="text-sm text-gray-600">Record new expense</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Budget & Income Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Income</h2>
            <form onSubmit={handleAddIncome} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={incomeAmount}
                  onChange={(e) => setIncomeAmount(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Source (Optional)</label>
                <input
                  type="text"
                  value={incomeSource}
                  onChange={(e) => setIncomeSource(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Salary, Freelance, etc."
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all"
              >
                Add Income
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Budget Modal */}
      {showBudgetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Set Monthly Budget</h2>
              <button
                onClick={() => {
                  setShowBudgetModal(false);
                  setBudgetAmount('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSetBudget} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Budget</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder={budget ? budget.monthly_budget.toString() : "0.00"}
                  />
                </div>
                {budget && (
                  <p className="mt-2 text-sm text-gray-500">
                    Current budget: ${budget.monthly_budget.toFixed(2)}
                  </p>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowBudgetModal(false);
                    setBudgetAmount('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  {budget ? 'Update' : 'Set'} Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

