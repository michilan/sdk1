import { useMemo } from 'react';
import { useDashboardData } from '../hooks/useDashboardData.js';
import { StatCard } from '../components/StatCard.jsx';
import { AnnouncementCard } from '../components/AnnouncementCard.jsx';
import { LoadingState } from '../components/LoadingState.jsx';
import { ErrorState } from '../components/ErrorState.jsx';

export function HomePage() {
  const { data, loading, error, fetchOnce } = useDashboardData();

  const progressPercent = useMemo(() => {
    if (!data?.milestone) return 0;
    const { totalRaised, target } = data.milestone;
    const numericRaised = Number(String(totalRaised).replace(/[^0-9.]/g, ''));
    const numericTarget = Number(String(target).replace(/[^0-9.]/g, ''));
    if (!numericRaised || !numericTarget) return 0;
    return Math.min(100, Math.round((numericRaised / numericTarget) * 100));
  }, [data]);

  if (loading && !data) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={fetchOnce} />;
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 rounded-3xl bg-white/90 p-8 shadow-lg lg:grid-cols-3">
        <div className="lg:col-span-2">
          <span className="text-xs tracking-widest text-brand-500">{data.yearTitle}</span>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">{data.headline}</h2>
          <p className="mt-3 text-sm text-slate-600">{data.subHeadline}</p>
          <div className="mt-6 rounded-2xl border border-dashed border-brand-200 bg-brand-50 p-6">
            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="font-semibold text-brand-600">募款進度</span>
                <p className="mt-1 text-xs text-brand-500">更新時間：
                  <span className="ml-1 font-mono">
                    {data.milestone?.updatedAt
                      ? new Date(data.milestone.updatedAt.seconds
                          ? data.milestone.updatedAt.seconds * 1000
                          : data.milestone.updatedAt).toLocaleString()
                      : '尚未同步'}
                  </span>
                </p>
              </div>
              <span className="text-2xl font-bold text-brand-600">{progressPercent}%</span>
            </div>
            <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-white/70">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="mt-4 grid gap-4 text-sm text-slate-600 sm:grid-cols-3">
              <div>
                <div className="text-xs text-brand-500">目前募款</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">{data.milestone?.totalRaised}</div>
              </div>
              <div>
                <div className="text-xs text-brand-500">年度目標</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">{data.milestone?.target}</div>
              </div>
              <div>
                <div className="text-xs text-brand-500">熱血支持者</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">{data.milestone?.supporterCount}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-5">
            <div className="text-xs uppercase tracking-widest text-brand-500">{data.reportingStatus?.label}</div>
            <div className="mt-2 text-lg font-semibold text-brand-700">{data.reportingStatus?.status}</div>
            <p className="mt-2 text-sm text-brand-600">{data.reportingStatus?.description}</p>
            {data.reportingStatus?.cta && data.reportingStatus?.ctaUrl && (
              <a
                className="mt-4 inline-flex items-center justify-center rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-brand-600"
                href={data.reportingStatus.ctaUrl}
                target="_blank"
                rel="noreferrer"
              >
                {data.reportingStatus.cta}
              </a>
            )}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs uppercase tracking-widest text-slate-400">{data.luckyDraw?.label}</div>
            <div className="mt-3 text-xl font-semibold text-slate-900">{data.luckyDraw?.nextDraw}</div>
            <p className="mt-3 text-sm text-slate-600">{data.luckyDraw?.description}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {data.achievements?.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} percentage={item.percentage} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-brand-700">活動公告</h3>
          <div className="space-y-3">
            {data.announcements?.map((announcement, index) => (
              <AnnouncementCard key={`${announcement.title}-${index}`} {...announcement} />
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-3xl border border-brand-100 bg-brand-50/60 p-6 shadow-lg">
          <div>
            <h3 className="text-lg font-semibold text-brand-700">志工專區</h3>
            <p className="mt-2 text-sm text-brand-600">
              下載志工手冊與班表，確保每位夥伴掌握最新動態。
            </p>
          </div>
          {data.volunteerHandbook && (
            <a
              href={data.volunteerHandbook}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-brand-600"
              target="_blank"
              rel="noreferrer"
            >
              下載志工手冊
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
