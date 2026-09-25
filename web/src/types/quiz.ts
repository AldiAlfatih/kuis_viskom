// ===== QUESTION TYPES =====

export type QuestionType = 'multiple_choice' | 'numeric' | 'matrix' | 'short_answer';

export type Category =
  | 'convolution'
  | 'feature_map'
  | 'relu'
  | 'pooling'
  | 'softmax'
  | 'architecture'
  | 'flatten'
  | 'hierarchical';

export type Difficulty = 'easy' | 'medium' | 'hard';

// ===== DATA STRUCTURES =====

export interface MatrixData {
  input?: number[][];
  kernel?: number[][];
  feature_map?: number[][];
  pooling_window?: number;
  input_size?: number;
  kernel_size?: number;
}

export interface ChoiceOption {
  key: string;
  text: string;
}

export interface Question {
  id: string;
  category: Category;
  difficulty: Difficulty;
  type: QuestionType;
  question: string;
  displayData?: MatrixData;
  options?: ChoiceOption[];
  answer: string | number | number[][];
  keywords?: string[];
  explanation: string;
  explanationSteps?: string[];
}

// ===== QUIZ SESSION =====

export interface QuizSession {
  questions: Question[];
  currentIndex: number;
  answers: UserAnswer[];
  startedAt: Date;
  finishedAt?: Date;
  config: QuizConfig;
}

export interface QuizConfig {
  count: number;
  category: Category | 'all' | 'wrong';
  difficulty: Difficulty | 'mixed';
}

export interface UserAnswer {
  questionId: string;
  userAnswer: string | number | number[][];
  isCorrect: boolean;
  answeredAt: Date;
}

// ===== STATISTICS =====

export interface Statistics {
  totalQuestions: number;
  attempted: number;       // jumlah soal total yg pernah dikerjakan (kumulatif)
  accuracy: number;        // akurasi rata-rata kumulatif (%)
  streak: number;          // berapa sesi berturut-turut >= 60%
  byCategory: Record<string, CategoryStat>;
  wrongQuestionIds: string[];
  history: AttemptRecord[];  // setiap sesi tersimpan di sini, tidak pernah ditimpa
}

export interface CategoryStat {
  total: number;
  correct: number;
  accuracy: number;
}

/**
 * Satu sesi latihan yang sudah selesai.
 * Setiap kali mahasiswa menyelesaikan sesi (termasuk mengulang),
 * record baru ditambahkan ke history[]. Record lama TIDAK dihapus.
 */
export interface AttemptRecord {
  id: string;              // timestamp unik
  date: Date | string;     // kapan sesi selesai
  config: QuizConfig;      // pengaturan sesi (materi, difficulty, jumlah)
  score: number;           // persentase (0-100)
  correct: number;         // jumlah jawaban benar
  total: number;           // jumlah soal dalam sesi
  duration: number;        // durasi dalam detik
  /** Detail per soal dalam sesi ini — digunakan untuk review */
  answerDetails?: AnswerDetail[];
}

export interface AnswerDetail {
  questionId: string;
  isCorrect: boolean;
  category: Category;
  difficulty: Difficulty;
}

// ===== LABEL HELPERS =====

export const CATEGORY_LABELS: Record<string, string> = {
  convolution: 'Convolution',
  feature_map: 'Feature Map',
  relu: 'ReLU',
  pooling: 'Pooling',
  softmax: 'Softmax',
  architecture: 'Arsitektur CNN',
  flatten: 'Flatten',
  hierarchical: 'Hierarchical Features',
  all: 'Semua Materi',
  wrong: 'Soal yang Pernah Salah',
};

export const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Mudah',
  medium: 'Sedang',
  hard: 'Sulit',
  mixed: 'Acak',
};
