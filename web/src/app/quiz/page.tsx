'use client';

import { Suspense } from 'react';
import QuizContent from './QuizContent';

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.9375rem', color: 'var(--color-text-3)' }}>Memuat soal...</div>
        </div>
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}
