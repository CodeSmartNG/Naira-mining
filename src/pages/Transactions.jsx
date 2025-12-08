import React, { useState, useEffect } from 'react';
import { Download, Filter, Search, ArrowUpRight, ArrowDownRight, Copy, Check } from 'lucide-react';
import { walletApi } from '../api';
import { formatCurrency, formatDate, copyToClipboard } from '../utils/formatters';
import toast from 'react-hot-toast';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [copiedId, setCopiedId] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [searchTerm, typeFilter, statusFilter, transactions]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await walletApi.getTransactions(1, 50);
      setTransactions(response.items || response.data || []);
      setFilteredTransactions(response.items || response.data || []);
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
      filtered = filtered.filter(tx =>
        tx.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.metadata?.note && tx.metadata.note.toLowerCase().includes(searchTerm.toLowerCase()))
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

    setFilteredTransactions(filtered);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'deposit':
      case 'reward':
        return <ArrowDownRight size={16} className="text-green-600" />;
      case 'withdrawal':
      case 'fee':
        return <ArrowUpRight size={16} className="text-red-600" />;
      default:
        return <ArrowUpRight size={16} className="text-blue-600" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'deposit':
      case 'reward':
        return 'text-green-700 bg-green-100';
      case 'withdrawal':
      case 'fee':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-blue-700 bg-blue-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-700 bg-green-100';
      case 'pending':
        return 'text-yellow-700 bg-yellow-100';
      case 'failed':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const handleCopyReference = async (reference) => {
    await copyToClipboard(reference);
    setCopiedId(reference);
    setTimeout(() => setCopiedId(''), 2000);
    toast.success('Reference copied!');
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Type', 'Amount', 'Status', 'Reference', 'Note'];
    const csvData = filteredTransactions.map(tx => [
      formatDate(tx.createdAt),
      tx.type,
      formatCurrency(tx.amount),
      tx.status,
      tx.reference,
      tx.metadata?.note || ''
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
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600">View all your deposit, withdrawal, and reward transactions</p>
        </div>
        <button
          onClick={exportToCSV}
          className="btn-secondary flex items-center space-x-2"
        >
          <Download size={20} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {transactions.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ArrowUpRight size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Deposits</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(
                  transactions
                    .filter(tx => tx.type === 'deposit' && tx.status === 'completed')
                    .reduce((sum, tx) => sum + tx.amount, 0)
                )}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <ArrowDownRight size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Withdrawals</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(
                  transactions
                    .filter(tx => tx.type === 'withdrawal' && tx.status === 'completed')
                    .reduce((sum, tx) => sum + tx.amount, 0)
                )}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <ArrowUpRight size={24} className="text-red-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Rewards</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(
                  transactions
                    .filter(tx => tx.type === 'reward' && tx.status === 'completed')
                    .reduce((sum, tx) => sum + tx.amount, 0)
                )}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <ArrowDownRight size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by reference or note..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-field"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {/* Type Filter */}
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
            <div className="flex items-center space-x-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Note
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(transaction.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(transaction.type)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(transaction.type)}`}>
                          {transaction.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        transaction.type === 'deposit' || transaction.type === 'reward'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {transaction.type === 'deposit' || transaction.type === 'reward' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleCopyReference(transaction.reference)}
                        className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                      >
                        <span className="font-mono text-sm">
                          {transaction.reference.substring(0, 8)}...
                        </span>
                        {copiedId === transaction.reference ? (
                          <Check size={14} className="text-green-600" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {transaction.metadata?.note || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
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
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{' '}
                <span className="font-medium">{filteredTransactions.length}</span> of{' '}
                <span className="font-medium">{transactions.length}</span> transactions
              </div>
              <div className="flex space-x-2">
                <button
                  disabled
                  className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-gray-50"
                >
                  Previous
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="card">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Transaction Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-100 rounded-full"></div>
            <span className="text-sm text-gray-600">Deposit/Reward (Incoming)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-100 rounded-full"></div>
            <span className="text-sm text-gray-600">Withdrawal/Fee (Outgoing)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-100 rounded-full"></div>
            <span className="text-sm text-gray-600">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-100 rounded-full"></div>
            <span className="text-sm text-gray-600">Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;