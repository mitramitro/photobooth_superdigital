# PRD — Photobooth Studio (Platform SaaS Multi-Tenant)

> **Versi:** 1.0 — Fase Inti
> **Tanggal:** 5 September 2026
> **Status:** Draft untuk implementasi full-stack
> **Dokumen ini berfungsi sebagai spesifikasi untuk dikerjakan oleh AI coding agent / developer.** Bacalah seluruh dokumen sebelum memulai implementasi.

---

## 1. Ringkasan Eksekutif

**Photobooth Studio** adalah platform SaaS untuk bisnis photobooth (sewa foto booth untuk event/acara). Platform ini bersifat **multi-tenant**: pemilik bisnis mendaftar melalui website (franchise-style self-service), memilih paket berlangganan, membayar, lalu mendapatkan **akun Admin** workspace-nya sendiri.

Vendor platform (penyedia layanan = product owner) memiliki akses **super_admin** untuk memantau seluruh tenant (workspace), pesanan, dan kesehatan platform dari dashboard terpusat. Setiap admin workspace dapat membuat akun **Operator** untuk menjalankan sesi foto dan mengelola kiosk.

Tujuan utama PRD fase ini: **melengkapi backend (API + database + auth + RBAC) dan landing page** untuk menghubungkan seluruh halaman frontend yang sudah ada. Frontend saat ini sudah dibangun lengkap dengan data mock/statis dan tinggal di-wire ke backend nyata.

---

## 2. Konteks & State Saat Ini (PENTING — Baca Dulu)

### 2.1 Tech Stack Aktual

| Komponen | Teknologi |
|---|---|
| Backend | Laravel 13 (PHP 8.2), Eloquent, Sanctum, Scalar API docs |
| Database | **MySQL** (`.env`: `DB_CONNECTION=mysql`, `DB_DATABASE=photobooth`) |
| Frontend | React 18 + Inertia.js v2 + Tailwind CSS (via Vite) |
| Auth | Laravel Breeze (React + Inertia) |
| Ekstensi | `inertiajs/inertia-laravel`, `tightenco/ziggy`, `scalar/laravel`, `laravel/breeze` |

### 2.2 Kondisi Repository Saat Ini

- **Frontend admin sudah lengkap dan berisi data statis (mock)** — semua halaman di bawah `resources/js/Pages/` belum terhubung ke database:
  - `Admin/Dashboard.jsx`
  - `Admin/Projects/Index.jsx` — Proyek (Project Management)
  - `Admin/Devices/Index.jsx` — Perangkat (Booth & kiosk monitoring)
  - `Admin/Templates/Index.jsx` — Template visual
  - `Admin/Frames/Index.jsx` — Frame visual
  - `Admin/Sessions/Index.jsx` — Sesi Foto
  - `Admin/Monitoring/Index.jsx` — Device Health & Alert
  - `Admin/Users/Index.jsx` — Manajemen Pengguna (membuat operator)
  - `Admin/Roles/Index.jsx` — Roles & Permissions
  - `Admin/Settings/Index.jsx` — Pengaturan
  - `Admin/ApiTokens/Index.jsx` — Sanctum API Tokens
  - `Admin/Photobooth/Kiosk.jsx` — Simulator kiosk live
  - `Admin/Gallery/Index.jsx` — Galeri
  - `Admin/Transactions/Index.jsx` — Transaksi
  - `Admin/Subscription/Index.jsx` — Langganan (sudah memuat 3 paket: **Starter Rp 299rb/bulan, Event Pro Rp 699rb/bulan, Enterprise Rp 1,5jt/bulan**)
  - `Admin/Wallet/Index.jsx` — Dompet
- **Landing page kosong**: `resources/js/Pages/LandingPage/Index.jsx` hanya memuat `<LandingLayout>` (navbar + footer + tombol "Masuk"). Seluruh konten yang diperlukan di fase ini harus dibangun.
- **Backend masih default Breeze**: hanya tabel `users` (tanpa kolom role), `password_reset_tokens`, `sessions`; `ProfileController`; `routes/api.php` masih berisi endpoint **mock** untuk mobile/kiosk (`/v1/auth/login`, `/v1/booths`, `/v1/sessions/create`).
- **Layout sudah siap**: `resources/js/Layouts/` berisi `AdminLayout.jsx` (menu sidebar per kelompok), `LandingLayout.jsx`, `GuestLayout.jsx`, `AuthenticatedLayout.jsx`. Ada pustaka UI lengkap di `resources/js/Components/ui/` (`Card`, `Table`, `Modal`, `PageHeader`, `StatCard`, `StatusBadge`, `Button`, `Pagination`, `useToast`, dll).

### 2.3 Aturan Integrasi Frontend

1. **Jangan menghapus/merombak struktur halaman yang sudah ada.** Ikuti pola Inertia: controller mengirim props, halaman React menampilkannya.
2. Gunakan **naming/halaman yang sudah ada** sebagai target render untuk route Inertia (contoh: `/admin/users` → `Admin/Users/Index`).
3. Semua **copy/teks UI berbahasa Indonesia** (konsisten dengan halaman existing).
4. Gunakan komponen dari `resources/js/Components/ui` yang sudah ada; jangan buat duplikat.
5. Data statis yang sudah ada di frontend bisa dijadikan **Seed / factory** (contoh: data paket langganan & status device di Dashboard).
6. Wajib mempertahankan halaman `Admin/ScalarDocs` (dokumentasi API) dan route `/docs`.

---

## 3. Persona & Struktur Role

Terdapat **3 peran** (role) di platform. Nilai disimpan sebagai kolom `role` bertipe enum di tabel `users`.

| Role | Nilai `role` | Siapa | Kemampuan inti |
|---|---|---|---|
| Super Admin | `super_admin` | Penyedia layanan / platform owner (Anda) | Monitor **semua** workspace & tenant, lihat laporan platform, kelola status pembayaran/plan, tidak terkait workspace tertentu |
| Admin | `admin` | Pemilik bisnis photobooth (tenant) | Kelola workspace sendiri: proyek, device, template, frame, sesi, transaksi, galeri, pengaturan, dompet, langganan, **membuat akun operator** |
| Operator | `operator` | Karyawan/pegawai tenant | Panel **terbatas**: dashboard ringkas, kiosk/benchmark sesi foto, galeri. **Tidak ada akses** ke: pengaturan, pengguna, keuangan (transaksi/dompet/langganan), roles, API tokens |

### 3.1 Matriks Izin

| Fitur / Menu | super_admin | admin | operator |
|---|---|---|---|
| Dashboard (ringkasan operasional) | Platform-level (tenant overview) | Milik workspace sendiri | Ringkas (hanya sesi aktif & galeri kunci) |
| Landing / promosi | — | — | — |
| Proyek | (read-only semua tenant) | CRUD milik sendiri | — |
| Perangkat (devices) | (read-only semua tenant) | CRUD milik sendiri | Lihat saja |
| Template & Frame | (bisa upload global) | CRUD milik sendiri | — |
| Sesi Foto | Monitor semua | CRUD sendiri | Mulai/kelola sesi (kiosk) |
| Galeri | Monitor semua | CRUD sendiri | Lihat + flag foto |
| Transaksi | Monitor semua | CRUD sendiri | — |
| Dompet | — | Kelola sendiri | — |
| Langganan | Kelola plan & status tenant | Kelola sendiri | — |
| Pengguna (buat operator) | Kelola semua user | Buat/kelola operator miliknya | — |
| Roles & Permissions | Kelola (dasar) | — | — |
| Pengaturan | Platform | Workspace | — |
| API Tokens | Kelola | — | — |
| Monitoring | Global health | Milik sendiri | — |

