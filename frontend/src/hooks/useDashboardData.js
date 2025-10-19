import { useEffect, useState, useCallback } from 'react';
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase.js';

const DASHBOARD_DOC = doc(db, 'dashboard', 'content');

const defaultData = {
  yearTitle: '2025-26 陽光年會',
  headline: '共善扶輪 愛心匯聚',
  subHeadline: '一起達成年度慈善目標',
  reportingStatus: {
    label: '活動報到',
    status: '尚未啟用',
    description: '敬請期待正式開放',
  },
  luckyDraw: {
    label: '幸運抽獎',
    nextDraw: '下一位得獎者即將揭曉',
    description: '請持續關注現場公告',
  },
  achievements: [
    { label: '最佳人數參與獎', value: '45 團', percentage: 28.9 },
    { label: '最高募款總額', value: '$182,400', percentage: 65.2 },
    { label: '服務時數王', value: '312 小時', percentage: 52.1 },
  ],
  milestone: {
    totalRaised: '$318,436',
    target: '$500,000',
    supporterCount: 843,
    updatedAt: new Date().toISOString(),
  },
  announcements: [
    {
      title: '扶輪之夜精彩節目',
      details: '舞台節目將於 19:30 準時開始，請提早入座。',
    },
    {
      title: '募款進度更新',
      details: '感謝各社友熱情支持，距離年度目標只差最後一步。',
    },
  ],
};

export function useDashboardData() {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      DASHBOARD_DOC,
      (snapshot) => {
        if (snapshot.exists()) {
          const payload = snapshot.data();
          setData((prev) => ({ ...prev, ...payload }));
        }
        setLoading(false);
      },
      (err) => {
        console.error('Failed to subscribe dashboard data', err);
        setError(err);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const saveDashboard = useCallback(async (nextData) => {
    setLoading(true);
    setError(null);
    try {
      await setDoc(DASHBOARD_DOC, {
        ...nextData,
        milestone: {
          ...nextData.milestone,
          updatedAt: serverTimestamp(),
        },
      });
    } catch (err) {
      console.error('Unable to save dashboard data', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOnce = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const snapshot = await getDoc(DASHBOARD_DOC);
      if (snapshot.exists()) {
        const payload = snapshot.data();
        setData((prev) => ({ ...prev, ...payload }));
      }
    } catch (err) {
      console.error('Unable to fetch dashboard data', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, saveDashboard, fetchOnce };
}
