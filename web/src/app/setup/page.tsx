'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getStatistics } from '@/lib/quiz-engine';
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from '@/types/quiz';
import type { Category, Difficulty } from '@/types/quiz';

const CATEGORIES: { value: Category | 'all' | 'wrong'; label: string }[] = [
  { value: 'all', label: 'Semua Materi' },
  { value: 'convolution', label: 'Convolution' },
  { value: 'feature_map', label: 'Feature Map' },
  { value: 'relu', label: 'ReLU' },
  { value: 'pooling', label: 'Pooling' },
  { value: 'softmax', label: 'Softmax' },
  { value: 'architecture', label: 'Arsitektur CNN' },
  { value: 'hierarchical', label: 'Hierarchical Features' },
  { value: 'wrong', label: 'Soal yang Pernah Salah' },
];

const DIFFICULTIES: { value: Difficulty | 'mixed'; label: string }[] = [
  { value: 'mixed', label: 'Acak (Campuran)' },
  { value: 'easy', label: 'Mudah' },
  { value: 'medium', label: 'Sedang' },
  { value: 'hard', label: 'Sulit' },
];

const COUNTS = [5, 10, 20];

export default function SetupPage() {
  const router = useRouter();
  const [category, setCategory] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<string>('mixed');
  const [count, setCount] = useState(10);
  const [hasWrong, setHasWrong] = useState(false);

  useEffect(() => {
    const stats = getStatistics();
    setHasWrong(stats.wrongQuestionIds.length > 0);
  }, []);

  function startQuiz() {
    const params = new URLSearchParams({
      category,
      difficulty,
      count: count.toString(),
    });
    router.push(`/quiz?${params.toString()}`);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Navbar */}
      <nav className="navbar">
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 16, height: '100%' }}>
          <Link href="/" className="btn btn-ghost btn-sm" style={{ padding: '6px 10px' }}>
            ← Beranda
          </Link>
          <span className="navbar-brand">Pilih Latihan</span>
        </div>
      </nav>

      <main>
        <section className="section">
          <div className="container-sm">
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                marginBottom: 8,
                letterSpacing: '-0.02em',
              }}
            >
              Pengaturan Latihan
            </h1>
            <p style={{ color: 'var(--color-text-3)', marginBottom: 32, fontSize: '0.9375rem' }}>
              Pilih materi, tingkat kesulitan, dan jumlah soal.
            </p>

            <div className="card" style={{ padding: '28px 28px 32px', marginBottom: 20 }}>
              {/* Category */}
              <div style={{ marginBottom: 28 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--color-text-2)',
                    marginBottom: 12,
                  }}
                >
                  Materi
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {CATEGORIES.map(cat => {
                    const disabled = cat.value === 'wrong' && !hasWrong;
                    return (
                      <button
                        key={cat.value}
                        onClick={() => !disabled && setCategory(cat.value)}
                        disabled={disabled}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '11px 14px',
                          border: `1.5px solid ${category === cat.value ? 'var(--color-primary)' : 'var(--color-border-2)'}`,
                          borderRadius: 'var(--radius-md)',
                          background: category === cat.value ? 'var(--color-primary-light)' : 'var(--color-surface)',
                          cursor: disabled ? 'not-allowed' : 'pointer',
                          opacity: disabled ? 0.5 : 1,
                          transition: 'all 0.15s ease',
                          textAlign: 'left',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.9375rem',
                          fontWeight: category === cat.value ? 600 : 400,
                          color: category === cat.value ? 'var(--color-primary)' : 'var(--color-text)',
                        }}
                      >
                        <span>{cat.label}</span>
                        {category === cat.value && (
                          <span style={{ fontSize: '1rem', color: 'var(--color-primary)' }}>✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="divider" style={{ marginBottom: 28 }} />

              {/* Difficulty */}
              <div style={{ marginBottom: 28 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--color-text-2)',
                    marginBottom: 12,
                  }}
                >
                  Tingkat Kesulitan
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  {DIFFICULTIES.map(diff => (
                    <button
                      key={diff.value}
                      onClick={() => setDifficulty(diff.value)}
                      style={{
                        padding: '11px 14px',
                        border: `1.5px solid ${difficulty === diff.value ? 'var(--color-primary)' : 'var(--color-border-2)'}`,
                        borderRadius: 'var(--radius-md)',
                        background: difficulty === diff.value ? 'var(--color-primary-light)' : 'var(--color-surface)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.875rem',
                        fontWeight: difficulty === diff.value ? 600 : 400,
                        color: difficulty === diff.value ? 'var(--color-primary)' : 'var(--color-text)',
                      }}
                    >
                      {diff.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divider" style={{ marginBottom: 28 }} />

              {/* Count */}
              <div style={{ marginBottom: 4 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--color-text-2)',
                    marginBottom: 12,
                  }}
                >
                  Jumlah Soal
                </label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  {COUNTS.map(n => (
                    <button
                      key={n}
                      onClick={() => setCount(n)}
                      style={{
                        padding: '11px 14px',
                        border: `1.5px solid ${count === n ? 'var(--color-primary)' : 'var(--color-border-2)'}`,
                        borderRadius: 'var(--radius-md)',
                        background: count === n ? 'var(--color-primary-light)' : 'var(--color-surface)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '1rem',
                        fontWeight: count === n ? 700 : 500,
                        color: count === n ? 'var(--color-primary)' : 'var(--color-text)',
                        flex: 1,
                      }}
                    >
                      {n}
                    </button>
                  ))}
                  <div style={{ flex: 1, position: 'relative' }}>
                    <input 
                      type="number"
                      className="input input-mono"
                      value={count || ''}
                      onChange={e => setCount(Math.max(1, parseInt(e.target.value) || 0))}
                      placeholder="Lainnya"
                      style={{ 
                        width: '100%', 
                        padding: '11px 14px', 
                        borderColor: !COUNTS.includes(count) ? 'var(--color-primary)' : 'var(--color-border-2)',
                        background: !COUNTS.includes(count) ? 'var(--color-primary-light)' : 'var(--color-surface)',
                      }}
                      min="1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div
              style={{
                padding: '14px 16px',
                background: 'var(--color-primary-light)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(61,79,196,0.15)',
                marginBottom: 24,
                fontSize: '0.875rem',
                color: 'var(--color-primary)',
                fontWeight: 500,
              }}
            >
              {count} soal · {CATEGORY_LABELS[category]} · {DIFFICULTY_LABELS[difficulty]}
            </div>

            <button
              onClick={startQuiz}
              className="btn btn-primary btn-lg btn-full"
            >
              Mulai Latihan →
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