### 3.2 Redirect Login Berdasarkan Role

- `super_admin` → `/admin/monitoring` (atau dashboard super admin)
- `admin` → `/dashboard`
- `operator` → `/operator` (panel operator)

Root route `/` saat user sudah login harus me-redirect sesuai role di atas.

---

## 4. Arsitektur Multi-Tenant

### 4.1 Pendekatan

Gunakan **single database dengan scoping `workspace_id`** (simple multi-tenancy). Tidak perlu library baru; implementasikan lewat:

- Relasi `BelongsTo Workspace` pada model bisnis (Project, Device, Session, Template, Frame, Transaction, Galeri, dst).
- **Global Scope** pada model bisnis sehingga query queried tenant otomatis terfilter (kecuali `super_admin`).
- Middleware `EnsureWorkspaceScope` / query-builder helper.
- `role` enum pada `users` + **Policies/Gates** untuk kontrol akses CRUD.

### 4.2 Aturan Scoping

- `super_admin` **tidak** terikat workspace (`workspace_id = null`); seluruh query-nya memakai `withoutGlobalScope`/helper untuk melihat semua tenant.
- `admin` & `operator` **wajib** punya `workspace_id`; seluruh data mereka di-scope ke workspace tersebut.
- Data master yang global (Plan, super admin) tidak di-scope.

### 4.3 Flow Umum (Alur Bisnis)

1. User mengunjungi **Landing Page** → melihat promosi, paket, cara kerja.
2. User menekan tombol **"Daftar Franchise"** → halaman registrasi franchise.
3. User mengisi data bisnis (nama workspace/brand, nama kontak, email, password) + **memilih paket** (Starter/Event Pro/Enterprise).
4. Sistem membuat: `workspace` (status `pending`), `user` dengan role `admin` (status `pending`), dan `subscription` draft.
5. User dibawa ke **pembayaran** (checkout). Fase inti memakai **Midtrans Snap** (payment gateway). Endpoint checkout mengembalikan `snap_token`; frontend menampilkan popup Midtrans.
6. Midtrans mengirim **webhook** (`payment notification`). Webhook diverifikasi signature-nya; saat status `settlement`/`capture` sukses → `workspace` status `active`, `admin` status `active`, `subscription` status `active`.
7. Admin login → dashboard workspace aktif → bisa membuat akun **Operator**.
8. Operator login → panel operator terbatas → menjalankan sesi foto (kiosk).
9. `super_admin` login → melihat **semua workspace**, status langganan, jumlah operator, ringkasan sesi/transaksi tiap tenant.

---

## 5. Modul Fase Inti — Functional Requirements

> Prioritas fase ini adalah: **Auth & RBAC, Landing + Franchise, Pembayaran, Langganan, Panel Operator, Super Admin Monitoring, dan kerangka data (DB + CRUD dasar) modul admin yang sudah ada frontend-nya.**

### FR-1. Landing Page (Promosi + CTA Franchise)

- **FR-1.1** Bangun konten landing page di `resources/js/Pages/LandingPage/Index.jsx` memakai `LandingLayout`.
- **FR-1.2** Section promosi harus mencakup minimal:
  - Hero (headline + subheadline + tombol CTA "Daftar Franchise" + "Lihat Paket")
  - Fitur utama (fitur kiosk, template & frame, galeri digital, monitoring realtime, dll.)
  - **Paket langganan** (3 kartu paket — data sama dengan `Admin/Subscription/Index.jsx`)
  - Cara kerja / langkah berlangganan
  - Testimoni & FAQ (konten sederhana)
  - Footer kontak
- **FR-1.3** Setiap kartu paket memiliki tombol **"Daftar & Berlangganan"** yang menuju halaman registrasi franchise dengan paket terpilih.

### FR-2. Registrasi Franchise & Akun Admin Otomatis

