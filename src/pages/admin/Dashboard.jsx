import React, { useState, useEffect } from 'react';
import { Users, CreditCard, TrendingUp, Shield, DollarSign, BarChart3, Activity, Download, Filter, Calendar } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('today');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    platformBalance: 0,
    pendingWithdrawals: 0,
    kycPending: 0,
    totalTransactions: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setStats({
        totalUsers: 1245,
        activeUsers: 856,
        totalDeposits: 24567890,
        totalWithdrawals: 12345678,
        platformBalance: 12222212,
        pendingWithdrawals: 3456789,
        kycPending: 23,
        totalTransactions: 4567
      });

      setRecentActivity([
        { id: 1, user: 'John Doe', action: 'Deposit', amount: 50000, status: 'completed', time: '2 min ago' },
        { id: 2, user: 'Jane Smith', action: 'Withdrawal', amount: 20000, status: 'pending', time: '5 min ago' },
        { id: 3, user: 'Mike Johnson', action: 'KYC Submitted', amount: null, status: 'pending', time: '10 min ago' },
        { id: 4, user: 'Sarah Williams', action: 'Mining Lock', amount: 100000, status: 'completed', time: '15 min ago' },
        { id: 5, user: 'David Brown', action: 'Deposit', amount: 75000, status: 'completed', time: '20 min ago' }
      ]);

      setTopUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', balance: 1250000, locks: 3, status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', balance: 980000, locks: 2, status: 'active' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', balance: 750000, locks: 1, status: 'pending' },
        { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', balance: 620000, locks: 4, status: 'active' },
        { id: 5, name: 'David Brown', email: 'david@example.com', balance: 550000, locks: 2, status: 'inactive' }
      ]);

      setChartData([
        { date: 'Mon', deposits: 40000, withdrawals: 24000 },
        { date: 'Tue', deposits: 30000, withdrawals: 13980 },
        { date: 'Wed', deposits: 20000, withdrawals: 9800 },
        { date: 'Thu', deposits: 27800, withdrawals: 39080 },
        { date: 'Fri', deposits: 18900, withdrawals: 48000 },
        { date: 'Sat', deposits: 23900, withdrawals: 38000 },
        { date: 'Sun', deposits: 34900, withdrawals: 43000 }
      ]);

    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const timeRanges = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'year', label: 'This Year' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Platform overview and management</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Time Range Filter */}
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {timeRanges.map(range => (
                <option key={range.id} value={range.id}>{range.label}</option>
              ))}
            </select>
          </div>
          
          <button className="btn-secondary flex items-center space-x-2">
            <Download size={20} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.totalUsers.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <TrendingUp size={16} className="mr-1" />
                +12.5% from last month
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Platform Balance</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(stats.platformBalance)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {stats.activeUsers.toLocaleString()} active users
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Withdrawals</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(stats.pendingWithdrawals)}
              </p>
              <p className="text-sm text-yellow-600 mt-1">
                12 requests pending
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <CreditCard size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">KYC Pending</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.kycPending}
              </p>
              <p className="text-sm text-red-600 mt-1">
                Needs review
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <Shield size={24} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts & Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Overview */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Financial Overview</h2>
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-400" />
              <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Mini Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-blue-900">Total Deposits</span>
                  <TrendingUp size={16} className="text-green-600" />
                </div>
                <p className="text-2xl font-bold text-blue-900">
                  {formatCurrency(stats.totalDeposits)}
                </p>
                <div className="mt-2 h-2 bg-blue-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-green-900">Total Withdrawals</span>
                  <TrendingUp size={16} className="text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-900">
                  {formatCurrency(stats.totalWithdrawals)}
                </p>
                <div className="mt-2 h-2 bg-green-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
            
            {/* Chart Visualization */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Deposits vs Withdrawals</h3>
                <span className="text-sm text-gray-500">Last 7 days</span>
              </div>
              
              <div className="space-y-2">
                {chartData.map((day, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-12 text-sm text-gray-600">{day.date}</div>
                    <div className="flex-1 flex items-center space-x-2">
                      <div className="flex-1 h-8 flex items-center">
                        <div 
                          className="h-6 bg-blue-500 rounded-l"
                          style={{ width: `${(day.deposits / 50000) * 100}%` }}
                        ></div>
                        <div 
                          className="h-6 bg-green-500 rounded-r"
                          style={{ width: `${(day.withdrawals / 50000) * 100}%` }}
                        ></div>
                      </div>
                      <div className="w-24 text-right text-sm">
                        <div className="text-blue-600">{formatCurrency(day.deposits)}</div>
                        <div className="text-green-600">{formatCurrency(day.withdrawals)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
                  <span className="text-gray-600">Deposits</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
                  <span className="text-gray-600">Withdrawals</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All →
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{activity.user}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                  {activity.amount && (
                    <p className="text-sm font-medium mt-1">
                      {formatCurrency(activity.amount)}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`
                    px-2 py-1 text-xs font-medium rounded-full
                    ${activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                      activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'}
                  `}>
                    {activity.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <button className="btn-secondary w-full">
                <Activity size={16} className="mr-2" />
                View Activity Log
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Top Users & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Users */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Top Users by Balance</h2>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All Users →
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mining Locks
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{formatCurrency(user.balance)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{user.locks}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`
                        px-2 py-1 text-xs font-medium rounded-full
                        ${user.status === 'active' ? 'bg-green-100 text-green-800' :
                          user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}
                      `}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h2>
          
          <div className="space-y-4">
            <button className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Manage Users</p>
                  <p className="text-sm text-gray-500">View and manage all users</p>
                </div>
              </div>
            </button>
            
            <button className="w-full p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CreditCard size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Process Withdrawals</p>
                  <p className="text-sm text-gray-500">Review pending withdrawal requests</p>
                </div>
              </div>
            </button>
            
            <button className="w-full p-4 border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Shield size={20} className="text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Review KYC</p>
                  <p className="text-sm text-gray-500">Verify user documents</p>
                </div>
              </div>
            </button>
            
            <button className="w-full p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BarChart3 size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Generate Reports</p>
                  <p className="text-sm text-gray-500">Create financial reports</p>
                </div>
              </div>
            </button>
          </div>
          
          {/* System Status */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">System Status</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Status</span>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Payment Gateway</span>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Metrics */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Platform Metrics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {stats.totalTransactions.toLocaleString()}
            </div>
            <p className="text-sm font-medium text-gray-700">Total Transactions</p>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {Math.round(stats.totalDeposits / stats.totalUsers).toLocaleString()}
            </div>
            <p className="text-sm font-medium text-gray-700">Avg. Deposit per User</p>
            <p className="text-xs text-gray-500 mt-1">NGN</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              98.5%
            </div>
            <p className="text-sm font-medium text-gray-700">Uptime</p>
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              2.4s
            </div>
            <p className="text-sm font-medium text-gray-700">Avg. Response Time</p>
            <p className="text-xs text-gray-500 mt-1">API latency</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;