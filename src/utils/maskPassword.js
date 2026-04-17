/**
 * Masks a password returning dots or asterisks
 */
export const maskPassword = (password) => {
  if (!password) return '';
  return '•'.repeat(password.length);
};
