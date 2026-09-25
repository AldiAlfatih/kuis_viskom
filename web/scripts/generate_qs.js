const fs = require('fs');
const path = require('path');

const qBankPath = path.join(__dirname, '../src/lib/questions.ts');
let content = fs.readFileSync(qBankPath, 'utf8');

let newQuestions = [];

// 1. Generate 10 Conv Matrix Questions
for(let i=21; i<=30; i++) {
  const input = Array(3).fill(0).map(() => Array(3).fill(0).map(() => Math.floor(Math.random() * 5)));
  const kernel = Array(2).fill(0).map(() => Array(2).fill(0).map(() => Math.floor(Math.random() * 3) - 1));
  const output = Array(2).fill(0).map(() => Array(2).fill(0));
  
  for (let r=0; r<2; r++) {
    for (let c=0; c<2; c++) {
      let sum = 0;
      for (let kr=0; kr<2; kr++) {
        for (let kc=0; kc<2; kc++) {
          sum += input[r+kr][c+kc] * kernel[kr][kc];
        }
      }
      output[r][c] = sum;
    }
  }

  newQuestions.push(`  {
    id: 'conv-0${i}',
    category: 'convolution',
    type: 'matrix',
    difficulty: 'medium',
    question: 'Hitung hasil konvolusi (tanpa padding, stride 1) dari citra dan kernel berikut:',
    displayData: {
      input: ${JSON.stringify(input)},
      kernel: ${JSON.stringify(kernel)}
    },
    answer: ${JSON.stringify(output)},
    explanation: 'Kalikan area 2x2 dari input dengan kernel, lalu jumlahkan untuk setiap posisi.'
  }`);
}

// 2. Generate 10 ReLU Questions
for(let i=11; i<=20; i++) {
  const input = Array(3).fill(0).map(() => Array(3).fill(0).map(() => Math.floor(Math.random() * 20) - 10));
  const output = input.map(row => row.map(v => Math.max(0, v)));
  newQuestions.push(`  {
    id: 'relu-0${i}',
    category: 'relu',
    type: 'matrix',
    difficulty: 'easy',
    question: 'Terapkan fungsi aktivasi ReLU pada feature map berikut:',
    displayData: {
      feature_map: ${JSON.stringify(input)}
    },
    answer: ${JSON.stringify(output)},
    explanation: 'Fungsi ReLU: f(x) = max(0, x). Ganti semua nilai negatif menjadi 0, dan biarkan nilai positif tetap.'
  }`);
}

// 3. Generate 10 Max Pooling Questions
for(let i=11; i<=20; i++) {
  const input = Array(4).fill(0).map(() => Array(4).fill(0).map(() => Math.floor(Math.random() * 10)));
  const output = Array(2).fill(0).map(() => Array(2).fill(0));
  for(let r=0; r<2; r++) {
    for(let c=0; c<2; c++) {
      output[r][c] = Math.max(
        input[r*2][c*2], input[r*2][c*2+1],
        input[r*2+1][c*2], input[r*2+1][c*2+1]
      );
    }
  }
  newQuestions.push(`  {
    id: 'pool-0${i}',
    category: 'pooling',
    type: 'matrix',
    difficulty: 'medium',
    question: 'Lakukan Max Pooling dengan ukuran filter 2x2 (stride 2) pada input berikut:',
    displayData: {
      feature_map: ${JSON.stringify(input)},
      pooling_window: 2
    },
    answer: ${JSON.stringify(output)},
    explanation: 'Bagi input 4x4 menjadi 4 blok berukuran 2x2. Ambil nilai terbesar dari masing-masing blok.'
  }`);
}

