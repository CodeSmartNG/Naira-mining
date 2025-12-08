import React, { useState, useEffect } from 'react';
import { CreditCard, Bank, ArrowUpRight, ArrowDownRight, Copy, Check, History } from 'lucide-react';
import { walletApi } from '../api';
import { formatCurrency, formatDate, copyToClipboard } from '../utils/formatters';
import DepositForm from '../components/wallet/DepositForm';
import WithdrawalForm from '../components/wallet/WithdrawalForm';
import TransactionList from '../components/wallet/TransactionList';
import toast from 'react-hot-toast';

const Wallet = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [balance, setBalance] = useState({ available: 0, locked: 0, pending: 0 });
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedRef, setCopiedRef] = useState('');

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const [balanceRes, transactionsRes, withdrawalsRes] = await Promise.all([
        walletApi.getBalance(),
        walletApi.getTransactions(),
        walletApi.getWithdrawalHistory()
      ]);
      
      setBalance(balanceRes.data || balanceRes);
      setTransactions(transactionsRes.items || transactionsRes.data || []);
      setWithdrawals(withdrawalsRes.items || withdrawalsRes.data || []);
    } catch (error) {
      toast.error('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReference = async (reference) => {
    await copyToClipboard(reference);
    setCopiedRef(reference);
    setTimeout(() => setCopiedRef(''), 2000);
    toast.success('Reference copied!');
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'deposit', label: 'Deposit' },
    { id: 'withdraw', label: 'Withdraw' },
    { id: 'history', label: 'Transaction History' },
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
        <p className="text-gray-600">Manage your funds and transactions</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Balance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Available Balance</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {formatCurrency(balance.available)}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <ArrowUpRight size={24} className="text-green-600" />
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('withdraw')}
                  className="w-full mt-4 btn-primary"
                >
                  Withdraw Funds
                </button>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Locked in Mining</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {formatCurrency(balance.locked)}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <CreditCard size={24} className="text-blue-600" />
                  </div>
                </div>
                <button
                  onClick={() => window.location.href = '/mining'}
                  className="w-full mt-4 btn-secondary"
                >
                  View Mining Locks
                </button>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pending Rewards</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {formatCurrency(balance.pending)}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Clock size={24} className="text-yellow-600" />
                  </div>
                </div>
                <button
                  onClick={() => window.location.href = '/mining?tab=rewards'}
                  className="w-full mt-4 btn-secondary"
                >
                  View Rewards
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('deposit')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <ArrowDownRight size={20} className="text-primary-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Deposit Funds</p>
                      <p className="text-sm text-gray-500">Add money to your wallet</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('withdraw')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <ArrowUpRight size={20} className="text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Withdraw Funds</p>
                      <p className="text-sm text-gray-500">Transfer to your bank</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => window.location.href = '/transactions'}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <History size={20} className="text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Transaction History</p>
                      <p className="text-sm text-gray-500">View all transactions</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
                <button
                  onClick={() => setActiveTab('history')}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  View All →
                </button>
              </div>
              <TransactionList transactions={transactions.slice(0, 5)} />
            </div>
          </div>
        )}

        {/* Deposit Tab */}
        {activeTab === 'deposit' && (
          <DepositForm onSuccess={fetchWalletData} />
        )}

        {/* Withdraw Tab */}
        {activeTab === 'withdraw' && (
          <WithdrawalForm
            balance={balance.available}
            onSuccess={fetchWalletData}
          />
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-6">All Transactions</h2>
              <TransactionList transactions={transactions} />
            </div>

            {withdrawals.length > 0 && (
              <div className="card">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Withdrawal History</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="table-header">Amount</th>
                        <th className="table-header">Bank Details</th>
                        <th className="table-header">Status</th>
                        <th className="table-header">Date</th>
                        <th className="table-header">Reference</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {withdrawals.map((withdrawal) => (
                        <tr key={withdrawal.id}>
                          <td className="table-cell font-medium">
                            {formatCurrency(withdrawal.amount)}
                          </td>
                          <td className="table-cell">
                            <div>
                              <p className="font-medium">{withdrawal.bankName}</p>
                              <p className="text-gray-500">{withdrawal.accountNumber}</p>
                            </div>
                          </td>
                          <td className="table-cell">
                            <span className={`
                              px-2 py-1 rounded-full text-xs font-medium
                              ${withdrawal.status === 'completed' ? 'bg-green-100 text-green-800' :
                                withdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                withdrawal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'}
                            `}>
                              {withdrawal.status}
                            </span>
                          </td>
                          <td className="table-cell">
                            {formatDate(withdrawal.createdAt)}
                          </td>
                          <td className="table-cell">
                            <button
                              onClick={() => handleCopyReference(withdrawal.id)}
                              className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                            >
                              <span className="font-mono text-sm">
                                {withdrawal.id.substring(0, 8)}...
                              </span>
                              {copiedRef === withdrawal.id ? (
                                <Check size={14} className="text-green-600" />
                              ) : (
                                <Copy size={14} />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;