- **FR-2.1** Route `GET/POST /register` (atau `/register/franchise`) memakai halaman `resources/js/Pages/Auth/Register.jsx` — sesuaikan agar form berisi:
  - Nama workspace/brand
  - Nama pemilik
  - Email (unique)
  - Password + konfirmasi
  - Paket yang dipilih (id `plan_id`)
- **FR-2.2** Proses registrasi membuat `Workspace` (status `pending`) + `User` (role `admin`, status `pending`) + `Subscription` (status `pending`) secara **transaksional**.
- **FR-2.3** Verifikasi email opsional pada fase ini (gunakan Breeze default tapi non-blokir untuk checkout). Disarankan tetap aktif namun user bisa lanjut checkout tanpa verifikasi karena butuh akses cepat.
- **FR-2.4** Setelah registrasi berhasil, langsung lanjut ke alur pembayaran (FR-3).

### FR-3. Pembayaran Langganan (Payment Gateway)

- **FR-3.1** Integrasi **Midtrans** sebagai payment gateway utama (Snap API). Struktur kode dibuat abstrak (`PaymentGatewayInterface`) agar mudah diganti/ditambah **Xendit**.
- **FR-3.2** Endpoint `POST /subscribe/checkout` (auth: role `admin` pending/aktif):
  - Input: `plan_id`
  - Output: `snap_token` + `order_id` (contoh format `PB-{workspaceId}-{random}`).
- **FR-3.3** Saat checkout, buat record `payments` (status `pending`) dengan `order_id` unik & snapshot harga plan.
- **FR-3.4** Frontend memakai `PaymentGateway` / modal Snap (sertakan library `@midtrans/snap` atau banner script; endpoint `/snap/embed` di sisi backend).
- **FR-3.5** **Webhook** `POST /api/webhooks/midtrans` (tanpa auth session, diverifikasi lewat server key):
  - Status `settlement` / `capture` + `fraud_status=accept` → aktivasi (FR-5).
  - Status `pending`/`authorize` → update `payments.status`.
  - Status `cancel`/`deny`/`expire` → tandai gagal, workspace tetap `pending`, beri kesempatan bayar ulang.
- **FR-3.6** Simpan respon webhook mentah untuk audit (kolom `raw_response` / tabel `payment_logs`).

### FR-4. Halaman Pembayaran & Status (Frontend)

- **FR-4.1** Buat halaman/state pasca-registrasi: "Menunggu Pembayaran" yang mem-*refresh* status `subscription`/`payments` (polling atau refresh manual + poll webhook).
- **FR-4.2** Saat payment sukses → user diarahkan ke `/dashboard` (sudah `active`).
- **FR-4.3** Halaman `Admin/Subscription/Index.jsx` di-wire ke backend: tampilkan plan aktif, status langganan (aktif/berakhir/lewat jatuh tempo), riwayat pembayaran, dan (di fase ini) dropdown paket untuk upgrade (memunculkan checkout baru).

### FR-5. Aktivasi & Siklus Langganan

- **FR-5.1** Aktivasi otomatis saat webhook sukses:
  - `workspaces.status = active`
  - `users.status = active` (role `admin`)
  - `subscriptions.status = active`
  - `subscriptions.ends_at = now + plan_duration` (bulanan default)
- **FR-5.2** Fungsi/command `RenewalCheck` (console scheduled, tiap hari): menandai `subscription` yang lewat `ends_at` menjadi `expired` dan `workspace.status = suspended`.
- **FR-5.3** Workspace `suspended` → admin/operator tidak bisa akses panel (middleware), landing tetap berfungsi, admin diberi opsi "Perpanjang" (checkout ulang).
- **FR-5.4** `super_admin` bisa secara manual mengaktifkan/menonaktifkan tenant dari dashboard monitoring.

### FR-6. Auth & RBAC

- **FR-6.1** Perluas tabel `users` + model dengan `role` (enum) dan `status` (`active`/`inactive`/`pending`/`suspended`).
- **FR-6.2** Middleware baru: `AdminPanel` (hanya `super_admin`/`admin`), `SuperAdmin`, `OperatorPanel`, `EnsureActiveWorkspace`.
- **FR-6.3** Setiap controller Inertia memakai **Policy** atau **Gate** (contoh `ProjectPolicy::update`) dan selalu mengirim `Abort(403)` saat tidak berizin.
- **FR-6.4** Handle data user yang dibagikan ke frontend (`HandleInertiaRequests.php`): sertakan `auth.user.role`, `auth.user.workspace`, dan daftar menu yang boleh dirender (untuk menyembunyikan menu operator yang tidak berhak).
- **FR-6.5** Halaman `Admin/Users/Index.jsx` di-wire: admin hanya bisa melihat & membuat user **role `operator`** (dan dirinya), tidak pernah bisa membuat admin lain.

### FR-7. Panel Operator (Terbatas)

- **FR-7.1** Route `GET /operator` → halaman baru `resources/js/Pages/Operator/Dashboard.jsx` (bisa memakai komponen UI existing).
- **FR-7.2** Konten panel operator:
  - Ringkasan singkat: sesi hari ini, perangkat yang tersedia/konek, galeri terbaru.
  - Halaman "Kiosk / Jalankan Sesi": memakai `Admin/Photobooth/Kiosk.jsx` yang di-wire ke backend (`sessions.store`, memilih project/device aktif, trigger capture, aplikasi template/frame).
  - Halaman Galeri: lihat & flag foto (wire `Admin/Gallery/Index.jsx` untuk operator dengan izin terbatas).
- **FR-7.3** Router/redirect: middleware `operator` memastikan operator **tidak** bisa membuka `/admin/*`.
- **FR-7.4** Operator tidak melihat menu Administrasi/Keuangan di sidebar (sembunyikan via props menu).

### FR-8. Super Admin Monitoring

- **FR-8.1** Route `GET /admin/monitoring` untuk `super_admin` menampilkan **dashboard tenant**:
  - Tabel workspace: nama, pemilik, paket, status langganan, jumlah operator, jumlah device, jumlah sesi, jumlah transaksi (7 hari terakhir).
  - Filter: status, paket, pencarian nama/email.
  - Aksi: lihat detail tenant, suspend/aktivasi manual.
  - Tombol aksi "Lihat tenant" → halaman detail workspace (statistik + daftar user/device/transaksi).
- **FR-8.2** `Admin/Dashboard.jsx` untuk `super_admin` menampilkan KPI platform (total tenant, MRR perkiraan, sesi global, transaksi global) — update halaman sesuai role.
- **FR-8.3** `Admin/Transactions/Index.jsx`, `Admin/Sessions/Index.jsx`, `Admin/Gallery/Index.jsx` mendukung mode "semua tenant" untuk `super_admin` (kolom tambahan nama workspace).

### FR-9. Kerangka Data Modul Admin (DB + CRUD Dasar)

> Semua entitas di bawah dibuatkan migration, model (dengan global scope workspace), seeder contoh, dan controller + route Inertia **dasar** (list/index + create + update + delete). Logika bisnis/telemetri penuh dikerjakan fase berikutnya, namun frontend yang sudah ada di-wire agar tidak memakai data statis.

- **Proyek** (`projects`): nama, deskripsi, template aktive/frame default, status.
- **Perangkat** (`devices`): nama, tipe (booth/kiosk/tablet), kode unik, status (`online`/`offline`/`printing`/`capturing`), lokasi, `last_heartbeat`.
- **Template** (`templates`) & **Frame** (`frames`): nama, file asset (path), kategori, aktif.
- **Sesi Foto** (`sessions`): id unik (`SESH-XXXX`, auto), id project, id device, status (`capturing`/`processing`/`printed`/`failed`), jumlah foto, template dipakai, durasi.
- **Foto/Galeri** (`photos`): id sesi, path file, urutan/strip, flag favorite.
- **Transaksi** (`transactions`): id unique (`TRX-XXXX`), id sesi (nullable), tipe (print/refund/upgrade), jumlah (int cents), metode (`QRIS`/`cash`/`card`), status.
- **Dompet** (`wallets`): saldo int cents, riwayat (opsional di fase ini).
- **Notifikasi in-app** (`notifications`): gunakan Laravel Notifications default atau `notifications` custom (opsional; bisa lewati di fase inti).

