/**
 * Calculates maturity amount based on principal, rate, tenure, and compounding frequency.
 * Returns both maturity amount and maturity date.
 */
export const calculateMaturity = (principal, rate, tenureMonths, startDate, frequency = 'Yearly') => {
  if (!principal || !rate || !tenureMonths || !startDate) {
    return { amount: 0, date: null };
  }

  // Convert string to Date
  const start = new Date(startDate);
  
  // Calculate maturity date
  const maturityDate = new Date(start);
  maturityDate.setMonth(start.getMonth() + Number(tenureMonths));

  // Determine compounding per year
  let n = 1; // Yearly by default
  if (frequency === 'Monthly') n = 12;
  if (frequency === 'Quarterly') n = 4;
  if (frequency === 'Half-Yearly') n = 2;

  // Calculate maturity amount: A = P(1 + r/n)^(nt)
  const p = Number(principal);
  const r = Number(rate) / 100;
  const t = Number(tenureMonths) / 12;

  const amount = p * Math.pow((1 + r / n), n * t);

  return {
    amount: amount.toFixed(2),
    date: maturityDate.toISOString().split('T')[0] // return YYYY-MM-DD
  };
};
