import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const StatCard = ({
  title,
  amount,
  trend,
  trendLabel = 'vs last month',
  icon: Icon,
  colorScheme = 'navy',
  onClick,
}) => {
  const schemes = {
    navy: {
      iconBg: 'bg-navy-50 text-navy-800 border-navy-100',
      accent: 'border-slate-100',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      accent: 'border-slate-100',
    },
    rose: {
      iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
      accent: 'border-slate-100',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      accent: 'border-slate-100',
    },
    blue: {
      iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
      accent: 'border-slate-100',
    },
  };

  const scheme = schemes[colorScheme] || schemes.navy;

  const isPositive = trend > 0;
  const isNegative = trend < 0;
  const isNeutral = trend === 0 || trend === undefined || trend === null;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border ${scheme.accent} shadow-card card-interactive ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${scheme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between">
        <h2 className="text-2xl font-extrabold text-navy-900 tracking-tight">{amount}</h2>
      </div>

      {trend !== undefined && trend !== null && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-50">
          <span
            className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
              isPositive
                ? 'bg-emerald-50 text-emerald-700'
                : isNegative
                ? 'bg-rose-50 text-rose-700'
                : 'bg-slate-50 text-slate-600'
            }`}
          >
            {isPositive && <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />}
            {isNegative && <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
            {isNeutral && <Minus className="w-3.5 h-3.5 mr-0.5" />}
            {Math.abs(trend)}%
          </span>
          <span className="text-xs text-slate-500">{trendLabel}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
