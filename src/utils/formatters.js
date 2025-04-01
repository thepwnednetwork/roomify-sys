
// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Format booking status
export const formatStatus = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};
