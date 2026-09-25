import React from 'react';
import { getCategoryColor } from '../../utils/formatters';

export const CategoryBadge = ({ category }) => {
  const color = getCategoryColor(category);
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${color.bg}`}
    >
      {category}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const map = {
    Safe: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Near Limit': 'bg-amber-50 text-amber-700 border-amber-200',
    'Over Budget': 'bg-rose-50 text-rose-700 border-rose-200',
    Settled: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Owes: 'bg-rose-50 text-rose-700 border-rose-200',
    'Gets back': 'bg-teal-50 text-teal-700 border-teal-200',
  };

  const style = map[status] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${style}`}>
      {status}
    </span>
  );
};
