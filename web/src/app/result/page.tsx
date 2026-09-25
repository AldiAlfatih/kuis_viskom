'use client';

import { Suspense } from 'react';
import ResultContent from './ResultContent';

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '0.9375rem', color: 'var(--color-text-3)' }}>Memuat hasil...</div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
