import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Lock, TrendingUp, Clock, PlusCircle, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { walletApi, miningApi } from '../api';
import { formatCurrency, formatDate } from '../utils/formatters';
import BalanceCard from '../components/dashboard/BalanceCard';
import MiningLockCard from '../components/dashboard/MiningLockCard';
import TransactionHistory from '../components/dashboard/TransactionHistory';
import StartMiningModal from '../components/mining/StartMiningModal';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [balance, setBalance] = useState({ available: 0, locked: 0, pending: 0, total: 0 });
  const [locks, setLocks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ totalLocked: 0, totalEarned: 0, activeLocks: 0 });
  const [loading, setLoading] = useState(true);
  const [showMiningModal, setShowMiningModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [balanceRes, locksRes, transactionsRes, statsRes] = await Promise.all([
        walletApi.getBalance(),
        miningApi.getLocks('active'),
        walletApi.getTransactions(1, 5),
        miningApi.getMiningStats()
      ]);
      
      setBalance(balanceRes.data || balanceRes);
      setLocks(locksRes.data || locksRes);
      setTransactions(transactionsRes.items || transactionsRes.data || []);
      setStats(statsRes.data || statsRes);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
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
      {/* Welcome Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Track your mining progress and earnings</p>
        </div>
        <button
          onClick={() => setShowMiningModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusCircle size={20} />
          <span>Start Mining</span>
        </button>
      </div>

      {/* Balance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <BalanceCard
          title="Available Balance"
          amount={balance.available}
          icon="wallet"
          color="green"
          subtitle="Ready to use"
          action={{
            label: 'Deposit',
            onClick: () => window.location.href = '/wallet?tab=deposit'
          }}
        />
        
        <BalanceCard
          title="Locked in Mining"
          amount={balance.locked}
          icon="lock"
          color="blue"
          subtitle={`${stats.activeLocks} active locks`}
          action={{
            label: 'View All',
            onClick: () => window.location.href = '/mining'
          }}
        />
        
        <BalanceCard
          title="Pending Rewards"
          amount={balance.pending}
          icon="clock"
          color="yellow"
          subtitle="Accruing daily"
          action={{
            label: 'View Rewards',
            onClick: () => window.location.href = '/mining?tab=rewards'
          }}
        />
        
        <BalanceCard
          title="Total Earned"
          amount={stats.totalEarned || 0}
          icon="trend"
          color="purple"
          subtitle="All time earnings"
          action={{
            label: 'Withdraw',
            onClick: () => window.location.href = '/wallet?tab=withdraw'
          }}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Daily Earnings</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency((balance.locked * 0.05) / 30)}
              </p>
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <TrendingUp size={16} className="mr-1" />
                Estimated daily rate
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Activity size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Mining Locks</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {locks.length}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {balance.locked > 0 ? `${formatCurrency(balance.locked)} locked` : 'No active locks'}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Lock size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Next Payout</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {locks.length > 0 ? formatDate(locks[0]?.endDate) : 'N/A'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {locks.length > 0 ? `${formatCurrency(balance.pending)} pending` : 'No pending payouts'}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Clock size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Mining Locks */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Active Mining Locks</h2>
          <Link to="/mining" className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </Link>
        </div>
        
        {locks.length > 0 ? (
          <div className="space-y-4">
            {locks.slice(0, 3).map((lock) => (
              <MiningLockCard key={lock.id} lock={lock} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Lock size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Mining Locks</h3>
            <p className="text-gray-600 mb-4">Start mining to earn daily rewards</p>
            <button
              onClick={() => setShowMiningModal(true)}
              className="btn-primary"
            >
              Start Your First Mining Lock
            </button>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
          <Link to="/transactions" className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </Link>
        </div>
        <TransactionHistory transactions={transactions} limit={5} />
      </div>

      {/* Start Mining Modal */}
      {showMiningModal && (
        <StartMiningModal
          onClose={() => setShowMiningModal(false)}
          onSuccess={() => {
            fetchDashboardData();
            toast.success('Mining lock created successfully!');
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;