# Kuis Viskom CNN

Platform latihan kuis **Convolutional Neural Network (CNN)** berdasarkan materi kuliah Pengolahan Citra Digital.

## Fitur

- 60 soal CNN: convolution, ReLU, pooling, feature map, softmax, arsitektur
- 4 tipe soal: pilihan ganda, numerik, matriks, jawaban singkat
- Sistem multi-user berbasis NIM mahasiswa + password (SHA-256)
- Riwayat latihan append-only — mengulang tidak menghapus hasil lama
- Statistik per kategori & streak
- Responsive: desktop, tablet, mobile

## Struktur Project

```
cnn-quiz/
├── web/                    # Next.js frontend
│   ├── src/
│   │   ├── app/            # Halaman (login, home, setup, quiz, result, history)
│   │   ├── components/     # MatrixInput, MatrixDisplay
│   │   ├── lib/            # Quiz engine, question bank
│   │   └── types/          # TypeScript types
│   └── package.json
└── README.md
```

## Menjalankan Lokal

```bash
cd cnn-quiz/web
npm install
npm run dev
# Buka http://localhost:3000
```

## Teknologi

| Layer | Teknologi |
|---|---|
| Frontend | Next.js 15 + React 19 |
| Styling | Vanilla CSS (design system custom) |
| Auth | NIM + Password (SHA-256, localStorage) |
| State | localStorage per NIM |
| Hosting | Vercel (rencana) |

## Materi Kuis

Berdasarkan PPT kuliah **"14 - Convolution Neural Network (CNN) / Pengolahan Citra Digital"**:

1. Matriks gambar & flatten
2. Kernel/filter
3. Convolution & dot product
4. Feature map & ukuran output
5. ReLU
6. Max pooling & Mean pooling
7. Hierarchical features
8. Softmax
9. Alur CNN (Input → Output)

## Cara Registrasi

1. Buka aplikasi → halaman Login
2. Tab **Daftar Baru** → masukkan NIM (9–10 digit) + Nama + Password
3. Data tersimpan lokal di browser, tidak ada server
4. Login berikutnya: tab **Masuk** → pilih NIM → masukkan password
