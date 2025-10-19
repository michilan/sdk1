export function StatCard({ label, value, percentage }) {
  return (
    <div className="flex flex-col rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
      <span className="text-sm font-medium text-brand-500">{label}</span>
      <span className="mt-2 text-2xl font-semibold text-slate-900">{value}</span>
      {typeof percentage === 'number' && (
        <div className="mt-4 h-2 rounded-full bg-brand-100">
          <div
            className="h-2 rounded-full bg-brand-500 transition-all"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
          <span className="mt-1 block text-right text-xs text-brand-600">{percentage.toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
}