// 4. Generate 10 Multiple Choice Questions (Theory)
const theoryQs = [
  {q: "Apa kepanjangan dari CNN?", o: [{k:'A',t:"Convolutional Neural Network"}, {k:'B',t:"Computer Neural Network"}, {k:'C',t:"Central Node Network"}, {k:'D',t:"Calculated Neural Network"}], a: 'A'},
  {q: "Fungsi utama dari layer Pooling adalah...", o: [{k:'A',t:"Menambah jumlah parameter"}, {k:'B',t:"Mengurangi dimensi spasial (downsampling)"}, {k:'C',t:"Menghitung probabilitas kelas"}, {k:'D',t:"Menghasilkan nilai negatif"}], a: 'B'},
  {q: "Jika input berukuran 5x5 dan kernel 3x3, dengan stride 1 dan tanpa padding, berapakah ukuran outputnya?", o: [{k:'A',t:"2x2"},{k:'B',t:"3x3"},{k:'C',t:"4x4"},{k:'D',t:"5x5"}], a:'B'},
  {q: "Padding digunakan dalam CNN untuk...", o: [{k:'A',t:"Memperkecil ukuran gambar"},{k:'B',t:"Mempertahankan ukuran spasial gambar setelah konvolusi"},{k:'C',t:"Mengganti fungsi aktivasi"},{k:'D',t:"Menghapus noise pada gambar"}], a:'B'},
  {q: "Apa fungsi aktivasi yang sering digunakan pada output layer CNN untuk klasifikasi multi-kelas?", o: [{k:'A',t:"ReLU"},{k:'B',t:"Sigmoid"},{k:'C',t:"Softmax"},{k:'D',t:"Tanh"}], a:'C'},
  {q: "Layer pada CNN yang meratakan matriks 2D menjadi array 1D disebut...", o: [{k:'A',t:"Convolutional Layer"},{k:'B',t:"Pooling Layer"},{k:'C',t:"Flatten Layer"},{k:'D',t:"Softmax Layer"}], a:'C'},
  {q: "Masalah 'Vanishing Gradient' sering diatasi dengan menggunakan fungsi aktivasi...", o: [{k:'A',t:"Sigmoid"},{k:'B',t:"Tanh"},{k:'C',t:"ReLU"},{k:'D',t:"Step Function"}], a:'C'},
  {q: "Berapa banyak parameter yang dimiliki oleh sebuah kernel berukuran 3x3 (dengan 1 input channel)?", o: [{k:'A',t:"3"},{k:'B',t:"6"},{k:'C',t:"9"},{k:'D',t:"10 (jika ada bias)"}], a:'D'},
  {q: "Fully Connected Layer biasanya ditempatkan di...", o: [{k:'A',t:"Bagian paling awal CNN"},{k:'B',t:"Bagian tengah setelah konvolusi pertama"},{k:'C',t:"Bagian akhir arsitektur sebelum output"},{k:'D',t:"Sebagai pengganti kernel"}], a:'C'},
  {q: "Proses mengekstraksi fitur dasar (seperti garis atau tepi) biasanya terjadi pada...", o: [{k:'A',t:"Layer konvolusi awal (dangkal)"},{k:'B',t:"Layer konvolusi dalam (deep)"},{k:'C',t:"Flatten layer"},{k:'D',t:"Dense layer"}], a:'A'}
];

theoryQs.forEach((tq, i) => {
  newQuestions.push(`  {
    id: 'arch-0${10 + i + 1}',
    category: 'architecture',
    type: 'multiple_choice',
    difficulty: 'medium',
    question: '${tq.q}',
    options: ${JSON.stringify(tq.o, null, 4).replace(/\\n/g, '').replace(/"k"/g, 'key').replace(/"t"/g, 'text')},
    answer: '${tq.a}',
    explanation: 'Pengetahuan dasar teori CNN.'
  }`);
});

const insertionIndex = content.lastIndexOf('];');
const finalContent = content.slice(0, insertionIndex) + ',\\n' + newQuestions.join(',\\n') + '\\n' + content.slice(insertionIndex);

fs.writeFileSync(qBankPath, finalContent);
console.log('Successfully added 40 questions!');