---

## 6. Data Model (Rancangan Skema)

> Semua kolom angka uang disimpan sebagai **integer (cents)** untuk menghindari floating-point. Gunakan migration + `nullable` sesuai kebutuhan.

### 6.1 `workspaces`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| name | string | Nama brand/tenant |
| owner_name | string | Nama pemilik |
| plan_id | FK nullable | Plan aktif |
| status | enum | `pending` / `active` / `suspended` |
| picture_url | string nullable | Logo/branding |
| timestamps | — | |

### 6.2 `users` (perluasan tabel existing)
| Kolom | Tipe | Keterangan |
|---|---|---|
| (+ semua existing) | — | |
| role | enum | `super_admin` / `admin` / `operator` |
| workspace_id | FK nullable | null untuk super_admin |
| status | enum | `active` / `pending` / `inactive` / `suspended` |

`super_admin` di-seed dengan seeder (`superadmin@...`). Pastikan hanya satu user `super_admin` pada fase ini (atau gunakan gate `isPlatformOwner`).

### 6.3 `plans`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| name | string | Starter / Event Pro / Enterprise |
| slug | string unique | `starter` / `event-pro` / `enterprise` |
| price_monthly | integer (cents) | 299000 / 699000 / 1500000 |
| device_limit | integer nullable | 1 / 5 / null (tak terbatas) |
| project_limit | integer nullable | 5 / null / null |
| features | json | Array fitur (sinkron dengan frontend) |
| active | boolean | |
| timestamps | — | |

### 6.4 `subscriptions`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| workspace_id | FK unique | Satu langganan aktif per workspace |
| plan_id | FK | |
| status | enum | `pending` / `active` / `expired` / `cancelled` |
| starts_at | timestamp nullable | |
| ends_at | timestamp nullable | |
| timestamps | — | |

### 6.5 `payments` (+ `payment_logs`)
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| workspace_id | FK | |
| subscription_id | FK | |
| order_id | string unique | `PB-{ws}-{rand}` |
| gateway | enum | `midtrans` / `xendit` |
| method | string nullable | `qris`/`va`/`card`/… |
| amount | integer (cents) | |
| status | enum | `pending` / `paid` / `failed` / `expired` / `refunded` |
| gateway_token | string nullable | `snap_token` |
| raw_response | json nullable | Response webhook/API |
| paid_at | timestamp nullable | |
| timestamps | — | |

`payment_logs`: id, payment_id FK, event (string), payload (json), created_at.

### 6.6 Entitas domain (lihat FR-9)
`projects`, `devices`, `templates`, `frames`, `sessions`, `photos`, `transactions`, `wallets` — masing-masing memiliki `workspace_id` (dimana relevan) + kolom sesuai FR-9 dan `timestamps`. Tambahkan index pada kolom pencarian (`workspace_id`, `status`, `created_at`).

---

## 7. API, Webhook & Route

### 7.1 Web Routes (Inertia) — acuan utama
- `/` → LandingPage/Index (redirect ke dashboard sesuai role jika sudah login)
- `/register`, `/login`, `/forgot-password`, `/reset-password` → Breeze
- `/dashboard` → admin dashboard
- `/operator` → panel operator
- `/admin/*` → semua halaman admin existing (dijaga middleware per role)
- `/profile` → Breeze profile

