export function AnnouncementCard({ title, details }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-brand-700">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{details}</p>
    </div>
  );
}
