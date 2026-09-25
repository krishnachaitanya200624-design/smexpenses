/**
 * Computes fair debt simplification settlements for an expense group
 * @param {Array<string>} members
 * @param {Array<Object>} expenses - [{ description, amount, paidBy, splitAmong }]
 * @returns {Object} { balances, settlements, totalGroupSpend }
 */
function calculateGroupSettlements(members = [], expenses = []) {
  const netBalances = {};
  const totalPaidMap = {};
  const totalShareMap = {};

  // Initialize members
  members.forEach((m) => {
    netBalances[m] = 0;
    totalPaidMap[m] = 0;
    totalShareMap[m] = 0;
  });

  let totalGroupSpend = 0;

  // Process each expense
  expenses.forEach((exp) => {
    const amount = Number(exp.amount) || 0;
    const paidBy = exp.paidBy;
    const splitAmong = exp.splitAmong && exp.splitAmong.length > 0 ? exp.splitAmong : members;

    if (amount <= 0 || !paidBy || splitAmong.length === 0) return;

    totalGroupSpend += amount;

    // Credit payer
    if (netBalances[paidBy] === undefined) {
      netBalances[paidBy] = 0;
      totalPaidMap[paidBy] = 0;
      totalShareMap[paidBy] = 0;
    }
    netBalances[paidBy] += amount;
    totalPaidMap[paidBy] += amount;

    // Debit each participant
    const sharePerPerson = amount / splitAmong.length;
    splitAmong.forEach((participant) => {
      if (netBalances[participant] === undefined) {
        netBalances[participant] = 0;
        totalPaidMap[participant] = 0;
        totalShareMap[participant] = 0;
      }
      netBalances[participant] -= sharePerPerson;
      totalShareMap[participant] += sharePerPerson;
    });
  });

  // Separate debtors and creditors
  const debtors = [];
  const creditors = [];

  Object.keys(netBalances).forEach((person) => {
    const net = Math.round(netBalances[person] * 100) / 100;
    if (net < -0.01) {
      debtors.push({ name: person, amount: -net });
    } else if (net > 0.01) {
      creditors.push({ name: person, amount: net });
    }
  });

  // Sort descending
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const settlements = [];
  let dIdx = 0;
  let cIdx = 0;

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];

    const settledAmount = Math.min(debtor.amount, creditor.amount);
    const roundedAmount = Math.round(settledAmount * 100) / 100;

    if (roundedAmount > 0) {
      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: roundedAmount,
      });
    }

    debtor.amount -= settledAmount;
    creditor.amount -= settledAmount;

    if (debtor.amount <= 0.01) dIdx++;
    if (creditor.amount <= 0.01) cIdx++;
  }

  const memberSummary = Object.keys(netBalances).map((name) => ({
    name,
    totalPaid: Math.round((totalPaidMap[name] || 0) * 100) / 100,
    totalShare: Math.round((totalShareMap[name] || 0) * 100) / 100,
    netBalance: Math.round((netBalances[name] || 0) * 100) / 100,
    status:
      netBalances[name] > 0.01
        ? 'Gets back'
        : netBalances[name] < -0.01
        ? 'Owes'
        : 'Settled',
  }));

  return {
    totalGroupSpend: Math.round(totalGroupSpend * 100) / 100,
    memberSummary,
    settlements,
  };
}

module.exports = { calculateGroupSettlements };
