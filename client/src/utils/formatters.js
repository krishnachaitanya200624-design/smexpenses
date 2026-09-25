export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.round((now - d) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(dateStr);
};

export const getCategoryColor = (category) => {
  const map = {
    Food: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      fill: '#10B981',
      badge: 'bg-emerald-100 text-emerald-800',
    },
    Shopping: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      fill: '#3B82F6',
      badge: 'bg-blue-100 text-blue-800',
    },
    Transport: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      fill: '#F59E0B',
      badge: 'bg-amber-100 text-amber-800',
    },
    Bills: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      fill: '#EF4444',
      badge: 'bg-rose-100 text-rose-800',
    },
    Entertainment: {
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      fill: '#8B5CF6',
      badge: 'bg-purple-100 text-purple-800',
    },
    Education: {
      bg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      fill: '#06B6D4',
      badge: 'bg-cyan-100 text-cyan-800',
    },
    Health: {
      bg: 'bg-pink-50 text-pink-700 border-pink-200',
      fill: '#EC4899',
      badge: 'bg-pink-100 text-pink-800',
    },
    Other: {
      bg: 'bg-slate-50 text-slate-700 border-slate-200',
      fill: '#64748B',
      badge: 'bg-slate-100 text-slate-800',
    },
  };

  return (
    map[category] || {
      bg: 'bg-slate-50 text-slate-700 border-slate-200',
      fill: '#64748B',
      badge: 'bg-slate-100 text-slate-800',
    }
  );
};
