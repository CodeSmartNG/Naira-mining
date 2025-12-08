import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Eye, Edit, Shield, Ban, CheckCircle, XCircle, Download } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [kycFilter, setKycFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, statusFilter, kycFilter, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Mock data
      const mockUsers = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        firstName: ['John', 'Jane', 'Mike', 'Sarah', 'David'][i % 5],
        lastName: ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown'][i % 5],
        email: `user${i + 1}@example.com`,
        phone: `080${Math.floor(10000000 + Math.random() * 90000000)}`,
        balance: Math.floor(Math.random() * 1000000) + 10000,
        locked: Math.floor(Math.random() * 500000),
        kycStatus: ['verified', 'pending', 'unverified', 'rejected'][Math.floor(Math.random() * 4)],
        isActive: Math.random() > 0.1,
        isAdmin: i < 3,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      }));
      
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.phone.includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => 
        statusFilter === 'active' ? user.isActive : !user.isActive
      );
    }

    // KYC filter
    if (kycFilter !== 'all') {
      filtered = filtered.filter(user => user.kycStatus === kycFilter);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleToggleStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, isActive: !user.isActive }
        : user
    ));
    
    const user = users.find(u => u.id === userId);
    toast.success(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Balance', 'KYC Status', 'Status', 'Joined Date'];
    const csvData = filteredUsers.map(user => [
      user.id,
      `${user.firstName} ${user.lastName}`,
      user.email,
      user.phone,
      formatCurrency(user.balance),
      user.kycStatus,
      user.isActive ? 'Active' : 'Inactive',
      formatDate(user.createdAt)
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Users exported successfully');
  };

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

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
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage all platform users and accounts</p>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {users.length.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Shield size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {users.filter(u => u.isActive).length.toLocaleString()}
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
              <p className="text-sm font-medium text-gray-500">KYC Verified</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {users.filter(u => u.kycStatus === 'verified').length.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Shield size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending KYC</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {users.filter(u => u.kycStatus === 'pending').length.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Shield size={24} className="text-yellow-600" />
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
                placeholder="Search users by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-field"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* KYC Filter */}
            <div className="flex items-center space-x-2">
              <select
                value={kycFilter}
                onChange={(e) => setKycFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All KYC Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="unverified">Unverified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
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
                  KYC Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-600">
                              {user.firstName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                              {user.isAdmin && (
                                <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                                  Admin
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <p className="text-xs text-gray-400">{user.phone}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium">{formatCurrency(user.balance)}</p>
                        <p className="text-xs text-gray-500">
                          Locked: {formatCurrency(user.locked)}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`
                        px-2 py-1 text-xs font-medium rounded-full
                        ${user.kycStatus === 'verified' ? 'bg-green-100 text-green-800' :
                          user.kycStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          user.kycStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'}
                      `}>
                        {user.kycStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`
                        px-2 py-1 text-xs font-medium rounded-full
                        ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      `}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title={user.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {user.isActive ? <Ban size={16} /> : <CheckCircle size={16} />}
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center">
                    <div className="text-gray-500">
                      <p className="font-medium">No users found</p>
                      <p className="text-sm mt-1">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(startIndex + itemsPerPage, filteredUsers.length)}
                </span> of{' '}
                <span className="font-medium">{filteredUsers.length}</span> users
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

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-primary-600">
                      {selectedUser.firstName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h2>
                    <p className="text-gray-600">{selectedUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle size={20} />
                </button>
              </div>

              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone Number</label>
                    <p className="mt-1">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Account Type</label>
                    <p className="mt-1">
                      <span className={`
                        px-2 py-1 text-xs font-medium rounded-full
                        ${selectedUser.isAdmin 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'}
                      `}>
                        {selectedUser.isAdmin ? 'Administrator' : 'Standard User'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Joined Date</label>
                    <p className="mt-1">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Account Status</label>
                    <p className="mt-1">
                      <span className={`
                        px-2 py-1 text-xs font-medium rounded-full
                        ${selectedUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      `}>
                        {selectedUser.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">KYC Status</label>
                    <p className="mt-1">
                      <span className={`
                        px-2 py-1 text-xs font-medium rounded-full
                        ${selectedUser.kycStatus === 'verified' ? 'bg-green-100 text-green-800' :
                          selectedUser.kycStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          selectedUser.kycStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'}
                      `}>
                        {selectedUser.kycStatus}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Login</label>
                    <p className="mt-1">{formatDate(selectedUser.lastLogin)}</p>
                  </div>
                </div>
              </div>

              {/* Financial Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Financial Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Total Balance</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {formatCurrency(selectedUser.balance)}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Locked in Mining</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {formatCurrency(selectedUser.locked)}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Available Balance</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {formatCurrency(selectedUser.balance - selectedUser.locked)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-3">
                  <button className="btn-primary flex items-center space-x-2">
                    <Eye size={20} />
                    <span>View Transactions</span>
                  </button>
                  <button
                    onClick={() => handleToggleStatus(selectedUser.id)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    {selectedUser.isActive ? <Ban size={20} /> : <CheckCircle size={20} />}
                    <span>{selectedUser.isActive ? 'Deactivate' : 'Activate'}</span>
                  </button>
                  <button className="btn-secondary flex items-center space-x-2">
                    <Edit size={20} />
                    <span>Edit User</span>
                  </button>
                  <button className="btn-secondary">
                    Reset Password
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

export default AdminUsers;