### 7.2 Webhook
- `POST /api/webhooks/midtrans` — **tanpa** middleware `auth:sanctum`/session; verifikasi `signature_key` (SHA-512) memakai `server_key` dari `.env`. Gunakan `X-Midtrans-Signature` dan body JSON.
- Endpoint ini **exclude CSRF** pada webhook group (`shouldSkipCSRF`) karena berformat JSON dengan signature.

### 7.3 Sanctum API (mobile/kiosk) — Catatan
- Endpoint mock di `routes/api.php` **pertahankan** untuk kompatibilitas fase berikutnya, tapi perbarui agar membaca data nyata bila mudah.
- Fase ini prioritas: mobile API belum wajib; kiosk simulator di dashboard yang utama.

### 7.4 Konfigurasi Env (tambahan)
```
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false
```

---

## 8. Non-Functional Requirements & Keamanan

- **NFR-1** Semua query tenant harus di-scope; pastikan **tidak ada kebocoran data lintas tenant** pada index/query apa pun.
- **NFR-2** Validasi Laravel di semua input; pesan error dalam Bahasa Indonesia (lang `*` resource/validation bisa disesuaikan).
- **NFR-3** Webhook Midtrans wajib verifikasi signature; jangan pernah memercayai body tanpa verifikasi.
- **NFR-4** Jangan pernah menyimpan `server_key` di frontend / env publik.
- **NFR-5** Gunakan **Policies** untuk semua mutasi; operator harus ditolak mengakses resource admin.
- **NFR-6** Migrasi harus *idempotent* (mudah di `rollback` & `migrate:fresh --seed`).
- **NFR-7** UI konsisten dengan desain existing (light-mode enterprise SaaS; warna `brand`, `ink`, `canvas`, `surface`, `edge` dari Tailwind config — lihat `tailwind.config.js`).
- **NFR-8** Format angka & Rupiah konsisten (mis. `Rp 1.485.000`, "1,4rb").

---

## 9. Kriteria Penerimaan (Acceptance Criteria)

**AC-1 Landing:** `/` menampilkan hero, fitur, kartu paket, FAQ, testimoni, dan tombol "Daftar Franchise" yang menuju registrasi dengan paket terisi.

**AC-2 Registrasi:** Submit form registrasi membuat workspace + user (role `admin`, status `pending`) + subscription pending dalam 1 transaksi DB. Email unik diverifikasi; duplikat menampilkan error.

**AC-3 Checkout:** Setelah registrasi, checkout Midtrans berjalan (Snap token dihasilkan, popup tampil). Order ID unik; amount sesuai plan.

**AC-4 Webhook sukses:** Saat webhook `settlement` diterima & diverifikasi → workspace, user, subscription menjadi `active`; redirect/tampilan menampilkan status aktif.

**AC-5 Webhook gagal:** Saat `cancel`/`expire` → payment `failed`/`expired`, workspace/status tetap `pending`; admin bisa mencoba bayar ulang.

**AC-6 RBAC:** 
- `operator` tidak bisa mengakses `/admin/*` (403/redirect).
- `admin` tidak bisa melihat workspace tenant lain (data hanya miliknya).
- `super_admin` bisa melihat semua tenant di `/admin/monitoring`.

**AC-7 Operator:** `/operator` tampil; operator dapat memulai sesi (record `sessions`) dan melihat galeri workspace-nya sendiri.

**AC-8 Admin buat operator:** Dari `/admin/users`, admin membuat user role `operator` yang terkait workspace-nya; operator tersebut bisa login dan masuk ke `/operator`.

**AC-9 Super admin seed:** Seeder membuat 1 user `super_admin`, 1 workspace contoh + admin, 2-3 operator, 1 project, 1-2 device, beberapa session/photo (agar dashboard tidak kosong).

**AC-10 Wiring modul inti:** Dashboard admin menampilkan KPI **dari database** (bukan statik); halaman Projects/Devices/Sessions/Gallery/Transactions minimal bisa list & create/update dari DB.

**AC-11 Tabel & migrasi:** `php artisan migrate:fresh --seed` berhasil tanpa error, data contoh muncul.

**AC-12 Token API:** `/admin/api-tokens` (Sanctum) berfungsi untuk admin; halaman existing di-wire.

---

## 10. Rencana Implementasi (Urutan Kerja untuk Developer)

> Kerjakan secara berurutan; setiap langkah harus lolos sebelum lanjut.

1. **Migrasi & Model**
   - Buat migrasi: `workspaces`, update `users` (role, workspace_id, status), `plans`, `subscriptions`, `payments`, `payment_logs`, dan entitas domain (FR-9).
   - Buat model + relasi (+Global Scope `workspace`, kecuali super_admin).
   - Seeder: super_admin, 3 plan, tenant contoh + operator + data demo.
2. **RBAC & Middleware**
   - `role` enum helper; middleware `AdminPanel`, `SuperAdmin`, `Operator`, `EnsureActiveWorkspace`; daftarkan di `Kernel`/`bootstrap`.
   - HandleInertiaRequests: share role, status, menu sesuai role.
3. **Auth Wiring**
   - Perluas `RegisterController` untuk flow franchise (buat workspace + admin pending).
   - Redirect based on role (web.php + handler).
   - Update `ProfileController` bila perlu (role/workspace tidak bisa diubah user).
4. **Landing Page**
   - Bangun konten `LandingPage/Index.jsx` + CTA registrasi (FR-1).
5. **Payment (Midtrans)**
   - Service `PaymentService` + `MidtransGateway` (+ interface `PaymentGatewayInterface`).
   - Controller checkout + halaman "menunggu pembayaran".
   - Webhook handler + verifikasi signature + polling frontend.
6. **Subscription & Renewal**
   - Aktivasi, command `subscription:renewal-check` (scheduled), middleware suspended.
7. **Panel Operator**
   - Buat `Operator/Dashboard.jsx`, wire `sessions.store` dari kiosk, halaman galeri operator.
8. **Super Admin Monitoring**
   - Wire `/admin/monitoring` (detail tenant + filter + suspend/activate), Dashboard KPI platform.
9. **Wiring Modul Admin Inti**
   - Projects, Devices, Templates, Frames, Sessions, Gallery, Transactions, Wallet, Settings, ApiTokens, Users (buat operator), Subscription.
10. **Test & Polish**
    - `php artisan test` (Feature: registrasi franchise, RBAC, webhook logic, scoping tenant).
    - `npm run build` tanpa error; uji alur end-to-end manual.

---

## 11. Out of Scope (Fase Ini)

- Logika telemetri kiosk realtime penuh (websocket/broadcast) — cukup simulasi & record sesi.
- Recurring billing otomatis (belum perlu; pakai perpanjangan manual checkout).
- Mobile/kiosk client app (API Sanctum mobile tetap stabil, endpoint avanzado fase berikutnya).
- Report & analytics lanjutan (export Excel, grafik mendalam).
- Custom domain per tenant / branding level advanced.
- Notifikasi in-app realtime.
- Multi-payment-gateway aktif (cukup interface + Midtrans; Xendit menyusul).

---

## 12. Definisi Selesai (Definition of Done)

1. `composer install`, `npm install`, `php artisan migrate:fresh --seed`, `npm run build` berjalan tanpa error.
2. Alur lengkap diuji: Landing → Daftar Franchise → Checkout (mode sandbox) → Webhook aktivasi → Admin login → buat operator → Operator login & jalankan sesi → Super Admin pantau tenant.
3. Semantic role enforcement: operator/anonim tidak bisa menyentuh data admin/tenant lain.
4. Seluruh halaman admin yang sudah ada minimal tidak menampilkan data statis lagi untuk fitur inti (list berasal dari DB).