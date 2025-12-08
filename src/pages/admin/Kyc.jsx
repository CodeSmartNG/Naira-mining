import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, Shield, Download } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const AdminKyc = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewNote, setReviewNote] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    filterSubmissions();
  }, [searchTerm, statusFilter, submissions]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      
      // Mock data
      const mockSubmissions = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        userId: i + 1000,
        userName: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'David Brown'][i % 5],
        userEmail: `user${i + 1}@example.com`,
        documentType: ['nin', 'driver_license', 'passport', 'voter_card'][Math.floor(Math.random() * 4)],
        documentNumber: `DOC${Math.floor(100000 + Math.random() * 900000)}`,
        status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)],
        submittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        frontImage: `https://example.com/front-${i + 1}.jpg`,
        backImage: Math.random() > 0.5 ? `https://example.com/back-${i + 1}.jpg` : null,
        selfieImage: `https://example.com/selfie-${i + 1}.jpg`,
        rejectionReason: Math.random() > 0.7 ? 'Document not clear' : null
      }));
      
      setSubmissions(mockSubmissions);
      setFilteredSubmissions(mockSubmissions.filter(s => s.status === 'pending'));
    } catch (error) {
      toast.error('Failed to load KYC submissions');
    } finally {
      setLoading(false);
    }
  };

  const filterSubmissions = () => {
    let filtered = [...submissions];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.userName.toLowerCase().includes(term) ||
        s.userEmail.toLowerCase().includes(term) ||
        s.documentNumber.toLowerCase().includes(term)
      );
    }

    setFilteredSubmissions(filtered);
  };

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setShowReviewModal(true);
  };

  const handleReview = async (status) => {
    if (status === 'rejected' && !reviewNote.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmissions(prev => prev.map(s =>
        s.id === selectedSubmission.id
          ? { 
              ...s, 
              status,
              rejectionReason: status === 'rejected' ? reviewNote : null,
              reviewedAt: new Date().toISOString()
            }
          : s
      ));
      
      setShowReviewModal(false);
      setReviewNote('');
      
      const action = status === 'approved' ? 'approved' : 'rejected';
      toast.success(`KYC submission ${action} successfully`);
      
    } catch (error) {
      toast.error('Failed to update KYC status');
    }
  };

  const getDocumentTypeLabel = (type) => {
    const types = {
      nin: 'National ID (NIN)',
      driver_license: "Driver's License",
      passport: 'International Passport',
      voter_card: "Voter's Card"
    };
    return types[type] || type;
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'approved':
        return { color: 'green', icon: CheckCircle, label: 'Approved' };
      case 'rejected':
        return { color: 'red', icon: XCircle, label: 'Rejected' };
      default:
        return { color: 'yellow', icon: Clock, label: 'Pending' };
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'User', 'Email', 'Document Type', 'Document Number', 'Status', 'Submitted', 'Reviewed'];
    const csvData = submissions.map(s => [
      s.id,
      s.userName,
      s.userEmail,
      getDocumentTypeLabel(s.documentType),
      s.documentNumber,
      s.status,
      formatDate(s.submittedAt),
      s.reviewedAt ? formatDate(s.reviewedAt) : 'Not reviewed'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kyc-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('KYC submissions exported successfully');
  };

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length
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
          <h1 className="text-2xl font-bold text-gray-900">KYC Verification</h1>
          <p className="text-gray-600">Review and verify user identity documents</p>
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
              <p className="text-sm font-medium text-gray-500">Total Submissions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.total}
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
              <p className="text-sm font-medium text-gray-500">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.pending}
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
              <p className="text-sm font-medium text-gray-500">Approved</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.approved}
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
              <p className="text-sm font-medium text-gray-500">Rejected</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.rejected}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <XCircle size={24} className="text-red-600" />
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
                placeholder="Search by name, email, or document number..."
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
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="all">All Status</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((submission) => {
                  const statusInfo = getStatusInfo(submission.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{submission.userName}</p>
                          <p className="text-sm text-gray-500">{submission.userEmail}</p>
                          <p className="text-xs text-gray-400">ID: {submission.userId}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm">{getDocumentTypeLabel(submission.documentType)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-mono text-sm">{submission.documentNumber}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <StatusIcon size={16} className={`text-${statusInfo.color}-600 mr-2`} />
                          <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}>
                            {statusInfo.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {formatDate(submission.submittedAt)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewSubmission(submission)}
                            className="btn-secondary text-xs py-1 px-3 flex items-center space-x-1"
                          >
                            <Eye size={14} />
                            <span>Review</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center">
                    <div className="text-gray-500">
                      <p className="font-medium">No KYC submissions found</p>
                      <p className="text-sm mt-1">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Review KYC Submission</h2>
                  <p className="text-gray-600">User: {selectedSubmission.userName}</p>
                </div>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle size={20} />
                </button>
              </div>

              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">User Information</label>
                    <div className="mt-2 space-y-1">
                      <p className="font-medium">{selectedSubmission.userName}</p>
                      <p className="text-sm text-gray-600">{selectedSubmission.userEmail}</p>
                      <p className="text-sm text-gray-500">User ID: {selectedSubmission.userId}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Document Information</label>
                    <div className="mt-2 space-y-1">
                      <p className="font-medium">{getDocumentTypeLabel(selectedSubmission.documentType)}</p>
                      <p className="text-sm text-gray-600">Number: {selectedSubmission.documentNumber}</p>
                      <p className="text-sm text-gray-500">
                        Submitted: {formatDate(selectedSubmission.submittedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Current Status</label>
                    <div className="mt-2">
                      <span className={`
                        inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                        ${selectedSubmission.status === 'approved' ? 'bg-green-100 text-green-800' :
                          selectedSubmission.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'}
                      `}>
                        {selectedSubmission.status === 'approved' ? (
                          <CheckCircle size={16} className="mr-1" />
                        ) : selectedSubmission.status === 'rejected' ? (
                          <XCircle size={16} className="mr-1" />
                        ) : (
                          <Clock size={16} className="mr-1" />
                        )}
                        {selectedSubmission.status.charAt(0).toUpperCase() + selectedSubmission.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  {selectedSubmission.rejectionReason && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Rejection Reason</label>
                      <p className="mt-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                        {selectedSubmission.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Document Images */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Document Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Front Side</p>
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 h-48 flex items-center justify-center">
                      <div className="text-center">
                        <Shield size={40} className="text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Front Document Image</p>
                        <button className="mt-2 text-primary-600 hover:text-primary-700 text-sm">
                          View Full Size
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Selfie</p>
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 h-48 flex items-center justify-center">
                      <div className="text-center">
                        <Shield size={40} className="text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Selfie Image</p>
                        <button className="mt-2 text-primary-600 hover:text-primary-700 text-sm">
                          View Full Size
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {selectedSubmission.backImage && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Back Side</p>
                      <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 h-48 flex items-center justify-center">
                        <div className="text-center">
                          <Shield size={40} className="text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Back Document Image</p>
                          <button className="mt-2 text-primary-600 hover:text-primary-700 text-sm">
                            View Full Size
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Review Form */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Review Decision</h3>
                
                <div className="space-y-4">
                  {selectedSubmission.status !== 'approved' && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2">Rejection Reason (Required if rejecting)</label>
                      <textarea
                        value={reviewNote}
                        onChange={(e) => setReviewNote(e.target.value)}
                        placeholder="Explain why the KYC is being rejected..."
                        className="input-field h-32"
                        rows={4}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Provide clear instructions for the user to resubmit
                      </p>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleReview('approved')}
                      className="btn-primary flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle size={20} />
                      <span>Approve KYC</span>
                    </button>
                    
                    <button
                      onClick={() => handleReview('rejected')}
                      className="btn-primary flex items-center space-x-2 bg-red-600 hover:bg-red-700"
                      disabled={!reviewNote.trim()}
                    >
                      <XCircle size={20} />
                      <span>Reject KYC</span>
                    </button>
                    
                    <button
                      onClick={() => setShowReviewModal(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminKyc;