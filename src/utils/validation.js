export const validateTransactionTitle = (val) => {
  if (!val) return '';
  const hasNumbers = /[0-9]/.test(val);
  const hasSpecialChars = /[^a-zA-Z0-9\s]/.test(val);
  
  if (hasNumbers && hasSpecialChars) {
    return 'No numbers or symbols allowed.';
  } else if (hasNumbers) {
    return 'No numbers allowed.';
  } else if (hasSpecialChars) {
    return 'No symbols allowed.';
  }
  
  if (val.length >= 25) {
    return 'Max 25 characters limit reached.';
  }
  return '';
};
