import React, { useMemo } from 'react';
import { TrendingUp, DollarSign, Target, Calendar } from 'lucide-react';
import PieChart from '../components/PieChart';
import { getFinancialTip } from '../utils/mockAI';
import { useExpenses } from '../hooks/useExpenses';

const Dashboard: React.FC = () => {
  const { expenses, loading } = useExpenses();

  const summary = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const weeklySpent = expenses
      .filter(expense => new Date(expense.date) >= oneWeekAgo)
      .reduce((sum, expense) => sum + expense.amount, 0);
    const monthlySpent = expenses
      .filter(expense => new Date(expense.date) >= oneMonthAgo)
      .reduce((sum, expense) => sum + expense.amount, 0);

    const categoryBreakdown = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as { [key: string]: number });

    return { totalSpent, weeklySpent, monthlySpent, categoryBreakdown };
  }, [expenses]);

  const chartColors = [
    '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    '#8B5A2B', '#6B46C1', '#059669', '#DC2626', '#7C2D12'
  ];

  const financialTip = getFinancialTip(summary);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Dashboard</h1>
          <p className="text-gray-600">Your spending insights and financial overview</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">${summary.totalSpent.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">${summary.weeklySpent.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">${summary.monthlySpent.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(summary.categoryBreakdown).length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Spending Breakdown Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Spending by Category</h2>
            {Object.keys(summary.categoryBreakdown).length > 0 ? (
              <div className="flex justify-center">
                <PieChart data={summary.categoryBreakdown} colors={chartColors} />
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No expenses to display yet</p>
                <p className="text-gray-400 text-sm">Add some expenses to see your spending breakdown</p>
              </div>
            )}
          </div>

          {/* AI Financial Tip */}
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-lg p-8 text-white">
            <h2 className="text-xl font-semibold mb-4">💡 AI Financial Insight</h2>
            <p className="text-purple-100 mb-6">{financialTip}</p>
            
            <div className="bg-white/20 rounded-xl p-4">
              <h3 className="font-semibold mb-2">Quick Tips:</h3>
              <ul className="space-y-1 text-sm text-purple-100">
                <li>• Set weekly spending limits for your top categories</li>
                <li>• Review your expenses weekly to stay on track</li>
                <li>• Use the AI assistant for personalized advice</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Transactions</h2>
          {expenses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No transactions yet. Start by adding your first expense!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.slice(0, 10).map((expense) => (
                    <tr key={expense.id} className="border-b hover:bg-gray-50 transition-colors duration-200">
                      <td className="py-3 px-4 text-gray-600">{new Date(expense.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-full">
                          {expense.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900">${expense.amount.toFixed(2)}</td>
                      <td className="py-3 px-4 text-gray-600">{expense.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;