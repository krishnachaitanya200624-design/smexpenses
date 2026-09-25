/**
 * Currency formatting utility
 */
export const formatCurrency = (amount, symbol = '₹', currencyCode = 'INR') => {
  const numeric = Number(amount) || 0;

  try {
    if (currencyCode === 'INR' || symbol === '₹') {
      return (
        symbol +
        numeric.toLocaleString('en-IN', {
          maximumFractionDigits: 2,
          minimumFractionDigits: 0,
        })
      );
    }

    return (
      symbol +
      numeric.toLocaleString('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      })
    );
  } catch (e) {
    return `${symbol}${numeric}`;
  }
};
