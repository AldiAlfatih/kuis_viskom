'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getStatistics, getActiveUser, formatDuration, formatDate } from '@/lib/quiz-engine';
import type { AttemptRecord } from '@/types/quiz';
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from '@/types/quiz';

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<AttemptRecord[]>([]);
  const [userName, setUserName] = useState('');
  const [userNim, setUserNim] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const user = getActiveUser();
    if (!user) { router.replace('/login'); return; }
    setUserName(user.name);
    setUserNim(user.nim);
    const stats = getStatistics(user.nim);
    setHistory(stats.history ?? []);
  }, [router]);

  function getScoreColor(pct: number) {
    if (pct >= 80) return 'var(--color-correct)';
    if (pct >= 50) return 'var(--color-diff-medium)';
    return 'var(--color-wrong)';
  }

  function getScoreBg(pct: number) {
    if (pct >= 80) return '#f0fdf4';
    if (pct >= 50) return '#fefce8';
    return '#fef2f2';
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Navbar */}
      <nav className="navbar">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/" className="btn btn-ghost btn-sm" style={{ padding: '6px 10px' }}>← Beranda</Link>
            <span className="navbar-brand">Riwayat Latihan</span>
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-3)' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{userNim}</span>
            {' · '}
            <span>{userName}</span>
          </div>
        </div>
      </nav>

      <main>
        <section className="section">
          <div className="container-sm">

            {history.length === 0 ? (
              <div
                className="card"
                style={{ padding: '48px 32px', textAlign: 'center' }}
              >
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>📋</div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Belum ada riwayat</div>
                <p style={{ color: 'var(--color-text-3)', fontSize: '0.9375rem', marginBottom: 24 }}>
                  Selesaikan satu sesi latihan untuk melihat riwayat di sini.
                </p>
                <Link href="/setup" className="btn btn-primary">Mulai Latihan</Link>
              </div>
            ) : (
              <>
                {/* Summary bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 20,
                  }}
                >
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-3)' }}>
                    <strong style={{ color: 'var(--color-text)', fontWeight: 700 }}>{history.length}</strong> sesi latihan tercatat
                  </div>
                  <Link href="/setup" className="btn btn-primary btn-sm">
                    + Latihan Baru
                  </Link>
                </div>

                {/* History list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {history.map((record, i) => {
                    const isOpen = expanded === record.id;
                    return (
                      <div
                        key={record.id}
                        className="card"
                        style={{ overflow: 'hidden' }}
                      >
                        {/* Header row — always visible */}
                        <button
                          onClick={() => setExpanded(isOpen ? null : record.id)}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 14,
                            padding: '16px 20px',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontFamily: 'Inter, sans-serif',
                          }}
                        >
                          {/* Session number */}
                          <div
                            style={{
                              minWidth: 36,
                              height: 36,
                              background: 'var(--color-surface-2)',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              color: 'var(--color-text-3)',
                              flexShrink: 0,
                            }}
                          >
                            #{history.length - i}
                          </div>

                          {/* Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: 2 }}>
                              {CATEGORY_LABELS[record.config.category] ?? record.config.category}
                              {' · '}
                              <span style={{ fontWeight: 400, color: 'var(--color-text-3)' }}>
                                {DIFFICULTY_LABELS[record.config.difficulty] ?? record.config.difficulty}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-4)' }}>
                              {formatDate(record.date)} · {formatDuration(record.duration)}
                            </div>
                          </div>

                          {/* Score badge */}
                          <div
                            style={{
                              padding: '6px 14px',
                              background: getScoreBg(record.score),
                              borderRadius: '100px',
                              fontSize: '0.9375rem',
                              fontWeight: 800,
                              color: getScoreColor(record.score),
                              flexShrink: 0,
                            }}
                          >
                            {record.score}%
                          </div>

                          {/* Expand chevron */}
                          <div
                            style={{
                              color: 'var(--color-text-4)',
                              fontSize: '0.75rem',
                              flexShrink: 0,
                              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s ease',
                            }}
                          >
                            ▼
                          </div>
                        </button>

                        {/* Detail — visible when expanded */}
                        {isOpen && (
                          <div
                            className="animate-fade-in"
                            style={{
                              borderTop: '1px solid var(--color-border)',
                              padding: '16px 20px 20px',
                            }}
                          >
                            {/* Stats row */}
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: 10,
                                marginBottom: 16,
                              }}
                            >
                              {[
                                { label: 'Benar', value: record.correct, color: 'var(--color-correct)' },
                                { label: 'Salah', value: record.total - record.correct, color: 'var(--color-wrong)' },
                                { label: 'Soal', value: record.total, color: 'var(--color-primary)' },
                              ].map(s => (
                                <div
                                  key={s.label}
                                  style={{
                                    background: 'var(--color-surface-2)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: '10px 14px',
                                    textAlign: 'center',
                                  }}
                                >
                                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: s.color }}>
                                    {s.value}
                                  </div>
                                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-3)', marginTop: 2 }}>
                                    {s.label}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Per-category breakdown */}
                            {record.answerDetails && record.answerDetails.length > 0 && (() => {
                              const bycat: Record<string, { correct: number; total: number }> = {};
                              record.answerDetails.forEach(d => {
                                if (!bycat[d.category]) bycat[d.category] = { correct: 0, total: 0 };
                                bycat[d.category].total++;
                                if (d.isCorrect) bycat[d.category].correct++;
                              });
                              return (
                                <div>
                                  <div style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-4)', marginBottom: 8 }}>
                                    Per Materi
                                  </div>
                                  {Object.entries(bycat).map(([cat, data]) => {
                                    const pct = Math.round((data.correct / data.total) * 100);
                                    return (
                                      <div key={cat} style={{ marginBottom: 8 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-2)' }}>
                                            {CATEGORY_LABELS[cat] ?? cat}
                                          </span>
                                          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: getScoreColor(pct) }}>
                                            {data.correct}/{data.total}
                                          </span>
                                        </div>
                                        <div className="progress-bar-track">
                                          <div
                                            className="progress-bar-fill"
                                            style={{ width: `${pct}%`, background: getScoreColor(pct) }}
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })()}

                            {/* Ulangi button */}
                            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                              <Link
                                href={`/setup?category=${record.config.category}&difficulty=${record.config.difficulty}&count=${record.config.count}`}
                                className="btn btn-primary btn-sm"
                              >
                                Ulangi Sesi Ini
                              </Link>
                              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-4)', alignSelf: 'center' }}>
                                Hasil sesi ini tetap tersimpan
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
