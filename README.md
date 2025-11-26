# BE Midterm Practice — README

## English

### Project overview

A simple Node.js + MySQL backend for my BE midterm. Organized with `routes/`, `middleware/`, and a `db/` connection file. Includes JWT authentication and basic input validation.

### Prerequisites

* Node.js (v14+ recommended)
* MySQL server (local or remote)
* npm (comes with Node.js)

### Quick setup

1. **Clone the repo**

```bash
git clone https://github.com/araselthenilo/latihan-backend-uts.git
cd latihan-backend-uts
```

2. **Install dependencies**

```bash
npm install
```

3. **Import the database**

Use MySQL Workbench or CLI to import the SQL dump file `latihan-backend-uts.sql` in `db/`:

```bash
# create the database (if needed)
mysql -u your_mysql_user -p -e "CREATE DATABASE IF NOT EXISTS your_db_name;"
# import the dump
mysql -u your_mysql_user -p your_db_name < path/to/your_db_name.sql
```

4. **Create and fill `.env`**

Create a `.env` file, or rename and use `.env.example` in the project root then add the following (replace values):

```
HOST=your_host
PORT=your_port

DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=your_db_name

JWT_SECRET=some_secret_here
```

5. **Start the server**

```bash
npm start
```
or
```bash
node ./index.js
```

Server should be available at `http://localhost:3000` (or the `PORT` you set).

### API overview

Brief list of available routes:

* `POST /auth/signup` — register new user
* `POST /auth/sigin` — login and receive JWT and cookie
* `GET /auth/signout` — sign out and delete cookie

* `GET /users` — list active users (member/admin)
* `GET /users/:id` — get active user by id (member/admin)

* `PUT /users/:id` — update active user by id (admin)
* `DELETE /users/:id` — soft delete active user by id (admin)
* `GET /users/inactive` — list inactive users (admin)
* `GET /users/inactive/:id` — get inactive user by id (admin)
* `POST /users/reactivate/:id` — reactivate inactive user by id (admin)

* `GET /products` — list active products (member/admin)
* `GET /products/:id` — get active product by id (member/admin)

* `POST /products` — create product (admin)
* `PUT /products/:id` — update active product by id (admin)
* `DELETE /products/:id` — soft delete active product by id (admin)
* `GET /products/inactive` — list inactive products (admin)
* `GET /products/inactive/:id` — get inactive product by id (admin)
* `POST /products/reactivate/:id` — reactivate inactive product by id (admin)

---

## Bahasa Indonesia

### Ringkasan proyek

Backend sederhana Node.js + MySQL untuk tugas BE. Terstruktur dengan `routes/`, `middleware/`, dan file koneksi `db/`. Termasuk autentikasi JWT dan validasi input dasar.

### Prasyarat

* Node.js (disarankan v14+)
* Server MySQL (lokal atau remote)
* npm

### Langkah cepat

1. **Clone repo**

```bash
git clone https://github.com/araselthenilo/latihan-backend-uts.git
cd latihan-backend-uts
```

2. **Instal dependensi**

```bash
npm install
```

3. **Import database**

Gunakan MySQL Workbench atau CLI untuk mengimpor file dump SQL `latihan-backend-uts.sql` di `db/`:

```bash
# buat database jika perlu
mysql -u username_mysql -p -e "CREATE DATABASE IF NOT EXISTS nama_db;"
# impor dump
mysql -u username_mysql -p nama_db < path/to/backup.sql
```

4. **Buat dan isi `.env`**

Buat file `.env` di root proyek dan tambahkan (ganti sesuai kebutuhan):

```
HOST=nama_host_anda
PORT=angka_port_anda

DB_USER=username_mysql_anda
DB_PASSWORD=password_mysql_anda
DB_NAME=nama_db_anda

JWT_SECRET=kode_rahasia
```

5. **Jalankan server**

```bash
npm start
```
atau
```bash
node ./index.js
```

Server akan berjalan di `http://localhost:3000` (atau `PORT` yang Anda atur).

### Ringkasan API

Daftar singkat route:

* `POST /auth/signup` — registrasi user baru
* `POST /auth/sigin` — login and terima JWT and cookie
* `GET /auth/signout` — sign out and hapus cookie

* `GET /users` — daftar user aktif (member/admin)
* `GET /users/:id` — cari active user aktif berdasarkan id (member/admin)

* `PUT /users/:id` — update user aktif berdasarkan id (admin)
* `DELETE /users/:id` — soft delete user aktif berdasarkan id (admin)
* `GET /users/inactive` — daftar user nonaktif (admin)
* `GET /users/inactive/:id` — cari user nonaktif berdasarkan id (admin)
* `POST /users/reactivate/:id` — aktivasi ulang user nonaktif berdasarkan id (admin)

* `GET /products` — daftar produk aktif (member/admin)
* `GET /products/:id` — cari produk aktif berdasarkan id (member/admin)

* `POST /products` — buat produk baru (admin)
* `PUT /products/:id` — update produk aktif berdasarkan id (admin)
* `DELETE /products/:id` — soft delete product aktif berdasarkan id (admin)
* `GET /products/inactive` — daftar produk nonaktif (admin)
* `GET /products/inactive/:id` — cari produk nonaktif berdasarkan id (admin)
* `POST /products/reactivate/:id` — aktivasi ulang produk nonaktif berdasarkan id (admin)