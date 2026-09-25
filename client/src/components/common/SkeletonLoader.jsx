import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-4 bg-slate-200 rounded w-24"></div>
        <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
      </div>
      <div className="h-8 bg-slate-200 rounded w-36 mb-3"></div>
      <div className="h-3 bg-slate-200 rounded w-20"></div>
    </div>
  );
};

export const SkeletonTable = ({ rows = 5 }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden animate-pulse p-4">
      <div className="h-6 bg-slate-200 rounded w-48 mb-6"></div>
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
              <div>
                <div className="h-4 bg-slate-200 rounded w-32 mb-1.5"></div>
                <div className="h-3 bg-slate-100 rounded w-20"></div>
              </div>
            </div>
            <div className="h-5 bg-slate-200 rounded w-24"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
