// email validation
export const validateEmail = (email) => {
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return regex.test(email);
};

// password validation (min 8 chars)
export const validatePassword = (password) => {
  return password && password.length >= 8;
};

// amount validation for top up
export const validateTopUpAmount = (amount) => {
  const numAmount = Number(amount);
  return numAmount >= 10000 && numAmount <= 1000000;
};

// file size validation (max 100KB)
export const validateFileSize = (file, maxSizeKB = 100) => {
  return file.size <= maxSizeKB * 1024;
};

// image file type validation
export const validateImageType = (file) => {
  return file.type.startsWith('image/');
};

// currency formatter
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// date formatter
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};