'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDuration, getStatistics, getActiveUser } from '@/lib/quiz-engine';
import { CATEGORY_LABELS } from '@/types/quiz';
import { useEffect, useState } from 'react';
import type { Statistics } from '@/types/quiz';

export default function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const correct    = parseInt(searchParams.get('correct')    || '0');
  const total      = parseInt(searchParams.get('total')      || '1');
  const duration   = parseInt(searchParams.get('duration')   || '0');
  const category   = searchParams.get('category')   || 'all';
  const difficulty = searchParams.get('difficulty') || 'mixed';
  const sessionNum = searchParams.get('session')    || '';

  const percentage = Math.round((correct / total) * 100);
  const wrong = total - correct;

  const [stats, setStats] = useState<Statistics | null>(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = getActiveUser();
    if (!user) { router.replace('/login'); return; }
    setUserName(user.name.split(' ')[0]);
    setStats(getStatistics(user.nim));
  }, [router]);

  function getScoreColor(pct: number) {
    if (pct >= 80) return 'var(--color-correct)';
    if (pct >= 50) return 'var(--color-diff-medium)';
    return 'var(--color-wrong)';
  }

  function getScoreMessage(pct: number) {
    if (pct >= 90) return 'Luar biasa! 🎉';
    if (pct >= 75) return 'Sangat bagus!';
    if (pct >= 60) return 'Cukup baik, terus berlatih.';
    if (pct >= 40) return 'Perlu latihan lebih banyak.';
    return 'Jangan menyerah, ulangi lagi!';
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Navbar */}
      <nav className="navbar">
        <div className="container" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <span className="navbar-brand">CNN Quiz Trainer</span>
        </div>
      </nav>

      <main>
        <section className="section">
          <div className="container-sm">

            {/* Score Card */}
            <div className="card animate-pop" style={{ padding: '40px 32px', textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-4)', marginBottom: 18 }}>
                Sesi Selesai {sessionNum && `· #${sessionNum}`}
              </div>

              <div style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', fontWeight: 800, lineHeight: 1, color: getScoreColor(percentage), marginBottom: 8, letterSpacing: '-0.03em' }}>
                {percentage}%
              </div>
              <div style={{ fontSize: '1rem', color: 'var(--color-text-3)', marginBottom: 28 }}>
                {getScoreMessage(percentage)}
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, borderTop: '1px solid var(--color-border)', paddingTop: 24, marginBottom: 4 }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-correct)' }}>{correct}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-3)', marginTop: 4 }}>Benar</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-wrong)' }}>{wrong}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-3)', marginTop: 4 }}>Salah</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'JetBrains Mono, monospace' }}>
                    {formatDuration(duration)}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-3)', marginTop: 4 }}>Waktu</div>
                </div>
              </div>
            </div>

            {/* Info: hasil lama tidak hilang */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '11px 16px',
                background: 'var(--color-primary-light)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(61,79,196,0.15)',
                marginBottom: 16,
                fontSize: '0.8375rem',
                color: 'var(--color-primary)',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>
                Sesi ini sudah tersimpan ke riwayat. Mengulang latihan tidak menghapus hasil sebelumnya.
              </span>
            </div>

            {/* Category Breakdown */}
            {stats && stats.byCategory && Object.keys(stats.byCategory).length > 0 && (
              <div className="card" style={{ padding: '20px 24px', marginBottom: 16 }}>
                <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: 16, color: 'var(--color-text)' }}>
                  Akurasi Kumulatif per Materi
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {Object.entries(stats.byCategory).map(([cat, data]) => (
                    <div key={cat}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-2)', fontWeight: 500 }}>
                          {CATEGORY_LABELS[cat] || cat}
                        </span>
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: getScoreColor(data.accuracy) }}>
                          {data.accuracy}%
                          <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-text-4)', marginLeft: 4 }}>
                            ({data.correct}/{data.total})
                          </span>
                        </span>
                      </div>
                      <div className="progress-bar-track">
                        <div className="progress-bar-fill" style={{ width: `${data.accuracy}%`, background: getScoreColor(data.accuracy) }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link
                href={`/setup?category=${category}&difficulty=${difficulty}&count=${total}`}
                className="btn btn-primary btn-lg btn-full"
              >
                Ulangi Latihan
              </Link>
              {stats && stats.wrongQuestionIds && stats.wrongQuestionIds.length > 0 && (
                <Link
                  href="/setup?category=wrong&difficulty=mixed&count=10"
                  className="btn btn-secondary btn-lg btn-full"
                >
                  Latihan Soal yang Masih Salah ({stats.wrongQuestionIds.length})
                </Link>
              )}
              <Link href="/history" className="btn btn-ghost btn-lg btn-full">
                Lihat Semua Riwayat →
              </Link>
              <Link href="/" className="btn btn-ghost btn-lg btn-full">
                Kembali ke Beranda
              </Link>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
