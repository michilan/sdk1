import { useEffect, useState } from 'react';
import { useDashboardData } from '../hooks/useDashboardData.js';
import { LoadingState } from '../components/LoadingState.jsx';
import { ErrorState } from '../components/ErrorState.jsx';

const emptyAnnouncement = { title: '', details: '' };
const emptyAchievement = { label: '', value: '', percentage: 0 };

export function AdminPage() {
  const { data, loading, error, saveDashboard, fetchOnce } = useDashboardData();
  const [formState, setFormState] = useState(data);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    setFormState(data);
  }, [data]);

  const handleChange = (path, value) => {
    setFormState((prev) => {
      const segments = path.split('.');
      const nextState = { ...prev };
      let cursor = nextState;
      segments.forEach((segment, index) => {
        if (index === segments.length - 1) {
          cursor[segment] = value;
        } else {
          cursor[segment] = { ...(cursor[segment] ?? {}) };
          cursor = cursor[segment];
        }
      });
      return nextState;
    });
  };

  const handleArrayChange = (key, index, field, value) => {
    setFormState((prev) => {
      const nextList = [...(prev[key] ?? [])];
      nextList[index] = {
        ...nextList[index],
        [field]: value,
      };
      return {
        ...prev,
        [key]: nextList,
      };
    });
  };

  const addAnnouncement = () => {
    setFormState((prev) => ({
      ...prev,
      announcements: [...(prev.announcements ?? []), emptyAnnouncement],
    }));
  };

  const removeAnnouncement = (index) => {
    setFormState((prev) => ({
      ...prev,
      announcements: prev.announcements.filter((_, idx) => idx !== index),
    }));
  };

  const addAchievement = () => {
    setFormState((prev) => ({
      ...prev,
      achievements: [...(prev.achievements ?? []), emptyAchievement],
    }));
  };

  const removeAchievement = (index) => {
    setFormState((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      await saveDashboard(formState);
      setFeedback({ type: 'success', message: '儀表板內容已更新。' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message ?? '更新失敗，請稍後再試。' });
    } finally {
      setSaving(false);
    }
  };

  if (loading && !formState) {
    return <LoadingState label="後台載入中…" />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={fetchOnce} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-lg">
        <header className="mb-4">
          <h2 className="text-lg font-semibold text-brand-700">年度資訊</h2>
          <p className="text-sm text-slate-500">更新儀表板標題與年度敘述。</p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            年度抬頭
            <input
              type="text"
              value={formState.yearTitle ?? ''}
              onChange={(event) => handleChange('yearTitle', event.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            儀表板標題
            <input
              type="text"
              value={formState.headline ?? ''}
              onChange={(event) => handleChange('headline', event.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="sm:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700">
            說明文字
            <textarea
              value={formState.subHeadline ?? ''}
              onChange={(event) => handleChange('subHeadline', event.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              rows={3}
            />
          </label>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-brand-200 bg-brand-50/70 p-6 shadow-inner">
          <h3 className="text-base font-semibold text-brand-700">活動報到區塊</h3>
          <div className="mt-4 space-y-3 text-sm">
            <label className="flex flex-col gap-2">
              區塊標題
              <input
                type="text"
                value={formState.reportingStatus?.label ?? ''}
                onChange={(event) => handleChange('reportingStatus.label', event.target.value)}
                className="rounded-lg border border-brand-200 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-2">
              狀態文字
              <input
                type="text"
                value={formState.reportingStatus?.status ?? ''}
                onChange={(event) => handleChange('reportingStatus.status', event.target.value)}
                className="rounded-lg border border-brand-200 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-2">
              補充說明
              <textarea
                value={formState.reportingStatus?.description ?? ''}
                onChange={(event) => handleChange('reportingStatus.description', event.target.value)}
                className="rounded-lg border border-brand-200 px-3 py-2"
                rows={3}
              />
            </label>
            <label className="flex flex-col gap-2">
              行動按鈕文字
              <input
                type="text"
                value={formState.reportingStatus?.cta ?? ''}
                onChange={(event) => handleChange('reportingStatus.cta', event.target.value)}
                className="rounded-lg border border-brand-200 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-2">
              行動按鈕連結
              <input
                type="url"
                value={formState.reportingStatus?.ctaUrl ?? ''}
                onChange={(event) => handleChange('reportingStatus.ctaUrl', event.target.value)}
                className="rounded-lg border border-brand-200 px-3 py-2"
              />
            </label>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-inner">
          <h3 className="text-base font-semibold text-slate-700">幸運抽獎區塊</h3>
          <div className="mt-4 space-y-3 text-sm">
            <label className="flex flex-col gap-2">
              區塊標題
              <input
                type="text"
                value={formState.luckyDraw?.label ?? ''}
                onChange={(event) => handleChange('luckyDraw.label', event.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-2">
              下一位得獎者
              <input
                type="text"
                value={formState.luckyDraw?.nextDraw ?? ''}
                onChange={(event) => handleChange('luckyDraw.nextDraw', event.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-2">
              補充說明
              <textarea
                value={formState.luckyDraw?.description ?? ''}
                onChange={(event) => handleChange('luckyDraw.description', event.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2"
                rows={3}
              />
            </label>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-lg">
        <h3 className="text-base font-semibold text-slate-700">募款指標</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-2 text-sm">
            目前募款
            <input
              type="text"
              value={formState.milestone?.totalRaised ?? ''}
              onChange={(event) => handleChange('milestone.totalRaised', event.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            年度目標
            <input
              type="text"
              value={formState.milestone?.target ?? ''}
              onChange={(event) => handleChange('milestone.target', event.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            支持人數
            <input
              type="number"
              value={formState.milestone?.supporterCount ?? ''}
              onChange={(event) => handleChange('milestone.supporterCount', Number(event.target.value))}
              className="rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-700">榮耀榜單</h3>
          <button
            type="button"
            onClick={addAchievement}
            className="rounded-full border border-brand-200 px-4 py-1 text-xs font-semibold text-brand-600"
          >
            新增獎項
          </button>
        </div>
        <div className="mt-4 space-y-4">
          {(formState.achievements ?? []).map((item, index) => (
            <div key={`achievement-${index}`} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-start justify-between">
                <span className="text-sm font-semibold text-brand-600">獎項 #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeAchievement(index)}
                  className="text-xs text-red-500 hover:underline"
                >
                  移除
                </button>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-3 text-sm">
                <label className="flex flex-col gap-2">
                  標題
                  <input
                    type="text"
                    value={item.label ?? ''}
                    onChange={(event) => handleArrayChange('achievements', index, 'label', event.target.value)}
                    className="rounded-lg border border-slate-200 px-3 py-2"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  數值
                  <input
                    type="text"
                    value={item.value ?? ''}
                    onChange={(event) => handleArrayChange('achievements', index, 'value', event.target.value)}
                    className="rounded-lg border border-slate-200 px-3 py-2"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  百分比
                  <input
                    type="number"
                    step="0.1"
                    value={item.percentage ?? 0}
                    onChange={(event) => handleArrayChange('achievements', index, 'percentage', Number(event.target.value))}
                    className="rounded-lg border border-slate-200 px-3 py-2"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-700">活動公告</h3>
          <button
            type="button"
            onClick={addAnnouncement}
            className="rounded-full border border-brand-200 px-4 py-1 text-xs font-semibold text-brand-600"
          >
            新增公告
          </button>
        </div>
        <div className="mt-4 space-y-4">
          {(formState.announcements ?? []).map((announcement, index) => (
            <div key={`announcement-${index}`} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-start justify-between">
                <span className="text-sm font-semibold text-brand-600">公告 #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeAnnouncement(index)}
                  className="text-xs text-red-500 hover:underline"
                >
                  移除
                </button>
              </div>
              <div className="mt-3 space-y-3 text-sm">
                <label className="flex flex-col gap-2">
                  標題
                  <input
                    type="text"
                    value={announcement.title ?? ''}
                    onChange={(event) => handleArrayChange('announcements', index, 'title', event.target.value)}
                    className="rounded-lg border border-slate-200 px-3 py-2"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  內容
                  <textarea
                    rows={3}
                    value={announcement.details ?? ''}
                    onChange={(event) => handleArrayChange('announcements', index, 'details', event.target.value)}
                    className="rounded-lg border border-slate-200 px-3 py-2"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-lg">
        <h3 className="text-base font-semibold text-slate-700">志工手冊</h3>
        <label className="mt-3 flex flex-col gap-2 text-sm">
          下載連結
          <input
            type="url"
            value={formState.volunteerHandbook ?? ''}
            onChange={(event) => handleChange('volunteerHandbook', event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
      </section>

      {feedback && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            feedback.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          disabled={saving}
          onClick={fetchOnce}
          className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-600 disabled:opacity-50"
        >
          重新載入
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-brand-600 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-brand-700 disabled:opacity-50"
        >
          {saving ? '儲存中…' : '儲存變更'}
        </button>
      </div>
    </form>
  );
}
