import React, { useState, useEffect } from 'react';
import { X, Lock, TrendingUp, Calendar, AlertCircle, Loader } from 'lucide-react';
import { miningApi, walletApi } from '../../api';
import { formatCurrency, calculateDailyReward } from '../../utils/formatters';
import toast from 'react-hot-toast';

const StartMiningModal = ({ onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState(30);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [estimatedReward, setEstimatedReward] = useState(0);
  const [dailyReward, setDailyReward] = useState(0);

  useEffect(() => {
    fetchBalance();
  }, []);

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      calculateRewards();
    }
  }, [amount, period]);

  const fetchBalance = async () => {
    try {
      const response = await walletApi.getBalance();
      setBalance(response.data?.available || response.available || 0);
    } catch (error) {
      console.error('Failed to fetch balance');
    }
  };

  const calculateRewards = () => {
    setCalculating(true);
    const principal = parseFloat(amount) || 0;
    const interestRate = 0.05; // 5%
    
    const totalReward = principal * interestRate;
    const daily = totalReward / period;
    
    setEstimatedReward(totalReward);
    setDailyReward(daily);
    setTimeout(() => setCalculating(false), 300);
  };

  const quickAmounts = [5000, 10000, 50000, 100000, 500000];

  const handleAmountSelect = (quickAmount) => {
    setAmount(quickAmount.toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) < 1000) {
      toast.error('Minimum mining amount is ₦1,000');
      return;
    }
    
    if (parseFloat(amount) > balance) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      setLoading(true);
      const response = await miningApi.createLock(parseFloat(amount), period);
      
      toast.success('Mining lock created successfully!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create mining lock');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Lock size={24} className="text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Start Mining</h2>
                <p className="text-sm text-gray-600">Lock funds to earn daily rewards</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Available Balance */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-900">Available Balance:</span>
                <span className="text-lg font-bold text-blue-900">
                  {formatCurrency(balance)}
                </span>
              </div>
            </div>

            {/* Amount Input */}
            <div className="mb-6">
              <label htmlFor="amount" className="label">
                Amount to Lock (₦)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1000"
                step="1000"
                className="input-field text-lg font-medium"
                placeholder="Enter amount"
                required
              />
              <p className="text-sm text-gray-500 mt-2">Minimum: ₦1,000</p>

              {/* Quick Amounts */}
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Quick Select:</p>
                <div className="flex flex-wrap gap-2">
                  {quickAmounts.map((quickAmount) => (
                    <button
                      key={quickAmount}
                      type="button"
                      onClick={() => handleAmountSelect(quickAmount)}
                      className={`
                        px-3 py-1.5 rounded-lg border text-sm font-medium
                        ${amount === quickAmount.toString()
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }
                      `}
                    >
                      {formatCurrency(quickAmount)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Period Selection */}
            <div className="mb-6">
              <label className="label mb-3">Mining Period</label>
              <div className="grid grid-cols-2 gap-4">
                {[30, 60, 90].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setPeriod(days)}
                    className={`
                      p-4 border rounded-lg text-center
                      ${period === days
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400'
                      }
                    `}
                  >
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <Calendar size={20} className={period === days ? 'text-primary-600' : 'text-gray-400'} />
                      <span className={`font-medium ${period === days ? 'text-primary-600' : 'text-gray-700'}`}>
                        {days} Days
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{days === 30 ? '5% reward' : days === 60 ? '10% reward' : '15% reward'}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Reward Calculation */}
            {amount && parseFloat(amount) > 0 && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-900 mb-3">Reward Calculation</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-green-800">Principal Amount:</span>
                    <span className="font-medium">{formatCurrency(parseFloat(amount))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-800">Interest Rate:</span>
                    <span className="font-medium">{period === 30 ? '5%' : period === 60 ? '10%' : '15%'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-800">Total Reward:</span>
                    <span className="font-medium">
                      {calculating ? 'Calculating...' : formatCurrency(estimatedReward)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-800">Daily Reward:</span>
                    <span className="font-medium">
                      {calculating ? '...' : formatCurrency(dailyReward)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-green-200 pt-2">
                    <span className="font-medium text-green-900">Total at Maturity:</span>
                    <span className="font-bold text-lg text-green-900">
                      {calculating ? '...' : formatCurrency(parseFloat(amount) + estimatedReward)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Important Notes */}
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-900">Important Information</p>
                  <ul className="mt-2 space-y-1 text-yellow-800">
                    <li>• Funds are locked for the selected period</li>
                    <li>• Rewards accrue daily and are paid at maturity</li>
                    <li>• Early withdrawal is not allowed</li>
                    <li>• Rewards are subject to terms and conditions</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !amount || parseFloat(amount) < 1000}
                className="flex-1 btn-primary flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    <span>Creating Lock...</span>
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    <span>Start Mining</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StartMiningModal;