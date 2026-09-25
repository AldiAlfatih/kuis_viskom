'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getQuestions } from '@/lib/questions';
import { validateAnswer, saveAttempt, getActiveUser, getStatistics } from '@/lib/quiz-engine';
import type { Question, UserAnswer } from '@/types/quiz';
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from '@/types/quiz';
import MatrixInput from '@/components/MatrixInput';
import MatrixDisplay from '@/components/MatrixDisplay';

export default function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get('category') || 'all';
  const difficulty = searchParams.get('difficulty') || 'mixed';
  const count = parseInt(searchParams.get('count') || '10');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [matrixAnswer, setMatrixAnswer] = useState<number[][]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load questions
  useEffect(() => {
    const qs = getQuestions({ count, category, difficulty });
    setQuestions(qs);
  }, [count, category, difficulty]);

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime]);

  if (questions.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 8 }}>Tidak ada soal ditemukan</div>
          <p style={{ color: 'var(--color-text-3)', marginBottom: 24 }}>Coba pilih materi atau tingkat kesulitan yang berbeda.</p>
          <Link href="/setup" className="btn btn-primary">Kembali ke Pengaturan</Link>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;
  const currentScore = userAnswers.filter(a => a.isCorrect).length;

  function formatTime(s: number) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  function handleSubmit() {
    if (!currentQuestion) return;
    let raw = currentInput;
    if (currentQuestion.type === 'matrix') {
      raw = JSON.stringify(matrixAnswer);
    }
    if (!raw && currentQuestion.type !== 'matrix') return;

    const correct = validateAnswer(currentQuestion, raw);
    setIsCorrect(correct);
    setSubmitted(true);

    const answer: UserAnswer = {
      questionId: currentQuestion.id,
      userAnswer: currentQuestion.type === 'matrix' ? matrixAnswer : raw,
      isCorrect: correct,
      answeredAt: new Date(),
    };
    setUserAnswers(prev => [...prev, answer]);
  }

  function handleNext() {
    if (currentIndex + 1 >= questions.length) {
      // Quiz finished
      if (timerRef.current) clearInterval(timerRef.current);
      const finalAnswers = [...userAnswers];
      const user = getActiveUser();
      const nim = user?.nim;
      saveAttempt(
        { count, category: category as 'all', difficulty: difficulty as 'mixed' },
        finalAnswers,
        elapsedSeconds,
        nim
      );
      const correct = finalAnswers.filter(a => a.isCorrect).length;
      // Hitung nomor sesi (berapa kali sudah latihan)
      const sessionNum = nim ? (getStatistics(nim).history?.length ?? 1) : 1;
      const params = new URLSearchParams({
        correct: correct.toString(),
        total: questions.length.toString(),
        duration: elapsedSeconds.toString(),
        category,
        difficulty,
        session: sessionNum.toString(),
      });
      router.push(`/result?${params.toString()}`);
      return;
    }
    setCurrentIndex(prev => prev + 1);
    setCurrentInput('');
    setMatrixAnswer([]);
    setSubmitted(false);
    setIsCorrect(false);
  }

  function getDifficultyBadge(diff: string) {
    if (diff === 'easy') return 'badge-easy';
    if (diff === 'medium') return 'badge-medium';
    return 'badge-hard';
  }

  function getCategoryBadge(cat: string) {
    const map: Record<string, string> = {
      convolution: 'badge-convolution',
      feature_map: 'badge-featuremap',
      relu: 'badge-relu',
      pooling: 'badge-pooling',
      softmax: 'badge-softmax',
      architecture: 'badge-architecture',
      hierarchical: 'badge-general',
      flatten: 'badge-general',
    };
    return map[cat] || 'badge-general';
  }

  function renderAnswerInput() {
    const q = currentQuestion;
    if (submitted) return null;

    if (q.type === 'multiple_choice') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {q.options?.map(opt => (
            <button
              key={opt.key}
              className={`choice-option ${currentInput === opt.key ? 'selected' : ''}`}
              onClick={() => setCurrentInput(opt.key)}
            >
              <span className="choice-letter">{opt.key}</span>
              <span style={{ lineHeight: 1.5 }}>{opt.text}</span>
            </button>
          ))}
        </div>
      );
    }

    if (q.type === 'numeric') {
      return (
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-text-3)',
              marginBottom: 8,
            }}
          >
            Jawaban kamu:
          </label>
          <input
            type="number"
            className="input input-mono"
            value={currentInput}
            onChange={e => setCurrentInput(e.target.value)}
            placeholder="Masukkan angka..."
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{ maxWidth: 200 }}
          />
        </div>
      );
    }

    if (q.type === 'matrix') {
      const rows = (q.answer as number[][]).length;
      const cols = (q.answer as number[][])[0]?.length || 0;
      return (
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-text-3)',
              marginBottom: 10,
            }}
          >
            Isi matriks output ({rows}×{cols}):
          </label>
          <MatrixInput rows={rows} cols={cols} onChange={setMatrixAnswer} />
        </div>
      );
    }

    if (q.type === 'short_answer') {
      return (
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-text-3)',
              marginBottom: 8,
            }}
          >
            Jawaban kamu:
          </label>
          <textarea
            className="input"
            value={currentInput}
            onChange={e => setCurrentInput(e.target.value)}
            placeholder="Tulis jawaban..."
            rows={4}
            style={{ resize: 'vertical', lineHeight: 1.6 }}
          />
        </div>
      );
    }

    return null;
  }

  function renderFeedback() {
    if (!submitted) return null;
    const q = currentQuestion;

    return (
      <div className={`animate-fade-in ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`} style={{ padding: '20px 24px' }}>
        {/* Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: '1.25rem' }}>{isCorrect ? '✓' : '✗'}</span>
          <span
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: isCorrect ? 'var(--color-correct)' : 'var(--color-wrong)',
            }}
          >
            {isCorrect ? 'Benar!' : 'Belum tepat'}
          </span>
        </div>

        {/* User answer vs correct */}
        {!isCorrect && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-3)', marginBottom: 4 }}>
              Jawabanmu:
            </div>
            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.9rem',
                color: 'var(--color-wrong)',
                background: 'rgba(220,38,38,0.05)',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: 10,
              }}
            >
              {q.type === 'matrix'
                ? JSON.stringify(matrixAnswer)
                : currentInput || '(kosong)'}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-3)', marginBottom: 4 }}>
              Jawaban yang benar:
            </div>
            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.9rem',
                color: 'var(--color-correct)',
                background: 'rgba(22,163,74,0.05)',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {q.type === 'matrix'
                ? JSON.stringify(q.answer)
                : q.type === 'multiple_choice'
                  ? `${q.answer} — ${q.options?.find(o => o.key === q.answer)?.text}`
                  : String(q.answer)}
            </div>
          </div>
        )}

        {/* For multiple choice — show correct answer text if correct */}
        {isCorrect && q.type === 'multiple_choice' && (
          <div style={{ marginBottom: 12, fontSize: '0.875rem', color: 'var(--color-correct)', fontWeight: 500 }}>
            {q.options?.find(o => o.key === q.answer)?.text}
          </div>
        )}

        {/* Explanation */}
        <div>
          <div
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-text-4)',
              marginBottom: 8,
            }}
          >
            Pembahasan
          </div>
          <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-2)', lineHeight: 1.7, marginBottom: q.explanationSteps ? 12 : 0 }}>
            {q.explanation}
          </p>
          {q.explanationSteps && (
            <div className="step-block" style={{ marginTop: 10 }}>
              {q.explanationSteps.map((step, i) => (
                <div key={i}>{step}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderQuestionDisplay() {
    const q = currentQuestion;
    if (!q.displayData) return null;

    const { input, kernel, feature_map } = q.displayData;

    return (
      <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {input && (
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-3)', marginBottom: 6 }}>
              Input:
            </div>
            <MatrixDisplay matrix={input} />
          </div>
        )}
        {kernel && (
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-3)', marginBottom: 6 }}>
              Kernel:
            </div>
            <MatrixDisplay matrix={kernel} />
          </div>
        )}
        {feature_map && (
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-3)', marginBottom: 6 }}>
              Feature Map:
            </div>
            <MatrixDisplay matrix={feature_map} />
          </div>
        )}
      </div>
    );
  }

  const canSubmit = currentQuestion?.type === 'matrix'
    ? matrixAnswer.length > 0
    : currentInput.trim() !== '';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Navbar */}
      <nav className="navbar">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          <span className="navbar-brand">CNN Quiz Trainer</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-3)', fontWeight: 600 }}>
              Skor: {currentScore}/{userAnswers.length}
            </span>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-3)', fontFamily: 'JetBrains Mono, monospace' }}>
              {formatTime(elapsedSeconds)}
            </span>
          </div>
        </div>
      </nav>

      {/* Progress */}
      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '12px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-3)', fontWeight: 600 }}>
              Soal {currentIndex + 1} dari {questions.length}
            </span>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-4)' }}>
              {Math.round(progress)}% selesai
            </span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <main>
        <section className="section">
          <div className="container-sm">
            {/* Question Card */}
            <div className="card animate-fade-in" style={{ padding: '28px', marginBottom: 16 }}>
              {/* Meta */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <span className={`badge ${getCategoryBadge(currentQuestion.category)}`}>
                  {CATEGORY_LABELS[currentQuestion.category]}
                </span>
                <span className={`badge ${getDifficultyBadge(currentQuestion.difficulty)}`}>
                  {DIFFICULTY_LABELS[currentQuestion.difficulty]}
                </span>
              </div>

              {/* Question */}
              <p
                style={{
                  fontSize: '1.0625rem',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  lineHeight: 1.6,
                  marginBottom: 20,
                  whiteSpace: 'pre-line',
                }}
              >
                {currentQuestion.question}
              </p>

              {/* Data Display */}
              {renderQuestionDisplay()}

              {/* Answer Input */}
              {renderAnswerInput()}

              {/* Feedback */}
              {renderFeedback()}
            </div>

            {/* Actions */}
            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="btn btn-primary btn-lg btn-full"
              >
                Periksa Jawaban
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="btn btn-primary btn-lg btn-full animate-fade-in"
              >
                {currentIndex + 1 >= questions.length ? 'Lihat Hasil →' : 'Soal Berikutnya →'}
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
