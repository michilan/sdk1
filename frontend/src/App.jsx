import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { HomePage } from './pages/HomePage.jsx';
import { AdminPage } from './pages/AdminPage.jsx';

const navigation = [
  { path: '/', label: '前台總覽' },
  { path: '/admin', label: '後台管理' },
];

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-brand-100 text-slate-900">
      <header className="bg-white/80 backdrop-blur border-b border-slate-200 sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex flex-col">
            <span className="text-xs tracking-widest text-brand-600">2025-26 陽光年會</span>
            <h1 className="text-xl font-semibold">共善扶輪 儀表板</h1>
          </div>
          <nav className="flex gap-3 text-sm">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="rounded-full border border-brand-200 px-4 py-2 font-medium text-brand-700 transition hover:border-brand-400 hover:text-brand-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
