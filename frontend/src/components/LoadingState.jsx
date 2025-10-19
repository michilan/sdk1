export function LoadingState({ label = '讀取資料中…' }) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-2xl border border-brand-100 bg-white p-6 text-brand-600 shadow-inner">
      <span className="h-2 w-2 animate-ping rounded-full bg-brand-500" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
