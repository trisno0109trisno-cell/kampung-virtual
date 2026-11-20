# Kampung Hijau Harmoni (Kampung Virtual)

Aplikasi web perkampungan komunitas interaktif multiplayer real-time berbasis **Node.js**, **Express**, **Socket.io**, dan **HTML5 Canvas**.

## Fitur Utama
- Alun-Alun Harmoni, Pendopo, Mading Kampung, Kolam & Dermaga Mancing Mania (+ Lomba Akhir Pekan)
- Area Pasar Malam & Hiburan (Stand Kuliner, Bianglala Mini, Roda Keberuntungan, Panggung Musik Web Audio, Mode Festival)
- Jalan Raya Utama, Jaringan Jalan Lingkungan & Auto-Tiling Paving Jalan
- Area Komplek Perumahan (Cluster Hunian Warga) dengan Auto-Snap Kavling & Papan Direktori
- Gedung KOPDES, Tempat Usaha Warga, Panel Kontrol Pak Kades (`ADMIN_PIN`), Megafon Suara, dan Camera Angle Switcher (Klasik / Iso 2.5D / Drone)

## Menjalankan Lokal
```bash
npm install
npm start
```
Buka `http://localhost:3000`.

## Deploy ke Render
1. Hubungkan repositori GitHub `kampung-virtual` di [Render Dashboard](https://dashboard.render.com) → **New +** → **Web Service** (atau **Blueprint** menggunakan `render.yaml`).
2. Pastikan pengaturan berikut:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/healthz`
   - **Environment Variable**: `ADMIN_PIN=1234` (ganti sesuai PIN rahasia Pak Kades)
