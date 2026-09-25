'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getStatistics, getActiveUser, clearActiveUser, formatDuration, formatDate } from '@/lib/quiz-engine';
import type { Statistics } from '@/types/quiz';
import { CATEGORY_LABELS } from '@/types/quiz';

export default function HomePage() {
  const router = useRouter();
  const [stats, setStats] = useState<Statistics | null>(null);
  const [activeUser, setActiveUserState] = useState<{ nim: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getActiveUser();
    if (!user) { router.replace('/login'); return; }
    setActiveUserState({ nim: user.nim, name: user.name });
    setStats(getStatistics(user.nim));
    setLoading(false);
  }, [router]);

  function handleLogout() {
    clearActiveUser();
    router.push('/login');
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '0.9375rem', color: 'var(--color-text-3)' }}>Memuat...</div>
      </div>
    );
  }

  function getScoreColor(pct: number) {
    if (pct >= 80) return 'var(--color-correct)';
    if (pct >= 50) return 'var(--color-diff-medium)';
    return 'var(--color-wrong)';
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Navbar */}
      <nav className="navbar">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          <span className="navbar-brand">CNN Quiz Trainer</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* User chip */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '5px 12px',
                background: 'var(--color-primary-light)',
                borderRadius: '100px',
                border: '1px solid rgba(61,79,196,0.15)',
              }}
            >
              <span style={{
                width: 22, height: 22, background: 'var(--color-primary)', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', flexShrink: 0,
              }}>
                {activeUser?.name[0]}
              </span>
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-primary)', lineHeight: 1 }}>
                  {activeUser?.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-primary-muted)', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1, marginTop: 1 }}>
                  {activeUser?.nim}
                </div>
              </div>
            </div>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ fontSize: '0.8125rem', color: 'var(--color-text-3)' }}>
              Ganti
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section style={{ padding: '52px 0 40px', borderBottom: '1px solid var(--color-border)' }}>
          <div className="container-sm">
            <div style={{ maxWidth: 560 }}>
              <div className="badge badge-general" style={{ marginBottom: 14 }}>Pengolahan Citra Digital</div>
              <h1 style={{ fontSize: 'clamp(1.625rem, 4vw, 2.375rem)', fontWeight: 800, color: 'var(--color-text)', marginBottom: 10, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                Halo, {activeUser?.name.split(' ')[0]}!
              </h1>
              <p style={{ fontSize: '1rem', color: 'var(--color-text-3)', lineHeight: 1.7, marginBottom: 28, maxWidth: 460 }}>
                Latihan soal CNN — convolution, ReLU, pooling, feature map, dan arsitektur CNN.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link href="/setup" className="btn btn-primary btn-lg">Mulai Latihan</Link>
                <Link href="/history" className="btn btn-secondary btn-lg">Lihat Riwayat</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="section">
          <div className="container-sm">
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-4)', marginBottom: 16 }}>
              Statistik Kumulatif
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 36 }}>
              {[
                { value: stats?.totalQuestions ?? 60, label: 'Total Soal' },
                { value: stats?.attempted ?? 0, label: 'Dikerjakan' },
                { value: stats?.attempted ? `${stats.accuracy}%` : '—', label: 'Akurasi' },
                { value: stats?.streak ?? 0, label: 'Streak' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Riwayat singkat */}
            {stats && stats.history && stats.history.length > 0 && (
              <div className="card" style={{ padding: '20px 24px', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text)' }}>
                    Sesi Terakhir
                  </h2>
                  <Link href="/history" style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                    Lihat semua ({stats.history.length}) →
                  </Link>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {stats.history.slice(0, 4).map((record, i) => (
                    <div
                      key={record.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        background: 'var(--color-surface-2)',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-4)', fontWeight: 600, minWidth: 28 }}>
                          #{stats.history.length - i}
                        </span>
                        <div>
                          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-2)', fontWeight: 500 }}>
                            {CATEGORY_LABELS[record.config.category] ?? record.config.category} · {record.correct}/{record.total}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-4)', marginTop: 1 }}>
                            {formatDate(record.date)} · {formatDuration(record.duration)}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: getScoreColor(record.score) }}>
                        {record.score}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Materi */}
            <div className="card" style={{ padding: '20px 24px' }}>
              <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: 16, color: 'var(--color-text)' }}>
                Materi yang Diujikan
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Convolution & Dot Product', count: 20, badge: 'convolution' },
                  { label: 'ReLU', count: 10, badge: 'relu' },
                  { label: 'Max & Mean Pooling', count: 10, badge: 'pooling' },
                  { label: 'Feature Map', count: 5, badge: 'featuremap' },
                  { label: 'Softmax', count: 5, badge: 'softmax' },
                  { label: 'Arsitektur CNN & Gabungan', count: 10, badge: 'architecture' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <span className={`badge badge-${item.badge}`}>{item.label}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-4)', fontWeight: 500 }}>{item.count} soal</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
