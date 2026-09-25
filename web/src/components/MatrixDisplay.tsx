'use client';

interface MatrixDisplayProps {
  matrix: number[][];
  label?: string;
}

export default function MatrixDisplay({ matrix, label }: MatrixDisplayProps) {
  const rows = matrix.length;
  const cols = matrix[0]?.length || 0;

  // Determine cell width based on max value length
  const maxLen = Math.max(...matrix.flat().map(v => String(v).length));
  const cellW = Math.max(36, maxLen * 10 + 20);

  return (
    <div>
      {label && (
        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-3)', marginBottom: 6 }}>
          {label}
        </div>
      )}
      <div
        style={{
          display: 'inline-grid',
          gridTemplateColumns: `repeat(${cols}, ${cellW}px)`,
          gap: 4,
          background: 'var(--color-surface-2)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 12px',
        }}
      >
        {matrix.map((row, r) =>
          row.map((val, c) => (
            <div
              key={`${r}-${c}`}
              style={{
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: val < 0 ? 'var(--color-wrong)' : 'var(--color-text)',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {val}
            </div>
          ))
        )}
      </div>
      <div
        style={{
          fontSize: '0.78rem',
          color: 'var(--color-text-4)',
          marginTop: 4,
          fontFamily: 'JetBrains Mono, monospace',
        }}
      >
        {rows}×{cols}
      </div>
    </div>
  );
}
