import React, { useState } from 'react';
import { CreditCard, Bank, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { walletApi } from '../../api';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

const DepositForm = ({ onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');

  const quickAmounts = [1000, 5000, 10000, 50000, 100000];

  const handleAmountSelect = (quickAmount) => {
    setAmount(quickAmount.toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) < 100) {
      toast.error('Minimum deposit is ₦100');
      return;
    }

    try {
      setLoading(true);
      const userEmail = JSON.parse(localStorage.getItem('user'))?.email;
      
      const response = await walletApi.initializeDeposit(
        parseFloat(amount),
        userEmail
      );
      
      setPaymentUrl(response.data.authorizationUrl);
      
      // Open payment in new tab
      window.open(response.data.authorizationUrl, '_blank');
      
      toast.success('Redirecting to payment gateway...');
      
      // Start polling for payment verification
      startPaymentVerification(response.data.reference);
      
    } catch (error) {
      toast.error('Failed to initialize deposit');
      setLoading(false);
    }
  };

  const startPaymentVerification = async (reference) => {
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes (5 seconds interval)
    
    const interval = setInterval(async () => {
      attempts++;
      
      try {
        const response = await walletApi.verifyDeposit(reference);
        
        if (response.data.status === 'completed') {
          clearInterval(interval);
          toast.success('Deposit successful!');
          setLoading(false);
          setAmount('');
          setPaymentUrl('');
          if (onSuccess) onSuccess();
        } else if (response.data.status === 'failed') {
          clearInterval(interval);
          toast.error('Payment failed');
          setLoading(false);
        }
      } catch (error) {
        // Silent error for polling
      }
      
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        toast.error('Payment verification timeout');
        setLoading(false);
      }
    }, 5000); // Check every 5 seconds
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Deposit Funds</h2>
        <p className="text-gray-600 mb-6">Add money to your wallet to start mining</p>
        
        {/* Payment Methods */}
        <div className="mb-6">
          <p className="label mb-3">Select Payment Method</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setSelectedMethod('card')}
              className={`
                p-4 border rounded-lg flex items-center space-x-3
                ${selectedMethod === 'card'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
                }
              `}
            >
              <div className="p-2 bg-primary-100 rounded-lg">
                <CreditCard size={24} className="text-primary-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Card Payment</p>
                <p className="text-sm text-gray-500">Visa, Mastercard, Verve</p>
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => setSelectedMethod('bank')}
              className={`
                p-4 border rounded-lg flex items-center space-x-3
                ${selectedMethod === 'bank'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
                }
              `}
            >
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bank size={24} className="text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Bank Transfer</p>
                <p className="text-sm text-gray-500">Direct bank transfer</p>
              </div>
            </button>
          </div>
        </div>
        
        {/* Amount Selection */}
        <div className="mb-6">
          <label htmlFor="amount" className="label">
            Amount (₦)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="100"
            step="100"
            className="input-field text-lg font-medium"
            placeholder="Enter amount"
          />
          <p className="text-sm text-gray-500 mt-2">Minimum: ₦100</p>
          
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
                    px-4 py-2 rounded-lg border text-sm font-medium
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
        
        {/* Payment Info */}
        {selectedMethod === 'bank' && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle size={20} className="text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Bank Transfer Instructions</p>
                <div className="mt-2 space-y-2 text-sm text-blue-800">
                  <p>1. Transfer to: <span className="font-mono font-bold">BABBAN LTD</span></p>
                  <p>2. Account Number: <span className="font-mono font-bold">0123456789</span></p>
                  <p>3. Bank: <span className="font-mono font-bold">Guaranty Trust Bank</span></p>
                  <p>4. Use your email as payment reference</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Fees & Processing */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Deposit Amount:</span>
              <span className="font-medium">{formatCurrency(parseFloat(amount) || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Processing Fee:</span>
              <span className="font-medium">₦0.00</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2">
              <span className="font-medium">Total to Pay:</span>
              <span className="font-bold text-lg">{formatCurrency(parseFloat(amount) || 0)}</span>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !amount || parseFloat(amount) < 100}
          className="w-full btn-primary flex items-center justify-center space-x-2 py-3 text-lg"
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CreditCard size={20} />
              <span>Proceed to Payment</span>
            </>
          )}
        </button>
        
        {/* Security Notice */}
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <CheckCircle size={20} className="text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">Secure Payment</p>
              <p className="text-sm text-green-800 mt-1">
                Your payment is processed securely via Paystack. We never store your card details.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* If payment URL exists, show redirect message */}
      {paymentUrl && (
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <AlertCircle size={20} className="text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-900">Payment in Progress</p>
              <p className="text-sm text-yellow-800">
                Please complete your payment in the new tab. Keep this window open.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepositForm;