import React, { useState, useEffect } from 'react';
import { Cpu, Lock, TrendingUp, Clock, Calendar, BarChart3, PlusCircle, AlertCircle } from 'lucide-react';
import { miningApi } from '../api';
import { formatCurrency, formatDate } from '../utils/formatters';
import MiningLockCard from '../components/mining/MiningLockCard';
import StartMiningModal from '../components/mining/StartMiningModal';
import toast from 'react-hot-toast';

const Mining = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [locks, setLocks] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [stats, setStats] = useState({
    totalLocked: 0,
    totalEarned: 0,
    activeLocks: 0,
    estimatedMonthlyEarnings: 0
  });
  const [loading, setLoading] = useState(true);
  const [showStartModal, setShowStartModal] = useState(false);

  useEffect(() => {
    fetchMiningData();
  }, []);

  const fetchMiningData = async () => {
    try {
      setLoading(true);
      const [locksRes, rewardsRes, statsRes] = await Promise.all([
        miningApi.getLocks(),
        miningApi.getDailyRewards(),
        miningApi.getMiningStats()
      ]);
      
      setLocks(locksRes.data || locksRes);
      setRewards(rewardsRes.items || rewardsRes.data || []);
      setStats(statsRes.data || statsRes);
    } catch (error) {
      toast.error('Failed to load mining data');
    } finally {
      setLoading(false);
    }
  };

  const activeLocks = locks.filter(lock => lock.status === 'active');
  const completedLocks = locks.filter(lock => lock.status === 'completed');
  const cancelledLocks = locks.filter(lock => lock.status === 'cancelled');

  const tabs = [
    { id: 'active', label: 'Active Locks', count: activeLocks.length },
    { id: 'completed', label: 'Completed', count: completedLocks.length },
    { id: 'rewards', label: 'Daily Rewards', count: rewards.length },
    { id: 'stats', label: 'Statistics' },
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
          <h1 className="text-2xl font-bold text-gray-900">Mining</h1>
          <p className="text-gray-600">Lock funds to earn daily rewards</p>
        </div>
        <button
          onClick={() => setShowStartModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusCircle size={20} />
          <span>Start Mining</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Locked</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(stats.totalLocked)}
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
              <p className="text-sm font-medium text-gray-500">Total Earned</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(stats.totalEarned)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Locks</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.activeLocks}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Cpu size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Est. Monthly</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(stats.estimatedMonthlyEarnings)}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Calendar size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-2 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* Active Locks Tab */}
        {activeTab === 'active' && (
          <div>
            {activeLocks.length > 0 ? (
              <div className="space-y-4">
                {activeLocks.map((lock) => (
                  <MiningLockCard key={lock.id} lock={lock} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Lock size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Mining Locks</h3>
                <p className="text-gray-600 mb-6">Start mining to earn daily rewards</p>
                <button
                  onClick={() => setShowStartModal(true)}
                  className="btn-primary"
                >
                  Start Mining
                </button>
              </div>
            )}
          </div>
        )}

        {/* Completed Locks Tab */}
        {activeTab === 'completed' && (
          <div>
            {completedLocks.length > 0 ? (
              <div className="space-y-4">
                {completedLocks.map((lock) => (
                  <div key={lock.id} className="card">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Lock size={20} className="text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {formatCurrency(lock.principalAmount)} Lock
                            </p>
                            <p className="text-sm text-gray-500">
                              Completed on {formatDate(lock.endDate)}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-sm text-gray-500">Principal</p>
                            <p className="font-medium">{formatCurrency(lock.principalAmount)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total Reward</p>
                            <p className="font-medium text-green-600">{formatCurrency(lock.totalReward)}</p>
                          </div>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        Completed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Completed Locks</h3>
                <p className="text-gray-600">Your active locks will appear here when completed</p>
              </div>
            )}
          </div>
        )}

        {/* Daily Rewards Tab */}
        {activeTab === 'rewards' && (
          <div>
            {rewards.length > 0 ? (
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Day
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rewards.map((reward) => (
                      <tr key={reward.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(reward.accrualDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Day {reward.dayNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          +{formatCurrency(reward.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`
                            px-2 py-1 text-xs font-medium rounded-full
                            ${reward.status === 'credited' 
                              ? 'bg-green-100 text-green-800'
                              : reward.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                            }
                          `}>
                            {reward.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Rewards Yet</h3>
                <p className="text-gray-600 mb-6">Start mining to earn daily rewards</p>
                <button
                  onClick={() => setShowStartModal(true)}
                  className="btn-primary"
                >
                  Start Mining
                </button>
              </div>
            )}
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Mining Performance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Average Lock Duration</span>
                    <span className="font-medium">45 days</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Average Lock Size</span>
                    <span className="font-medium">{formatCurrency(25000)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-medium text-green-600">100%</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Total Transactions</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Locks Completed</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Daily Average Reward</span>
                    <span className="font-medium text-green-600">{formatCurrency(416.67)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Reward Projection</h2>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <BarChart3 size={20} className="text-blue-600" />
                    <h3 className="font-medium text-blue-900">Based on current locks</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg">
                      <p className="text-sm text-gray-500">Next 7 Days</p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(stats.estimatedMonthlyEarnings / 4)}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <p className="text-sm text-gray-500">Next 30 Days</p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(stats.estimatedMonthlyEarnings)}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <p className="text-sm text-gray-500">Next 90 Days</p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(stats.estimatedMonthlyEarnings * 3)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start space-x-3">
                <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Important Information</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Rewards are calculated daily and credited at lock maturity</li>
                    <li>• Early withdrawal from mining locks is not allowed</li>
                    <li>• Rewards are subject to platform terms and conditions</li>
                    <li>• Past performance does not guarantee future results</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Start Mining Modal */}
      {showStartModal && (
        <StartMiningModal
          onClose={() => setShowStartModal(false)}
          onSuccess={() => {
            fetchMiningData();
            toast.success('Mining lock created successfully!');
          }}
        />
      )}
    </div>
  );
};

export default Mining;