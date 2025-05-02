export const truncateAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatBalance = (balance: string): string => {
  const parsedBalance = parseFloat(balance);
  if (isNaN(parsedBalance)) return '0.00';
  
  if (parsedBalance < 0.001 && parsedBalance > 0) {
    return '< 0.001';
  }
  
  return parsedBalance.toFixed(4);
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};