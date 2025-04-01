
// Format date to YYYY-MM-DD
export const formatDateForInput = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

// Format date to display format (e.g., Wed, Jan 15, 2023)
export const formatDateForDisplay = (dateString) => {
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Get date range between two dates
export const getDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates = [];
  
  let currentDate = new Date(start);
  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

// Get current date in YYYY-MM-DD format
export const getCurrentDate = () => {
  return formatDateForInput(new Date());
};

// Get date that is offset by days from current date
export const getOffsetDate = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDateForInput(date);
};
