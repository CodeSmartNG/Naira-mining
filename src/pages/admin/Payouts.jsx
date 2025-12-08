import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, XCircle, Clock, DollarSign, User, Download, Send, AlertCircle, BarChart3 } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const AdminPayouts = () => {
  const [payouts, setPayouts] = useState([]);
  const [filteredPayouts, setFilteredPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [dateRange, setDateRange] = useState('all');
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [processNote, setProcessNote] = useState('');
  const [bulkAction, setBulkAction] = useState('');
  const [selectedPayouts, setSelectedPayouts] = useState([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    fetchPayouts();
  }, []);

  useEffect(() => {
    filterPayouts();
  }, [searchTerm, statusFilter, dateRange, payouts]);

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      
      // Mock data
      const mockPayouts = Array.from({ length: 50 }, (_, i) => {
        const statuses = ['pending', 'processing', 'completed', 'failed', 'cancelled'];
        const users = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'David Brown'];
        const banks = ['GTBank', 'Zenith Bank', 'Access Bank', 'First Bank', 'UBA'];
        
        return {
          id: `PAY${1000 + i}`,
          userId: 1000 + i,
          userName: users[i % 5],
          userEmail: `user${i + 1}@example.com`,
          amount: Math.floor(Math.random() * 500000) + 1000,
          bankName: banks[i % 5],
          accountNumber: `0${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          accountName: users[i % 5],
          status: statuses[i % 5],
          reference: `WDR${Math.floor(100000 + Math.random() * 900000)}`,
          initiatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          processedAt: i % 3 === 0 ? new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString() : null,
          processorId: i % 4 === 0 ? 'ADMIN001' : null,
          processorName: i % 4 === 0 ? 'System Admin' : null,
          failureReason: i % 10 === 0 ? 'Insufficient funds' : null,
          metadata: {
            note: i % 3 === 0 ? 'Regular withdrawal' : i % 3 === 1 ? 'Emergency withdrawal' : 'Scheduled payout'
          }
        };
      });
      
      setPayouts(mockPayouts);
      setFilteredPayouts(mockPayouts.filter(p => p.status === 'pending'));
    } catch (error) {
      toast.error('Failed to load payouts');
    } finally {
      setLoading(false);
    }
  };

  const filterPayouts = () => {
    let filtered = [...payouts];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.id.toLowerCase().includes(term) ||
        p.reference.toLowerCase().includes(term) ||
        p.userName.toLowerCase().includes(term) ||
        p.userEmail.toLowerCase().includes(term) ||
        p.accountNumber.includes(term)
      );
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
      }
      
      filtered = filtered.filter(p => new Date(p.initiatedAt) >= startDate);
    }

    setFilteredPayouts(filtered);
    setCurrentPage(1);
  };

  const handleProcessPayout = async (payoutId, action) => {
    if (action === 'reject' && !processNote.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPayouts(prev => prev.map(p =>
        p.id === payoutId
          ? {
              ...p,
              status: action === 'approve' ? 'processing' : 'failed',
              processedAt: new Date().toISOString(),
              processorId: 'ADMIN001',
              processorName: 'System Admin',
              failureReason: action === 'reject' ? processNote : null
            }
          : p
      ));
      
      setShowProcessModal(false);
      setProcessNote('');
      
      toast.success(`Payout ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      
    } catch (error) {
      toast.error('Failed to process payout');
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedPayouts.length === 0) {
      toast.error('Please select payouts and an action');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPayouts(prev => prev.map(p =>
        selectedPayouts.includes(p.id)
          ? {
              ...p,
              status: bulkAction === 'approve' ? 'processing' : bulkAction === 'reject' ? 'failed' : 'cancelled',
              processedAt: new Date().toISOString(),
              processorId: 'ADMIN001',
              processorName: 'System Admin',
              failureReason: bulkAction === 'reject' ? 'Bulk rejection' : null
            }
          : p
      ));
      
      setSelectedPayouts([]);
      setShowBulkModal(false);
      setBulkAction('');
      
      toast.success(`Processed ${selectedPayouts.length} payout(s)`);
      
    } catch (error) {
      toast.error('Failed to process bulk action');
    }
  };

  const handleSelectPayout = (payoutId) => {
    setSelectedPayouts(prev =>
      prev.includes(payoutId)
        ? prev.filter(id => id !== payoutId)
        : [...prev, payoutId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPayouts.length === paginatedPayouts.length) {
      setSelectedPayouts([]);
    } else {
      setSelectedPayouts(paginatedPayouts.map(p => p.id));
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'User', 'Amount', 'Bank', 'Account', 'Status', 'Reference', 'Initiated', 'Processed'];
    const csvData = filteredPayouts.map(p => [
      p.id,
      p.userName,
      formatCurrency(p.amount),
      p.bankName,
      p.accountNumber,
      p.status,
      p.reference,
      formatDate(p.initiatedAt),
      p.processedAt ? formatDate(p.processedAt) : 'Not processed'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payouts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Payouts exported successfully');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'processing':
        return <Clock size={16} className="text-blue-600" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-600" />;
      case 'failed':
        return <XCircle size={16} className="text-red-600" />;
      case 'cancelled':
        return <XCircle size={16} className="text-gray-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredPayouts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayouts = filteredPayouts.slice(startIndex, startIndex + itemsPerPage);

  // Stats
  const stats = {
    total: payouts.length,
    totalAmount: payouts.reduce((sum, p) => sum + p.amount, 0),
    pending: payouts.filter(p => p.status === 'pending').length,
    pendingAmount: payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    processing: payouts.filter(p => p.status === 'processing').length,
    completed: payouts.filter(p => p.status === 'completed').length,
    failed: payouts.filter(p => p.status === 'failed').length
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
          <h1 className="text-2xl font-bold text-gray-900">Payout Management</h1>
          <p className="text-gray-600">Process and monitor withdrawal requests</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="btn-secondary flex items-center space-x-2"
        >
          <Download size={20} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Payouts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.total.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign size={24} className="text-blue-600" />
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
              <BarChart3 size={24} className="text-green-600" />
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
              <p className="text-sm text-yellow-600 mt-1">
                {formatCurrency(stats.pendingAmount)}
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
              <p className="text-sm font-medium text-gray-500">Processing</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.processing.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Send size={24} className="text-blue-600" />
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
              <p className="text-sm font-medium text-gray-500">Failed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.failed.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <XCircle size={24} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedPayouts.length > 0 && (
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-medium text-blue-900">
                {selectedPayouts.length} payout(s) selected
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Total amount: {formatCurrency(
                  paginatedPayouts
                    .filter(p => selectedPayouts.includes(p.id))
                    .reduce((sum, p) => sum + p.amount, 0)
                )}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setBulkAction('approve');
                  setShowBulkModal(true);
                }}
                className="btn-primary bg-green-600 hover:bg-green-700"
              >
                <CheckCircle size={20} className="mr-2" />
                Approve Selected
              </button>
              <button
                onClick={() => {
                  setBulkAction('reject');
                  setShowBulkModal(true);
                }}
                className="btn-primary bg-red-600 hover:bg-red-700"
              >
                <XCircle size={20} className="mr-2" />
                Reject Selected
              </button>
              <button
                onClick={() => setSelectedPayouts([])}
                className="btn-secondary"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
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
                placeholder="ID, reference, user, account..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-field"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="label">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
              <option value="all">All Status</option>
            </select>
          </div>

          {/* Date Range */}
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
            </select>
          </div>

          {/* Quick Actions */}
          <div>
            <label className="label">Quick Filters</label>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setStatusFilter('pending');
                  setDateRange('all');
                  setSearchTerm('');
                }}
                className="btn-secondary flex-1"
              >
                Show Pending
              </button>
              <button
                onClick={() => {
                  setStatusFilter('failed');
                  setDateRange('all');
                  setSearchTerm('');
                }}
                className="btn-secondary flex-1"
              >
                Show Failed
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  <input
                    type="checkbox"
                    checked={selectedPayouts.length === paginatedPayouts.length && paginatedPayouts.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User & Bank
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
                  Initiated
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedPayouts.length > 0 ? (
                paginatedPayouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedPayouts.includes(payout.id)}
                        onChange={() => handleSelectPayout(payout.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="flex items-center">
                          <User size={14} className="text-gray-400 mr-2" />
                          <span className="font-medium text-gray-900">{payout.userName}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{payout.userEmail}</p>
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-900">{payout.bankName}</p>
                          <p className="text-xs text-gray-500">{payout.accountNumber}</p>
                          <p className="text-xs text-gray-400">{payout.accountName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-red-600">
                        -{formatCurrency(payout.amount)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(payout.status)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payout.status)}`}>
                          {payout.status}
                        </span>
                      </div>
                      {payout.processorName && (
                        <p className="text-xs text-gray-500 mt-1">
                          By: {payout.processorName}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-mono text-gray-700">{payout.reference}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {formatDate(payout.initiatedAt)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        {payout.status === 'pending' && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedPayout(payout);
                                setShowProcessModal(true);
                              }}
                              className="btn-primary text-xs py-1 px-3 bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle size={14} className="mr-1" />
                              Process
                            </button>
                          </>
                        )}
                        {payout.status === 'processing' && (
                          <button className="btn-secondary text-xs py-1 px-3">
                            <Send size={14} className="mr-1" />
                            Send
                          </button>
                        )}
                        <button className="text-primary-600 hover:text-primary-700 text-xs font-medium">
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center">
                    <div className="text-gray-500">
                      <p className="font-medium">No payouts found</p>
                      <p className="text-sm mt-1">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredPayouts.length > 0 && (
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(startIndex + itemsPerPage, filteredPayouts.length)}
                </span> of{' '}
                <span className="font-medium">{filteredPayouts.length}</span> payouts
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

      {/* Payout Processing Modal */}
      {showProcessModal && selectedPayout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Process Payout</h2>
                  <p className="text-gray-600">ID: {selectedPayout.id}</p>
                </div>
                <button
                  onClick={() => setShowProcessModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle size={20} />
                </button>
              </div>

              {/* Payout Details */}
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">{selectedPayout.userName}</p>
                  <p className="text-sm text-gray-600">{selectedPayout.userEmail}</p>
                  <div className="mt-3">
                    <p className="text-2xl font-bold text-red-600">
                      -{formatCurrency(selectedPayout.amount)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedPayout.bankName} • {selectedPayout.accountNumber}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Rejection Reason (if rejecting)
                  </label>
                  <textarea
                    value={processNote}
                    onChange={(e) => setProcessNote(e.target.value)}
                    placeholder="Explain why this payout is being rejected..."
                    className="input-field h-24"
                    rows={3}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => handleProcessPayout(selectedPayout.id, 'approve')}
                  className="btn-primary flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle size={20} className="mr-2" />
                  Approve Payout
                </button>
                <button
                  onClick={() => handleProcessPayout(selectedPayout.id, 'reject')}
                  className="btn-primary flex-1 bg-red-600 hover:bg-red-700"
                  disabled={!processNote.trim()}
                >
                  <XCircle size={20} className="mr-2" />
                  Reject Payout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Action Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Bulk Action</h2>
                  <p className="text-gray-600">
                    {selectedPayouts.length} payout(s) selected
                  </p>
                </div>
                <button
                  onClick={() => setShowBulkModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle size={20} />
                </button>
              </div>

              {/* Warning */}
              <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900">Are you sure?</p>
                    <p className="text-sm text-yellow-800 mt-1">
                      This action will {bulkAction} {selectedPayouts.length} payout(s).
                      This cannot be undone.
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Amount */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Total Amount</p>
                <p className="text-2xl font-bold text-red-600 mt-2">
                  {formatCurrency(
                    paginatedPayouts
                      .filter(p => selectedPayouts.includes(p.id))
                      .reduce((sum, p) => sum + p.amount, 0)
                  )}
                </p>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={handleBulkAction}
                  className="btn-primary flex-1"
                >
                  {bulkAction === 'approve' ? 'Approve All' : 'Reject All'}
                </button>
                <button
                  onClick={() => setShowBulkModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayouts;