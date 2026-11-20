---
title: Kampung Virtual
emoji: 🏡
colorFrom: green
colorTo: yellow
sdk: docker
app_port: 7860
pinned: false
---

# Kampung Hijau Harmoni (Kampung Virtual)

Aplikasi web perkampungan komunitas interaktif multiplayer real-time berbasis **Node.js**, **Express**, **Socket.io**, dan **HTML5 Canvas**.

## Fitur Utama
- **Alun-Alun Harmoni, Pendopo & Mading Kampung**
- **Kolam & Dermaga Mancing Mania** lengkap dengan **Lomba Mancing Akhir Pekan**
- **Area Pasar Malam & Hiburan** (Stand Kuliner, Bianglala Mini, Roda Keberuntungan, Panggung Musik Web Audio, Mode Festival)
- **Jalan Raya Utama, Jaringan Jalan Lingkungan & Auto-Tiling Paving Jalan**
- **Area Komplek Perumahan (Cluster Hunian Warga)** dengan Auto-Snap Kavling & Papan Direktori
- **Gedung KOPDES, Tempat Usaha Warga, Panel Kontrol Pak Kades (`ADMIN_PIN`), Megafon Suara, dan Camera Angle Switcher (Klasik / Iso 2.5D / Drone)**

## Menjalankan Lokal
```bash
npm install
npm start
```
Buka `http://localhost:3000`.

## Deploy Gratis Tanpa Kartu Kredit di Hugging Face Spaces
1. Buat akun / login gratis di https://huggingface.co (tanpa kartu kredit).
2. Buka https://huggingface.co/new-space → isi **Space name**: `kampung-virtual`, pilih **SDK**: **Docker** (**Blank**), pilih **Public**, lalu klik **Create Space**.
3. Hubungkan / unggah proyek dari repositori GitHub `kampung-virtual` (atau gunakan Hugging Face token untuk push langsung).
4. Untuk mengganti PIN rahasia Pak Kades, buka **Settings → Variables and secrets → New secret** dengan nama `ADMIN_PIN`.
