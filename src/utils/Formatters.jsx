export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat('en-NG').format(number);
};

export const calculateDailyReward = (principal, interestRate = 0.05, days = 30) => {
  const dailyRate = interestRate / days;
  const dailyReward = principal * dailyRate;
  return Math.floor(dailyReward * 100) / 100; // Round to 2 decimal places
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};