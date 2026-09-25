'use client';

import { useState, useEffect } from 'react';

interface MatrixInputProps {
  rows: number;
  cols: number;
  onChange: (matrix: number[][]) => void;
}

export default function MatrixInput({ rows, cols, onChange }: MatrixInputProps) {
  const [values, setValues] = useState<string[][]>(
    () => Array.from({ length: rows }, () => Array(cols).fill(''))
  );

  // Reset when dimensions change
  useEffect(() => {
    const fresh = Array.from({ length: rows }, () => Array(cols).fill(''));
    setValues(fresh);
  }, [rows, cols]);

  function handleChange(r: number, c: number, val: string) {
    const next = values.map(row => [...row]);
    next[r][c] = val;
    setValues(next);

    // Convert to numbers for parent
    const numeric = next.map(row =>
      row.map(v => {
        const n = parseFloat(v.replace(',', '.'));
        return isNaN(n) ? 0 : n;
      })
    );
    onChange(numeric);
  }

  function handleReset() {
    const fresh = Array.from({ length: rows }, () => Array(cols).fill(''));
    setValues(fresh);
    onChange(Array.from({ length: rows }, () => Array(cols).fill(0)));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, r: number, c: number) {
    // Navigate cells with arrow keys or Tab
    if (e.key === 'ArrowRight' || (e.key === 'Tab' && !e.shiftKey)) {
      const nextC = c + 1;
      const nextR = r;
      if (nextC < cols) {
        e.preventDefault();
        document.getElementById(`cell-${r}-${nextC}`)?.focus();
      } else if (nextR + 1 < rows) {
        e.preventDefault();
        document.getElementById(`cell-${r + 1}-0`)?.focus();
      }
    }
    if (e.key === 'ArrowLeft' || (e.key === 'Tab' && e.shiftKey)) {
      const prevC = c - 1;
      if (prevC >= 0) {
        e.preventDefault();
        document.getElementById(`cell-${r}-${prevC}`)?.focus();
      } else if (r - 1 >= 0) {
        e.preventDefault();
        document.getElementById(`cell-${r - 1}-${cols - 1}`)?.focus();
      }
    }
    if (e.key === 'ArrowDown') {
      if (r + 1 < rows) document.getElementById(`cell-${r + 1}-${c}`)?.focus();
    }
    if (e.key === 'ArrowUp') {
      if (r - 1 >= 0) document.getElementById(`cell-${r - 1}-${c}`)?.focus();
    }
  }

  return (
    <div>
      <div
        className="matrix-grid"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {values.map((row, r) =>
          row.map((val, c) => (
            <input
              key={`${r}-${c}`}
              id={`cell-${r}-${c}`}
              type="text"
              inputMode="decimal"
              className="matrix-cell"
              value={val}
              onChange={e => handleChange(r, c, e.target.value)}
              onKeyDown={e => handleKeyDown(e, r, c)}
              aria-label={`Baris ${r + 1}, Kolom ${c + 1}`}
              placeholder="0"
            />
          ))
        )}
      </div>
      <button
        onClick={handleReset}
        className="btn btn-ghost btn-sm"
        style={{ marginTop: 8 }}
        type="button"
      >
        Reset
      </button>
    </div>
  );
}
