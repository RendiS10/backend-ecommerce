# JKT48 Merchandise Backend API

Backend ini dibangun dengan Express.js, Sequelize, dan MySQL. Berikut panduan singkat untuk menjalankan dan menguji API menggunakan Postman.

## 1. Persiapan

- Pastikan Node.js, npm, dan MySQL (Laragon) sudah terinstall.
- Buat database `jkt48_merchandise_db` di MySQL.
- Salin file `.env.example` ke `.env` dan sesuaikan konfigurasi database.
- Install dependencies:

```bash
npm install
```

## 2. Menjalankan Server

```bash
node app.js
```

Server berjalan di `http://localhost:3000`

## 3. Struktur Endpoint Utama

### Autentikasi

- **Register:** `POST /api/auth/register`
  - Body: `{ "full_name": "Nama", "email": "email@mail.com", "password": "password", "role": "customer" }`
- **Login:** `POST /api/auth/login`
  - Body: `{ "email": "email@mail.com", "password": "password" }`
  - Response: `{ token: "..." }`

### Produk

- **List Produk:** `GET /api/products`
- **Tambah Produk:** `POST /api/products` (admin, butuh token)

### Kategori

- **List Kategori:** `GET /api/categories`
- **Tambah Kategori:** `POST /api/categories` (admin)

### Keranjang

- **Lihat Keranjang:** `GET /api/cart` (butuh token)
- **Tambah ke Keranjang:** `POST /api/cart` (butuh token)
  - Body: `{ "product_id": 1, "variant_id": 2, "quantity": 1 }`

### Pesanan

- **Lihat Pesanan:** `GET /api/orders` (butuh token)
- **Buat Pesanan:** `POST /api/orders` (butuh token)
  - Body: `{ "items": [ { "product_id": 1, "variant_id": 2, "quantity": 1, "price_at_purchase": 100000 } ], "total_amount": 100000, "payment_method": "transfer", "shipping_address": "alamat", "shipping_city": "kota", "shipping_postal_code": "12345" }`

### Review

- **Lihat Review Produk:** `GET /api/reviews/:product_id`
- **Tambah Review:** `POST /api/reviews/:product_id` (butuh token)
  - Body: `{ "rating": 5, "comment": "Bagus!" }`

### Komplain

- **Lihat Komplain (admin):** `GET /api/complaints` (admin)
- **Buat Komplain:** `POST /api/complaints` (butuh token)
  - Body: `{ "order_id": 1, "subject": "Komplain", "description": "Detail komplain" }`

### Transaksi

- **Lihat Transaksi Pesanan:** `GET /api/transactions/:order_id` (butuh token)
- **Buat Transaksi:** `POST /api/transactions` (butuh token)

### Live Chat

- **Lihat Pesan:** `GET /api/messages` (butuh token)
- **Kirim Pesan:** `POST /api/messages` (butuh token)
  - Body: `{ "receiver_id": 2, "message_text": "Halo admin" }`

## 4. Cara Uji di Postman

1. Register & login untuk mendapatkan token JWT.
2. Tambahkan token ke header setiap request yang butuh autentikasi:
   - Key: `Authorization`
   - Value: `Bearer <token>`
3. Coba endpoint lain sesuai kebutuhan.

---

**Catatan:**

- Endpoint admin hanya bisa diakses user dengan role `admin`.
- Untuk upload gambar, integrasi payment gateway, dsb, silakan kembangkan lebih lanjut.

---

Selamat mencoba!
