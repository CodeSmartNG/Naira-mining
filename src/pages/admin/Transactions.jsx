import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, MoreVertical, Eye, CheckCircle, XCircle, Clock, User, RefreshCw } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [searchTerm, typeFilter, statusFilter, userFilter, dateRange, transactions]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      
      // Mock data
      const mockTransactions = Array.from({ length: 100 }, (_, i) => {
        const types = ['deposit', 'withdrawal', 'reward', 'transfer', 'fee'];
        const statuses = ['completed', 'pending', 'failed', 'cancelled'];
        const users = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'David Brown'];
        
        return {
          id: `TXN${1000 + i}`,
          userId: 1000 + i,
          userName: users[i % 5],
          userEmail: `user${i + 1}@example.com`,
          type: types[i % 5],
          amount: Math.floor(Math.random() * 500000) + 1000,
          currency: 'NGN',
          status: statuses[i % 4],
          reference: `REF${Math.floor(100000 + Math.random() * 900000)}`,
          provider: ['paystack', 'monnify', 'bank_transfer'][i % 3],
          metadata: {
            note: i % 3 === 0 ? 'Mining reward' : i % 3 === 1 ? 'Manual deposit' : 'Withdrawal request',
            bankName: i % 4 === 0 ? 'GTBank' : i % 4 === 1 ? 'Zenith Bank' : 'Access Bank',
            accountNumber: `0${Math.floor(1000000000 + Math.random() * 9000000000)}`
          },
          balanceBefore: Math.floor(Math.random() * 1000000),
          balanceAfter: Math.floor(Math.random() * 1000000),
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        };
      });
      
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(tx =>
        tx.id.toLowerCase().includes(term) ||
        tx.reference.toLowerCase().includes(term) ||
        tx.userName.toLowerCase().includes(term) ||
        tx.userEmail.toLowerCase().includes(term) ||
        (tx.metadata?.note && tx.metadata.note.toLowerCase().includes(term))
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(tx => tx.type === typeFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(tx => tx.status === statusFilter);
    }

    // User filter
    if (userFilter !== 'all') {
      filtered = filtered.filter(tx => tx.userName === userFilter);
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      let startDate = new Date();
      
      switch (dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(tx => new Date(tx.createdAt) >= startDate);
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  };

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsModal(true);
  };

  const handleUpdateStatus = (transactionId, newStatus) => {
    setTransactions(prev => prev.map(tx =>
      tx.id === transactionId ? { ...tx, status: newStatus } : tx
    ));
    
    toast.success(`Transaction status updated to ${newStatus}`);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'User', 'Type', 'Amount', 'Status', 'Reference', 'Provider', 'Created', 'Updated'];
    const csvData = filteredTransactions.map(tx => [
      tx.id,
      tx.userName,
      tx.type,
      formatCurrency(tx.amount),
      tx.status,
      tx.reference,
      tx.provider,
      formatDate(tx.createdAt),
      formatDate(tx.updatedAt)
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Transactions exported successfully');
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'deposit':
      case 'reward':
        return <span className="text-green-600">+</span>;
      case 'withdrawal':
      case 'fee':
        return <span className="text-red-600">-</span>;
      default:
        return <span className="text-blue-600">↔</span>;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'deposit':
      case 'reward':
        return 'bg-green-100 text-green-800';
      case 'withdrawal':
      case 'fee':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-600" />;
      case 'failed':
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  // Stats
  const stats = {
    total: transactions.length,
    totalAmount: transactions.reduce((sum, tx) => sum + tx.amount, 0),
    completed: transactions.filter(tx => tx.status === 'completed').length,
    pending: transactions.filter(tx => tx.status === 'pending').length,
    deposits: transactions.filter(tx => tx.type === 'deposit').length,
    withdrawals: transactions.filter(tx => tx.type === 'withdrawal').length
  };

  // Get unique users for filter
  const uniqueUsers = [...new Set(transactions.map(tx => tx.userName))];

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
          <h1 className="text-2xl font-bold text-gray-900">Transaction Management</h1>
          <p className="text-gray-600">Manage and monitor all platform transactions</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchTransactions()}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw size={20} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download size={20} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.total.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-blue-600 font-bold">T</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Volume</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(stats.totalAmount)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-green-600 font-bold">₦</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.completed.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.pending.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Deposits</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.deposits.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-green-600 font-bold">+</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Withdrawals</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.withdrawals.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <span className="text-red-600 font-bold">-</span>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Search */}
          <div>
            <label className="label">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="ID, reference, user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-field"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label className="label">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="reward">Reward</option>
              <option value="transfer">Transfer</option>
              <option value="fee">Fee</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="label">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* User Filter */}
          <div>
            <label className="label">User</label>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Users</option>
              {uniqueUsers.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="label">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="input-field"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
            </select>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <label className="label">Quick Actions</label>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setTypeFilter('pending');
                  setStatusFilter('pending');
                }}
                className="btn-secondary flex-1"
              >
                Show Pending
              </button>
              <button
                onClick={() => {
                  setTypeFilter('all');
                  setStatusFilter('failed');
                }}
                className="btn-secondary flex-1"
              >
                Show Failed
              </button>
              <button
                onClick={() => {
                  setTypeFilter('all');
                  setStatusFilter('all');
                  setUserFilter('all');
                  setDateRange('all');
                  setSearchTerm('');
                }}
                className="btn-secondary flex-1"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID & User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{tx.id}</p>
                        <div className="flex items-center mt-1">
                          <User size={14} className="text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600">{tx.userName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(tx.type)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(tx.type)}`}>
                          {tx.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className={`font-medium ${tx.type === 'deposit' || tx.type === 'reward' ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.type === 'deposit' || tx.type === 'reward' ? '+' : '-'}
                        {formatCurrency(tx.amount)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {tx.currency}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(tx.status)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(tx.status)}`}>
                          {tx.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-mono text-gray-700">{tx.reference}</p>
                      <p className="text-xs text-gray-500">{tx.provider}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {formatDate(tx.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(tx)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        {tx.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(tx.id, 'completed')}
                              className="p-1 text-green-400 hover:text-green-600"
                              title="Mark as Completed"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(tx.id, 'failed')}
                              className="p-1 text-red-400 hover:text-red-600"
                              title="Mark as Failed"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center">
                    <div className="text-gray-500">
                      <p className="font-medium">No transactions found</p>
                      <p className="text-sm mt-1">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredTransactions.length > 0 && (
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(startIndex + itemsPerPage, filteredTransactions.length)}
                </span> of{' '}
                <span className="font-medium">{filteredTransactions.length}</span> transactions
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {showDetailsModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
                  <p className="text-gray-600">{selectedTransaction.id}</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle size={20} />
                </button>
              </div>

              {/* Transaction Info */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">User Information</label>
                    <div className="mt-2 space-y-1">
                      <p className="font-medium">{selectedTransaction.userName}</p>
                      <p className="text-sm text-gray-600">{selectedTransaction.userEmail}</p>
                      <p className="text-sm text-gray-500">User ID: {selectedTransaction.userId}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Transaction Details</label>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(selectedTransaction.type)}`}>
                          {selectedTransaction.type}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedTransaction.status)}`}>
                          {selectedTransaction.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Reference: {selectedTransaction.reference}</p>
                      <p className="text-sm text-gray-500">Provider: {selectedTransaction.provider}</p>
                    </div>
                  </div>
                </div>

                {/* Financial Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Amount</p>
                    <p className={`text-2xl font-bold mt-2 ${selectedTransaction.type === 'deposit' || selectedTransaction.type === 'reward' ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedTransaction.type === 'deposit' || selectedTransaction.type === 'reward' ? '+' : '-'}
                      {formatCurrency(selectedTransaction.amount)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{selectedTransaction.currency}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Balance Before</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {formatCurrency(selectedTransaction.balanceBefore)}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Balance After</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {formatCurrency(selectedTransaction.balanceAfter)}
                    </p>
                  </div>
                </div>

                {/* Metadata */}
                {selectedTransaction.metadata && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Additional Information</label>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                      <div className="space-y-2">
                        {selectedTransaction.metadata.note && (
                          <p className="text-sm">
                            <span className="font-medium">Note:</span> {selectedTransaction.metadata.note}
                          </p>
                        )}
                        {selectedTransaction.metadata.bankName && (
                          <p className="text-sm">
                            <span className="font-medium">Bank:</span> {selectedTransaction.metadata.bankName}
                          </p>
                        )}
                        {selectedTransaction.metadata.accountNumber && (
                          <p className="text-sm">
                            <span className="font-medium">Account:</span> {selectedTransaction.metadata.accountNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <p className="mt-2">{formatDate(selectedTransaction.createdAt)}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                    <p className="mt-2">{formatDate(selectedTransaction.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-3">
                  <button className="btn-primary">
                    View Full Receipt
                  </button>
                  {selectedTransaction.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          handleUpdateStatus(selectedTransaction.id, 'completed');
                          setShowDetailsModal(false);
                        }}
                        className="btn-secondary bg-green-600 hover:bg-green-700 text-white"
                      >
                        Approve Transaction
                      </button>
                      <button
                        onClick={() => {
                          handleUpdateStatus(selectedTransaction.id, 'failed');
                          setShowDetailsModal(false);
                        }}
                        className="btn-secondary bg-red-600 hover:bg-red-700 text-white"
                      >
                        Reject Transaction
                      </button>
                    </>
                  )}
                  <button className="btn-secondary">
                    Download Receipt
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransactions;