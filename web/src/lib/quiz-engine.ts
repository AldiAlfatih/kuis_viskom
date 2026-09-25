import type {
  Question,
  QuizConfig,
  UserAnswer,
  Statistics,
  AttemptRecord,
  Category,
  Difficulty,
} from '@/types/quiz';
import { QUESTION_BANK } from '@/lib/questions';

// ===== USER SESSION =====
// Setiap mahasiswa diidentifikasi dengan NIM (9-10 digit).
// Data statistik disimpan di localStorage dengan key: cnn_quiz_stats_<NIM>
// Satu browser bisa dipakai banyak mahasiswa tanpa tumpang tindih.

export interface UserProfile {
  nim: string;          // 9-10 digit, primary key
  name: string;         // nama tampilan
  registeredAt: string; // ISO date string
  passwordHash: string; // SHA-256 hash — password TIDAK disimpan plaintext
}

const ACTIVE_USER_KEY = 'cnn_quiz_active_nim';
const ALL_USERS_KEY   = 'cnn_quiz_registered_users';

function statsKey(nim: string) {
  return `cnn_quiz_stats_${nim}`;
}

// Validasi NIM: hanya angka, 9-10 digit
export function validateNIM(nim: string): string | null {
  const cleaned = nim.trim().replace(/\s/g, '');
  if (!/^\d+$/.test(cleaned)) return 'NIM hanya boleh berisi angka.';
  if (cleaned.length < 9)     return 'NIM minimal 9 digit.';
  if (cleaned.length > 10)    return 'NIM maksimal 10 digit.';
  return null; // null = valid
}

// Hash password menggunakan Web Crypto SHA-256
// Tidak perlu library eksternal — native browser API
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  // Tambahkan NIM sebagai salt sederhana agar hash berbeda antar user
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Verifikasi password saat login
export async function verifyPassword(inputPassword: string, storedHash: string): Promise<boolean> {
  const inputHash = await hashPassword(inputPassword);
  return inputHash === storedHash;
}

export function validatePassword(password: string): string | null {
  if (password.length < 6) return 'Password minimal 6 karakter.';
  if (password.length > 64) return 'Password maksimal 64 karakter.';
  return null;
}

// ===== ACTIVE USER MANAGEMENT =====

export function getActiveUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(ACTIVE_USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function setActiveUser(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(profile));

  // Upsert ke daftar semua user (key = NIM)
  const users = getAllUsers();
  const idx = users.findIndex(u => u.nim === profile.nim);
  if (idx === -1) {
    users.push(profile);
  } else {
    users[idx] = profile; // update nama jika berubah
  }
  localStorage.setItem(ALL_USERS_KEY, JSON.stringify(users));
}

export function clearActiveUser(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(ACTIVE_USER_KEY);
}

export function getAllUsers(): UserProfile[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ALL_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function deleteUser(nim: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(statsKey(nim));
  const users = getAllUsers().filter(u => u.nim !== nim);
  localStorage.setItem(ALL_USERS_KEY, JSON.stringify(users));
}

// ===== STATISTICS =====

export function getStatistics(nim?: string): Statistics {
  if (typeof window === 'undefined') return defaultStats();
  const key = nim ?? getActiveUser()?.nim;
  if (!key) return defaultStats();
  const raw = localStorage.getItem(statsKey(key));
  if (!raw) return defaultStats();
  try { return JSON.parse(raw); } catch { return defaultStats(); }
}

function saveStatistics(stats: Statistics, nim?: string): void {
  if (typeof window === 'undefined') return;
  const key = nim ?? getActiveUser()?.nim;
  if (!key) return;
  localStorage.setItem(statsKey(key), JSON.stringify(stats));
}

function defaultStats(): Statistics {
  return {
    totalQuestions: QUESTION_BANK.length,
    attempted: 0,
    accuracy: 0,
    streak: 0,
    byCategory: {},
    wrongQuestionIds: [],
    history: [],
  };
}

// ===== SAVE ATTEMPT =====

export function saveAttempt(
  config: QuizConfig,
  answers: UserAnswer[],
  durationSeconds: number,
  nim?: string
): Statistics {
  const user = nim ?? getActiveUser()?.nim;
  const stats = getStatistics(user);

  const correct = answers.filter(a => a.isCorrect).length;
  const total   = answers.length;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  // Update streak (sesi berturut-turut >= 60%)
  stats.streak = accuracy >= 60 ? (stats.streak || 0) + 1 : 0;

  // Update akurasi kumulatif (running average — tidak mengganti, hanya diakumulasikan)
  const allAttempted = stats.attempted + total;
  const prevCorrect  = Math.round((stats.accuracy / 100) * stats.attempted);
  stats.accuracy     = allAttempted > 0
    ? Math.round(((prevCorrect + correct) / allAttempted) * 100)
    : 0;
  stats.attempted = allAttempted;

  // Update statistik per-kategori (kumulatif)
  answers.forEach(a => {
    const q = QUESTION_BANK.find(q => q.id === a.questionId);
    if (!q) return;
    if (!stats.byCategory[q.category]) {
      stats.byCategory[q.category] = { total: 0, correct: 0, accuracy: 0 };
    }
    stats.byCategory[q.category].total++;
    if (a.isCorrect) stats.byCategory[q.category].correct++;
    const cat = stats.byCategory[q.category];
    cat.accuracy = Math.round((cat.correct / cat.total) * 100);
  });

  // Update daftar soal yang salah
  // — jika sekarang benar → hapus dari daftar
  // — jika masih salah   → pastikan ada di daftar
  const wrongSet = new Set(stats.wrongQuestionIds);
  answers.filter(a =>  a.isCorrect).forEach(a => wrongSet.delete(a.questionId));
  answers.filter(a => !a.isCorrect).forEach(a => wrongSet.add(a.questionId));
  stats.wrongQuestionIds = Array.from(wrongSet);

  // Simpan detail jawaban per soal untuk keperluan review riwayat
  const answerDetails = answers.map(a => {
    const q = QUESTION_BANK.find(q => q.id === a.questionId);
    return {
      questionId: a.questionId,
      isCorrect:  a.isCorrect,
      category:   (q?.category  ?? 'convolution') as Category,
      difficulty: (q?.difficulty ?? 'medium')     as Difficulty,
    };
  });

  /**
   * ✅ SETIAP SESI SELALU DITAMBAHKAN SEBAGAI RECORD BARU.
   * Record lama TIDAK PERNAH dihapus atau ditimpa.
   * Mengulang latihan = menambah entry baru ke history[].
   * Sehingga mahasiswa bisa melihat seluruh progres dari waktu ke waktu.
   * Maksimal 50 sesi terakhir disimpan.
   */
  const record: AttemptRecord = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date: new Date().toISOString(),
    config,
    score: accuracy,
    correct,
    total,
    duration: durationSeconds,
    answerDetails,
  };
  stats.history = [record, ...(stats.history ?? [])].slice(0, 50);

  saveStatistics(stats, user);
  return stats;
}

// ===== ANSWER VALIDATION =====

export function validateAnswer(question: Question, userRaw: string): boolean {
  const { type, answer, keywords } = question;

  switch (type) {
    case 'multiple_choice':
      return userRaw.trim().toUpperCase() === String(answer).toUpperCase();

    case 'numeric': {
      const userNum    = parseFloat(userRaw.replace(',', '.'));
      const correctNum = parseFloat(String(answer));
      if (isNaN(userNum)) return false;
      return Math.abs(userNum - correctNum) < 0.01;
    }

    case 'matrix': {
      try {
        const userMatrix: number[][] = typeof userRaw === 'string'
          ? JSON.parse(userRaw)
          : (userRaw as unknown as number[][]);
        const correctMatrix = answer as number[][];
        if (userMatrix.length !== correctMatrix.length) return false;
        for (let i = 0; i < correctMatrix.length; i++) {
          if (userMatrix[i].length !== correctMatrix[i].length) return false;
          for (let j = 0; j < correctMatrix[i].length; j++) {
            if (Math.abs(userMatrix[i][j] - correctMatrix[i][j]) > 0.01) return false;
          }
        }
        return true;
      } catch {
        return false;
      }
    }

    case 'short_answer': {
      if (!keywords || keywords.length === 0) return false;
      const userWords = userRaw.toLowerCase().split(/[\s,.-]+/);
      
      const matched = keywords.filter(kw => {
        const kwLower = kw.toLowerCase();
        // Cek apakah ada kata dari user yang cukup mirip dengan keyword
        return userWords.some(uw => {
          if (uw.length < 3) return uw === kwLower; // Kata pendek harus sama persis
          
          // Helper Levenshtein Distance sederhana untuk toleransi typo
          const a = uw;
          const b = kwLower;
          const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
          for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
          for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
          for (let j = 1; j <= b.length; j++) {
            for (let i = 1; i <= a.length; i++) {
              const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
              matrix[j][i] = Math.min(
                matrix[j][i - 1] + 1,
                matrix[j - 1][i] + 1,
                matrix[j - 1][i - 1] + indicator
              );
            }
          }
          const distance = matrix[b.length][a.length];
          // Toleransi: panjang kata <= 5 boleh beda 1 huruf, > 5 boleh beda 2 huruf
          const tolerance = kwLower.length <= 5 ? 1 : 2;
          return distance <= tolerance || kwLower.includes(uw) || uw.includes(kwLower);
        });
      });
      
      return matched.length >= Math.ceil(keywords.length * 0.4);
    }

    default:
      return false;
  }
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function formatDate(dateStr: string | Date): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
