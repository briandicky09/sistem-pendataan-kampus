# Sistem Pendataan Kampus

Aplikasi web admin untuk manajemen data mahasiswa dan dosen kampus — dibangun dengan HTML5, Bootstrap 5, dan Vanilla JavaScript, tanpa backend.

## Fitur

- **Dashboard** (`index.html`) – ringkasan statistik kampus.
- **Input Dosen** (`input-dosen.html`) – form penambahan data dosen (validasi form, dummy submit).
- **Input Mahasiswa** (`input-mahasiswa.html`) – form penambahan data mahasiswa.
- **Data Dosen** (`data-dosen.html`) – tabel daftar dosen.
- **Data Mahasiswa** (`data-mahasiswa.html`) – tabel daftar mahasiswa lengkap dengan NIM, program studi, progres studi, dan status (aktif/cuti/lulus).
- **Live Preview** (`live-preview.html`) – halaman pratinjau.
- **Documentation** (`documentation.html`) – halaman dokumentasi/panduan penggunaan.
- Sidebar & topbar responsif dengan submenu yang bisa dibuka/tutup, dibangun otomatis lewat `shell.js` untuk halaman baru.

## Struktur Proyek

```
├── index.html                 # Dashboard
├── input-dosen.html           # Form input dosen
├── input-mahasiswa.html       # Form input mahasiswa
├── data-dosen.html            # Tabel data dosen
├── data-mahasiswa.html        # Tabel data mahasiswa
├── live-preview.html          # Halaman live preview
├── documentation.html         # Halaman dokumentasi
└── assets/
    ├── css/                   # Styling kustom
    ├── js/
    │   ├── script.js          # Handler form & interaksi umum (toggle sidebar, validasi form dosen, dll)
    │   ├── shell.js           # Generator sidebar + topbar (menu navigasi)
    │   ├── topbar.js          # Logika topbar
    │   └── data-mahasiswa.js  # Data dummy mahasiswa & render tabel
    └── img/                   # Aset gambar
```

## Teknologi

- HTML5 & CSS3
- [Bootstrap 5.3.2](https://getbootstrap.com/) (via CDN)
- [Font Awesome 6.5.1](https://fontawesome.com/) (via CDN)
- Google Fonts – Inter
- JavaScript (vanilla, tanpa framework)

## Cara Menjalankan

Proyek ini murni statis (HTML/CSS/JS), tidak memerlukan proses build atau instalasi dependensi.

1. Clone atau unduh repositori ini.
2. Buka file `index.html` langsung di browser, **atau**
3. Jalankan server lokal sederhana, misalnya:

   ```bash
   python3 -m http.server 8000
   ```

   lalu buka `http://localhost:8000` di browser.

## Catatan

- Data mahasiswa & dosen saat ini masih berupa data dummy yang ditulis langsung di JavaScript (`data-mahasiswa.js`), belum terhubung ke database/backend.
- Submit form (input dosen/mahasiswa) masih bersifat simulasi (hanya menampilkan alert, tidak menyimpan data secara permanen).
