import React, { createContext, useState, useContext, useEffect } from 'react';
import { walletApi } from '../api';
import { useAuth } from './AuthContext';

const WalletContext = createContext({});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState({
    available: 0,
    locked: 0,
    pending: 0,
    total: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWalletData();
    }
  }, [isAuthenticated]);

  const fetchWalletData = async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      const [balanceRes, transactionsRes] = await Promise.all([
        walletApi.getBalance(),
        walletApi.getTransactions(1, 10)
      ]);
      
      setBalance(balanceRes.data || balanceRes);
      setTransactions(transactionsRes.items || transactionsRes.data || []);
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBalance = async () => {
    try {
      const response = await walletApi.getBalance();
      setBalance(response.data || response);
      return response.data || response;
    } catch (error) {
      console.error('Failed to refresh balance:', error);
      throw error;
    }
  };

  const addTransaction = (transaction) => {
    setTransactions(prev => [transaction, ...prev]);
  };

  const updateBalance = (type, amount) => {
    setBalance(prev => {
      const newBalance = { ...prev };
      if (type === 'deposit' || type === 'reward') {
        newBalance.available += amount;
        newBalance.total += amount;
      } else if (type === 'withdrawal' || type === 'fee') {
        newBalance.available -= amount;
        newBalance.total -= amount;
      } else if (type === 'lock') {
        newBalance.available -= amount;
        newBalance.locked += amount;
      } else if (type === 'unlock') {
        newBalance.available += amount;
        newBalance.locked -= amount;
      }
      return newBalance;
    });
  };

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        isLoading,
        refreshBalance,
        fetchWalletData,
        addTransaction,
        updateBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};