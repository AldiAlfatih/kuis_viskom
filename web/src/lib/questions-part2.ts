import type { Question } from '@/types/quiz';

export const ADDITIONAL_QUESTIONS: Question[] = [
  {
    id: 'conv-021',
    category: 'convolution',
    type: 'matrix',
    difficulty: 'medium',
    question: 'Hitung hasil konvolusi (tanpa padding, stride 1) dari citra dan kernel berikut:',
    displayData: {
      input: [[1, 2, 0], [0, 1, 3], [2, 0, 1]],
      kernel: [[1, 0], [0, -1]]
    },
    answer: [[0, -1], [-2, 1]],
    explanation: 'Kalikan area 2x2 dari input dengan kernel, lalu jumlahkan untuk setiap posisi.'
  },
  {
    id: 'conv-022',
    category: 'convolution',
    type: 'matrix',
    difficulty: 'medium',
    question: 'Hitung hasil konvolusi (tanpa padding, stride 1) dari citra dan kernel berikut:',
    displayData: {
      input: [[3, 0, 1], [1, 2, 0], [0, 1, 1]],
      kernel: [[-1, 1], [0, 1]]
    },
    answer: [[-1, 1], [0, -1]],
    explanation: 'Kalikan area 2x2 dari input dengan kernel, lalu jumlahkan untuk setiap posisi.'
  },
  {
    id: 'conv-023',
    category: 'convolution',
    type: 'matrix',
    difficulty: 'medium',
    question: 'Hitung hasil konvolusi (tanpa padding, stride 1):',
    displayData: {
      input: [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
      kernel: [[0, 1], [1, 0]]
    },
    answer: [[2, 2], [2, 2]],
    explanation: 'Tiap area 2x2 berisi nilai 1, dikali kernel yang memiliki dua angka 1.'
  },
  {
    id: 'conv-024',
    category: 'convolution',
    type: 'matrix',
    difficulty: 'medium',
    question: 'Hitung hasil konvolusi (tanpa padding, stride 1):',
    displayData: {
      input: [[0, 2, 0], [2, 0, 2], [0, 2, 0]],
      kernel: [[1, 1], [1, 1]]
    },
    answer: [[4, 4], [4, 4]],
    explanation: 'Jumlahkan setiap matriks blok 2x2.'
  },
  {
    id: 'conv-025',
    category: 'convolution',
    type: 'matrix',
    difficulty: 'medium',
    question: 'Hitung hasil konvolusi (tanpa padding, stride 1):',
    displayData: {
      input: [[4, 2, 1], [0, 1, 3], [1, 0, 2]],
      kernel: [[1, 0], [0, 0]]
    },
    answer: [[4, 2], [0, 1]],
    explanation: 'Kernel ini hanya menyalin nilai di sudut kiri atas setiap jendela 2x2.'
  },
  {
    id: 'conv-026',
    category: 'convolution',
    type: 'matrix',
    difficulty: 'medium',
    question: 'Hitung hasil konvolusi (tanpa padding, stride 1):',
    displayData: {
      input: [[5, 5, 5], [5, 5, 5], [5, 5, 5]],
      kernel: [[-1, -1], [1, 1]]
    },
    answer: [[0, 0], [0, 0]],
    explanation: 'Baris atas dan bawah saling meniadakan.'
  },
  {
    id: 'conv-027',
    category: 'convolution',
    type: 'matrix',
    difficulty: 'medium',
    question: 'Hitung hasil konvolusi (tanpa padding, stride 1):',
    displayData: {
      input: [[1, 0, 1], [0, 1, 0], [1, 0, 1]],
      kernel: [[2, -1], [-1, 2]]
    },
    answer: [[4, -4], [-4, 4]],
    explanation: 'Dot product blok 2x2 dengan kernel.'
  },
  {
    id: 'conv-028',
    category: 'convolution',
    type: 'matrix',
    difficulty: 'medium',
    question: 'Hitung hasil konvolusi (tanpa padding, stride 1):',
    displayData: {
      input: [[3, 3, 0], [1, 2, 1], [0, 1, 2]],
      kernel: [[1, 1], [0, 0]]
    },
    answer: [[6, 3], [3, 3]],
    explanation: 'Hanya menjumlahkan baris teratas jendela 2x2.'
  },
  {
    id: 'conv-029',
    category: 'convolution',
    type: 'matrix',
    difficulty: 'medium',
    question: 'Hitung hasil konvolusi (tanpa padding, stride 1):',
    displayData: {
      input: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
      kernel: [[9, 9], [9, 9]]
    },
    answer: [[0, 0], [0, 0]],
    explanation: 'Input nol menghasilkan output nol.'
  },
  {
    id: 'conv-030',
    category: 'convolution',
    type: 'matrix',
    difficulty: 'medium',
    question: 'Hitung hasil konvolusi (tanpa padding, stride 1):',
    displayData: {
      input: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
      kernel: [[1, 0], [0, 1]]
    },
    answer: [[6, 8], [12, 14]],
    explanation: 'Jumlahkan elemen diagonal utama tiap blok 2x2.'
  },

  {
    id: 'relu-011',
    category: 'relu',
    type: 'matrix',
    difficulty: 'easy',
    question: 'Terapkan ReLU pada matriks berikut:',
    displayData: {
      feature_map: [[-5, 3, -1], [2, -4, 0], [7, -8, 5]]
    },
    answer: [[0, 3, 0], [2, 0, 0], [7, 0, 5]],
    explanation: 'Fungsi ReLU: ganti semua nilai negatif dengan 0.'
  },
  {
    id: 'relu-012',
    category: 'relu',
    type: 'matrix',
    difficulty: 'easy',
    question: 'Terapkan ReLU pada matriks berikut:',
    displayData: {
      feature_map: [[10, -10, 0], [-1, -2, -3], [4, 5, -6]]
    },
    answer: [[10, 0, 0], [0, 0, 0], [4, 5, 0]],
    explanation: 'Semua nilai negatif menjadi nol.'
  },
  {
    id: 'relu-013',
    category: 'relu',
    type: 'matrix',
    difficulty: 'easy',
    question: 'Terapkan ReLU pada matriks berikut:',
    displayData: {
      feature_map: [[0, 0, -1], [1, -5, 2], [-9, 3, -4]]
    },
    answer: [[0, 0, 0], [1, 0, 2], [0, 3, 0]],
    explanation: 'Nilai positif tetap.'
  },
  {
    id: 'relu-014',
    category: 'relu',
    type: 'matrix',
    difficulty: 'easy',
    question: 'Terapkan ReLU pada matriks berikut:',
    displayData: {
      feature_map: [[-1, -2, -3], [-4, -5, -6], [-7, -8, -9]]
    },
    answer: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    explanation: 'Semua nilai negatif diubah menjadi 0.'
  },
  {
    id: 'relu-015',
    category: 'relu',
    type: 'matrix',
    difficulty: 'easy',
    question: 'Terapkan ReLU pada matriks berikut:',
    displayData: {
      feature_map: [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
    },
    answer: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
    explanation: 'Matriks yang tidak memiliki nilai negatif tidak akan berubah setelah ReLU.'
  },
  {
    id: 'relu-016',
    category: 'relu',
    type: 'matrix',
    difficulty: 'easy',
    question: 'Terapkan ReLU pada matriks berikut:',
    displayData: {
      feature_map: [[-3, -4, 2], [5, -1, 0], [-6, -2, 4]]
    },
    answer: [[0, 0, 2], [5, 0, 0], [0, 0, 4]],
    explanation: 'Ganti negatif jadi 0.'
  },
  {
    id: 'relu-017',
    category: 'relu',
    type: 'matrix',
    difficulty: 'easy',
    question: 'Terapkan ReLU pada matriks berikut:',
    displayData: {
      feature_map: [[-9, 9, -9], [9, -9, 9], [-9, 9, -9]]
    },
    answer: [[0, 9, 0], [9, 0, 9], [0, 9, 0]],
    explanation: 'Pola checkerboard negatif dihilangkan.'
  },
  {
    id: 'relu-018',
    category: 'relu',
    type: 'matrix',
    difficulty: 'easy',
    question: 'Terapkan ReLU pada matriks berikut:',
    displayData: {
      feature_map: [[8, -8, 4], [-4, 6, -6], [2, -2, 1]]
    },
    answer: [[8, 0, 4], [0, 6, 0], [2, 0, 1]],
    explanation: 'Simple max(0, x).'
  },
  {
    id: 'relu-019',
    category: 'relu',
    type: 'matrix',
    difficulty: 'easy',
    question: 'Terapkan ReLU pada matriks berikut:',
    displayData: {
      feature_map: [[-100, 100, 0], [0, -50, 50], [20, -20, 0]]
    },
    answer: [[0, 100, 0], [0, 0, 50], [20, 0, 0]],
    explanation: 'Sama saja, nilai sekecil apapun jika negatif jadi 0.'
  },
  {
    id: 'relu-020',
    category: 'relu',
    type: 'matrix',
    difficulty: 'easy',
    question: 'Terapkan ReLU pada matriks berikut:',
    displayData: {
      feature_map: [[3, -1, 4], [-1, 5, -9], [2, -6, 5]]
    },
    answer: [[3, 0, 4], [0, 5, 0], [2, 0, 5]],
    explanation: 'Output ReLU.'
  },

  {
    id: 'pool-011',
    category: 'pooling',
    type: 'matrix',
    difficulty: 'medium',
    question: 'Lakukan Max Pooling (2x2, stride 2):',
    displayData: {
      feature_map: [[1, 3, 2, 4], [5, 6, 8, 7], [9, 0, 1, 2], [3, 4, 5, 6]],
      pooling_window: 2
    },
    answer: [[6, 8], [9, 6]],
    explanation: 'Ambil max dari tiap blok 2x2 yang terpisah.'
  },
  {
    id: 'pool-012',
    category: 'pooling',
    type: 'matrix',
    difficulty: 'medium',
    question: 'Lakukan Max Pooling (2x2, stride 2):',
    displayData: {
      feature_map: [[0, 1, 0, 2], [2, 0, 1, 0], [0, 3, 0, 1], [4, 0, 2, 0]],
      pooling_window: 2
    },
    answer: [[2, 2], [4, 2]],
    explanation: 'Tiap blok 2x2 akan menyusut jadi 1 piksel terbesar.'
  },
  {
    id: 'pool-013',
    category: 'pooling',
    type: 'matrix',
    difficulty: 'medium',
    question: 'Lakukan Max Pooling (2x2, stride 2):',
    displayData: {
      feature_map: [[9, 9, 1, 1], [9, 9, 1, 1], [2, 2, 8, 8], [2, 2, 8, 8]],
      pooling_window: 2
    },
    answer: [[9, 1], [2, 8]],
    explanation: 'Max dari setiap blok seragam.'
  },
  {
    id: 'pool-014',
    category: 'pooling',
    type: 'matrix',
    difficulty: 'medium',
    question: 'Lakukan Max Pooling (2x2, stride 2):',
    displayData: {
      feature_map: [[3, 2, 1, 0], [4, 5, 6, 7], [8, 9, 0, 1], [2, 3, 4, 5]],
      pooling_window: 2
    },
    answer: [[5, 7], [9, 5]],
    explanation: 'Max pool downsampling.'
  },
  {
    id: 'pool-015',
    category: 'pooling',
    type: 'matrix',
    difficulty: 'medium',
    question: 'Lakukan Max Pooling (2x2, stride 2):',
    displayData: {
      feature_map: [[1, 0, 5, 2], [0, 1, 3, 4], [2, 8, 1, 1], [7, 0, 2, 0]],
      pooling_window: 2
    },
    answer: [[1, 5], [8, 2]],
    explanation: 'Max dari setiap grid.'
  },
  {
    id: 'pool-016',
    category: 'pooling',
    type: 'matrix',
    difficulty: 'medium',
    question: 'Lakukan Max Pooling (2x2, stride 2):',
    displayData: {
      feature_map: [[5, 4, 3, 2], [1, 0, 9, 8], [7, 6, 5, 4], [3, 2, 1, 0]],
      pooling_window: 2
    },
    answer: [[5, 9], [7, 5]],
    explanation: 'Downsample matriks menurun.'
  },
  {
    id: 'pool-017',
    category: 'pooling',
    type: 'matrix',
    difficulty: 'medium',
    question: 'Lakukan Max Pooling (2x2, stride 2):',
    displayData: {
      feature_map: [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [1, 1, 1, 1]],
      pooling_window: 2
    },
    answer: [[0, 0], [1, 1]],
    explanation: 'Max Pool dari matriks datar.'
  },
  {
    id: 'pool-018',
    category: 'pooling',
    type: 'matrix',
    difficulty: 'medium',
    question: 'Lakukan Max Pooling (2x2, stride 2):',
    displayData: {
      feature_map: [[7, 2, 4, 1], [0, 3, 5, 8], [9, 6, 2, 3], [1, 4, 7, 0]],
      pooling_window: 2
    },
    answer: [[7, 8], [9, 7]],
    explanation: 'Downsampling dasar.'
  },
  {
    id: 'pool-019',
    category: 'pooling',
    type: 'matrix',
    difficulty: 'medium',
    question: 'Lakukan Max Pooling (2x2, stride 2):',
    displayData: {
      feature_map: [[1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6], [4, 5, 6, 7]],
      pooling_window: 2
    },
    answer: [[3, 5], [5, 7]],
    explanation: 'Gradien akan selalu mengambil sudut kanan bawah di konfigurasi ini.'
  },
  {
    id: 'pool-020',
    category: 'pooling',
    type: 'matrix',
    difficulty: 'medium',
    question: 'Lakukan Max Pooling (2x2, stride 2):',
    displayData: {
      feature_map: [[8, 4, 2, 1], [7, 3, 5, 0], [1, 9, 6, 4], [2, 0, 3, 8]],
      pooling_window: 2
    },
    answer: [[8, 5], [9, 8]],
    explanation: 'Terbesar di tiap regio 2x2.'
  },

  {
    id: 'arch-011',
    category: 'architecture',
    type: 'multiple_choice',
    difficulty: 'medium',
    question: 'Apa kepanjangan dari CNN?',
    options: [
      { key: 'A', text: 'Convolutional Neural Network' },
      { key: 'B', text: 'Computer Neural Network' },
      { key: 'C', text: 'Central Node Network' },
      { key: 'D', text: 'Calculated Neural Network' }
    ],
    answer: 'A',
    explanation: 'Pengetahuan dasar teori CNN.'
  },
  {
    id: 'arch-012',
    category: 'architecture',
    type: 'multiple_choice',
    difficulty: 'medium',
    question: 'Fungsi utama dari layer Pooling adalah...',
    options: [
      { key: 'A', text: 'Menambah jumlah parameter' },
      { key: 'B', text: 'Mengurangi dimensi spasial (downsampling)' },
      { key: 'C', text: 'Menghitung probabilitas kelas' },
      { key: 'D', text: 'Menghasilkan nilai negatif' }
    ],
    answer: 'B',
    explanation: 'Pengetahuan dasar teori CNN.'
  },
  {
    id: 'arch-013',
    category: 'architecture',
    type: 'multiple_choice',
    difficulty: 'medium',
    question: 'Jika input berukuran 5x5 dan kernel 3x3, dengan stride 1 dan tanpa padding, berapakah ukuran outputnya?',
    options: [
      { key: 'A', text: '2x2' },
      { key: 'B', text: '3x3' },
      { key: 'C', text: '4x4' },
      { key: 'D', text: '5x5' }
    ],
    answer: 'B',
    explanation: 'Pengetahuan dasar teori CNN. (5-3)/1 + 1 = 3.'
  },
  {
    id: 'arch-014',
    category: 'architecture',
    type: 'multiple_choice',
    difficulty: 'medium',
    question: 'Padding digunakan dalam CNN untuk...',
    options: [
      { key: 'A', text: 'Memperkecil ukuran gambar' },
      { key: 'B', text: 'Mempertahankan ukuran spasial gambar setelah konvolusi' },
      { key: 'C', text: 'Mengganti fungsi aktivasi' },
      { key: 'D', text: 'Menghapus noise pada gambar' }
    ],
    answer: 'B',
    explanation: 'Pengetahuan dasar teori CNN.'
  },
  {
    id: 'arch-015',
    category: 'architecture',
    type: 'multiple_choice',
    difficulty: 'medium',
    question: 'Apa fungsi aktivasi yang sering digunakan pada output layer CNN untuk klasifikasi multi-kelas?',
    options: [
      { key: 'A', text: 'ReLU' },
      { key: 'B', text: 'Sigmoid' },
      { key: 'C', text: 'Softmax' },
      { key: 'D', text: 'Tanh' }
    ],
    answer: 'C',
    explanation: 'Pengetahuan dasar teori CNN. Softmax mendistribusikan probabilitas ke total 1.'
  },
  {
    id: 'arch-016',
    category: 'architecture',
    type: 'multiple_choice',
    difficulty: 'medium',
    question: 'Layer pada CNN yang meratakan matriks 2D menjadi array 1D disebut...',
    options: [
      { key: 'A', text: 'Convolutional Layer' },
      { key: 'B', text: 'Pooling Layer' },
      { key: 'C', text: 'Flatten Layer' },
      { key: 'D', text: 'Softmax Layer' }
    ],
    answer: 'C',
    explanation: 'Pengetahuan dasar teori CNN. Flatten menyiapkan data untuk Dense layer.'
  },
  {
    id: 'arch-017',
    category: 'architecture',
    type: 'multiple_choice',
    difficulty: 'medium',
    question: 'Masalah "Vanishing Gradient" sering diatasi dengan menggunakan fungsi aktivasi...',
    options: [
      { key: 'A', text: 'Sigmoid' },
      { key: 'B', text: 'Tanh' },
      { key: 'C', text: 'ReLU' },
      { key: 'D', text: 'Step Function' }
    ],
    answer: 'C',
    explanation: 'Pengetahuan dasar teori CNN. ReLU (Rectified Linear Unit) tidak jenuh di wilayah positif.'
  },
  {
    id: 'arch-018',
    category: 'architecture',
    type: 'multiple_choice',
    difficulty: 'medium',
    question: 'Berapa banyak parameter yang dimiliki oleh sebuah kernel berukuran 3x3 (dengan 1 input channel)?',
    options: [
      { key: 'A', text: '3' },
      { key: 'B', text: '6' },
      { key: 'C', text: '9' },
      { key: 'D', text: '10 (jika ada bias)' }
    ],
    answer: 'D',
    explanation: 'Pengetahuan dasar teori CNN. 3x3 = 9 bobot + 1 bias = 10 parameter.'
  },
  {
    id: 'arch-019',
    category: 'architecture',
    type: 'multiple_choice',
    difficulty: 'medium',
    question: 'Fully Connected Layer biasanya ditempatkan di...',
    options: [
      { key: 'A', text: 'Bagian paling awal CNN' },
      { key: 'B', text: 'Bagian tengah setelah konvolusi pertama' },
      { key: 'C', text: 'Bagian akhir arsitektur sebelum output' },
      { key: 'D', text: 'Sebagai pengganti kernel' }
    ],
    answer: 'C',
    explanation: 'Pengetahuan dasar teori CNN. FCL digunakan untuk klasifikasi akhir.'
  },
  {
    id: 'arch-020',
    category: 'architecture',
    type: 'multiple_choice',
    difficulty: 'medium',
    question: 'Proses mengekstraksi fitur dasar (seperti garis atau tepi) biasanya terjadi pada...',
    options: [
      { key: 'A', text: 'Layer konvolusi awal (dangkal)' },
      { key: 'B', text: 'Layer konvolusi dalam (deep)' },
      { key: 'C', text: 'Flatten layer' },
      { key: 'D', text: 'Dense layer' }
    ],
    answer: 'A',
    explanation: 'Pengetahuan dasar teori CNN. Layer dangkal belajar low-level features seperti garis/tepi.'
  }
];
