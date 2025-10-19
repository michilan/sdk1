export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-2xl border border-red-200 bg-red-50/80 p-6 text-red-700">
      <div className="font-semibold">無法載入資料</div>
      {message && <p className="text-sm text-red-600">{message}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:border-red-400 hover:text-red-700"
        >
          重新嘗試
        </button>
      )}
    </div>
  );
}
