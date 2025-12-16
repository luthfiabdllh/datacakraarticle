# **Product Requirement Document (PRD)**

## **Article Management Platform \- Frontend Assessment**

| Informasi Proyek | Detail |
| :---- | :---- |
| **Project Name** | Datacakra Article Feeds |
| **Platform** | Web Application (Next.js \- Server & Client Hybrid) |
| **Version** | 1.3.0 (Full API Coverage) |
| **Tech Stack Target** | **Next.js 14+ (App Router)**, TypeScript, Tailwind CSS, Shadcn/UI, **NextAuth.js**, Redux Toolkit, **next-themes** |
| **Status** | Ready for Development |

## **1\. Executive Summary**

Aplikasi ini adalah platform manajemen konten berita/artikel yang memungkinkan pengguna umum (Guest) membaca artikel dan pengguna terdaftar (Author) untuk membuat serta mengelola artikel mereka sendiri. Tujuan utama pengembangan adalah mendemonstrasikan kemampuan *Frontend Engineering* yang komprehensif, mencakup integrasi API kompleks, state management yang efektif, dan implementasi UI/UX modern.

## **2\. Tech Stack & Architecture (Strategic Choice)**

Berdasarkan instruksi "Secret Hint" dan upgrade ke Next.js:

* **Framework:** **Next.js 16 **(Menggunakan **App Router** app/ directory).  
* **Styling:** **Tailwind CSS** \+ **shadcn/ui**.  
* **Theme Management:** **next-themes** (Library standar untuk handle Dark/Light mode di Next.js \+ Shadcn).  
* **Authentication:** **NextAuth.js (v5 atau v4)**.  
  * Menggunakan CredentialsProvider untuk login kustom ke endpoint API /api/auth/local.  
* **State Management:** **Redux Toolkit (RTK)**.  
  * *Global UI State:* (Sidebar, Modal) di Client Components.  
  * *Data Fetching:* **RTK Query** untuk Client-side interaction (Dashboard).  
  * *Note:* Untuk Public Feeds, kita bisa menggunakan **Server Components (fetch)** agar SEO friendly, namun tetap gunakan RTK Query di sisi client (dashboard) untuk memenuhi persyaratan soal tentang Redux.  
* **Form Management:** **React Hook Form** \+ **Zod**.  
* **Icons:** Lucide React.

## **3\. User Personas**

1. **Guest (Public Visitor):**  
   * Melihat Landing Page (Server Side Rendered).  
   * Mencari dan memfilter artikel.  
   * Membaca detail artikel dan komentar.  
   * Mengganti tema tampilan (Terang/Gelap).  
2. **Author (Authenticated User):**  
   * Melakukan Login/Register.  
   * Membuat, Mengedit, dan Menghapus artikel miliknya.  
   * **Mengelola Kategori (CRUD Kategori).**  
   * Mengupload gambar cover artikel.  
   * Mengirim, **Mengedit, dan Menghapus** komentar.

## **4\. Sitemap & Page Structure (Next.js App Router)**

### **4.1. Public Routes (app/(public))**

* app/page.tsx **(Landing Page):** Hero section \+ Highlight artikel.  
* app/articles/page.tsx **(Explore):** List artikel dengan Filter & Search (Server Component untuk fetch awal \+ Client Component untuk Infinite Scroll).  
* app/articles/\[id\]/page.tsx **(Detail):** Konten penuh artikel. Gunakan generateMetadata untuk SEO dinamis.  
* app/login/page.tsx & app/register/page.tsx: Halaman autentikasi.

### **4.2. Protected Routes (app/(dashboard))**

* app/dashboard/page.tsx: Ringkasan aktivitas user (Stats jumlah artikel).  
* app/dashboard/my-articles/page.tsx: Tabel manajemen CRUD artikel user.  
* app/dashboard/categories/page.tsx: **(NEW)** Tabel manajemen CRUD Kategori.  
* app/dashboard/create/page.tsx: Form pembuatan artikel baru.  
* app/dashboard/edit/\[id\]/page.tsx: Form edit artikel.

## **5\. Functional Requirements (Fitur Detail)**

### **5.1. Authentication & Security (NextAuth Implementation)**

* **Register:** Form Manual POST ke /api/auth/local/register. Setelah sukses, auto-login menggunakan NextAuth signIn().  
* **Login:** Menggunakan **NextAuth Credentials Provider**.  
  * User input email & password.  
  * NextAuth memanggil endpoint /api/auth/local.  
  * Token JWT dari API disimpan ke dalam **NextAuth Session**.  
* **Middleware:** Gunakan middleware.ts untuk memproteksi folder /dashboard. Jika user belum login, redirect ke /login.

### **5.2. Article Feeds (Explore Page)**

* **Tampilan:** Grid Card responsif.  
* **Hybrid Fetching:**  
  * *Initial Load:* Server Component melakukan fetch data pertama (SEO friendly).  
  * *Infinite Scroll & Filter:* Client Component melanjutkan fetch data berikutnya menggunakan RTK Query atau Server Actions.  
* **Advanced Filtering:**  
  * Integrasi URL Search Params (useSearchParams) agar filter bisa di-share (contoh: ?category=Tech\&q=AI).

### **5.3. Article Detail**

* **SEO Optimization:** Gunakan generateMetadata untuk mengambil Judul dan Gambar artikel agar muncul cantik saat di-share di sosmed (Open Graph).  
* **Content:** Render deskripsi artikel.  
* **Social Share:** Tombol Share.

### **5.4. Article Management (CRUD \- Dashboard)**

* **List:** Menampilkan artikel user sendiri (Filter by user.id).  
* **Create/Edit Form:**  
  * Input: Title, Category (Fetch dari API Categories), Description, Cover Image.  
  * **Image Upload Flow:**  
    1. User pilih file \-\> Frontend POST ke /api/upload.  
    2. Tunggu response URL gambar.  
    3. Masukkan URL ke payload artikel.  
* **Delete:** Konfirmasi via Modal Dialog.

### **5.5. Category Management (CRUD \- Dashboard)**

* **Fitur Tambahan (Extra Miles):** Karena API menyediakan endpoint Create/Update/Delete Category, buatlah halaman manajemen kategori sederhana.  
* **List:** Menampilkan semua kategori dalam tabel.  
* **Action:** Tambah Kategori Baru, Edit Nama Kategori, Hapus Kategori.

### **5.6. Comments System (Advanced)**

* **List Komentar:** Tampilkan daftar komentar di bawah artikel.  
* **Add Comment:** Form posting komentar (Butuh Login).  
* **Edit/Delete Comment:**  
  * Jika current\_user.id \=== comment.user.id, tampilkan tombol Edit & Delete (API: PUT /api/comments/:id, DELETE /api/comments/:id).  
  * Fitur ini jarang dibuat kandidat lain, nilai plus besar\!

### **5.7. Theme Customization (Dark Mode)**

* **Theme Toggle:** Tombol di Navbar (Icon Sun/Moon) untuk mengganti mode.  
* **Persistence:** Pilihan tema tersimpan di local storage.

## **6\. Technical Requirements & API Mapping**

### **6.1. Endpoint vs Feature Matrix**

Pastikan semua endpoint di bawah ini terpakai di aplikasi:

| Group | Method | Endpoint | Fitur di Frontend |
| :---- | :---- | :---- | :---- |
| **Articles** | GET | /api/articles | Homepage & Dashboard List |
| **Articles** | GET | /api/articles/:id | Article Detail Page |
| **Articles** | POST | /api/articles | Dashboard Create Article |
| **Articles** | PUT | /api/articles/:id | Dashboard Edit Article |
| **Articles** | DELETE | /api/articles/:id | Dashboard Delete Article |
| **Comments** | GET | /api/comments | Comment List (di Detail Page) |
| **Comments** | POST | /api/comments | Post Comment Form |
| **Comments** | PUT | /api/comments/:id | **Edit Comment Modal** |
| **Comments** | DELETE | /api/comments/:id | **Delete Comment Action** |
| **Category** | GET | /api/categories | Filter Dropdown & Category List |
| **Category** | POST | /api/categories | **Dashboard Create Category** |
| **Category** | PUT | /api/categories/:id | **Dashboard Edit Category** |
| **Category** | DELETE | /api/categories/:id | **Dashboard Delete Category** |
| **Auth** | POST | /auth/local/register | Register Page |
| **Auth** | POST | /auth/local | NextAuth Login Provider |
| **Auth** | GET | /users/me | User Profile / Header Info |
| **Upload** | POST | /api/upload | Form Upload Gambar |

### **6.2. NextAuth Configuration (auth.ts)**

// Contoh Logic CredentialsProvider  
async authorize(credentials) {  
  const res \= await fetch("BASE\_URL/api/auth/local", {  
    method: "POST",  
    body: JSON.stringify(credentials),  
    headers: { "Content-Type": "application/json" }  
  })  
  const user \= await res.json()  
    
  if (res.ok && user.jwt) {  
    return { ...user.user, jwt: user.jwt }  
  }  
  return null  
}

### **6.3. Data Fetching Strategy**

* **Server Components:** Gunakan fetch() standar dengan opsi cache: 'no-store' (untuk data real-time) atau revalidate (untuk data statis).  
* **Client Components (Redux RTK Query):** Gunakan untuk fitur interaktif dashboard (Articles CRUD, Category CRUD).

### **6.4. UI/UX "Extra Miles"**

* **Loading UI:** Gunakan loading.tsx (Skeleton).  
* **Error UI:** Gunakan error.tsx.  
* **Toaster:** Gunakan sonner atau react-hot-toast untuk feedback aksi CRUD (Sukses simpan, Gagal hapus, dll).

## **7\. Design System (Visual Identity)**

* **Font:** Konfigurasi next/font/google untuk *Plus Jakarta Sans* & *Inter*.  
* **Components:** Shadcn/UI (Button, Input, Card, Skeleton, Form, DropdownMenu, Table, Dialog).

## **8\. Langkah Pengerjaan (Timeline Assessment)**

1. **Setup (30 Menit):** npx create-next-app@latest, install Shadcn, Redux, NextAuth, **next-themes**.  
2. **Auth Integration (1.5 Jam):** Konfigurasi api/auth/\[...nextauth\], Middleware, dan Halaman Login.  
3. **Public Features (2 Jam):** Landing Page, Article List (Server+Client), Filter Logic.  
4. **Detail Page & Comments (1.5 Jam):** Dynamic Route \[id\], Metadata, **CRUD Komentar**.  
5. **Dashboard System (3 Jam):**  
   * **Module Article:** CRUD Article \+ Upload.  
   * **Module Category:** CRUD Category (**Fitur Tambahan**).  
6. **Polishing (1 Jam):** Loading states, Error handling, Responsiveness.

## **9\. Definition of Done (DoD)**

* \[ \] Semua endpoint Postman telah terintegrasi (termasuk Update/Delete Category & Comment).  
* \[ \] Theme Toggle berfungsi.  
* \[ \] User Flow CRUD Artikel & Kategori berjalan mulus.  
* \[ \] Validasi form menggunakan Zod berjalan.  
* \[ \] Kode terstruktur rapi dengan TypeScript.