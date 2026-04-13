# Secure File Sharing Platform

Full-stack web app for sending **small sensitive files** (JPG, PNG, PDF, up to **4 MB**) with a **password**, an **expiration date**, and either a **registered recipient** or a **public share link**. Recipients use a normal browser; public-link downloads do not require an account.

**Repository name:** `Secure-File-Sharing-Platform` (the product is branded **Secure File Sharing Platform** in the UI).

---

## Key features

- **Accounts** - Register, log in, and manage profile and password from the web UI.
- **Registered-user sharing** - Send a file to another user by email; it appears in their inbox.
- **Public share links** - Upload without a recipient and share a tokenized URL (`/share/[token]`) with anyone.
- **Password-gated downloads** - Sender sets a file password; recipient must supply it to download.
- **Expiration** - Sender picks an expiry; a backend job deletes expired files and links.
- **Encrypted storage** - Files are encrypted before persistence (AES + RSA); metadata and password hashes live in PostgreSQL.
- **Browser-first workflow** - No desktop client; Next.js frontend and Rust API.

---

## Plain-language overview

If you are not a developer: sign up, upload a file, set a password and expiry, then either pick a colleague who already has an account or generate a link. Share the link and tell the recipient the password separately (message, call, in person). They open the link in a browser, enter the password, and download. Only JPG, PNG, and PDF are supported, up to 4 MB per file.

---

## My contribution

The **Rust backend** started from an **online tutorial** (Axum, auth, encryption, database patterns). My main work is the **frontend and product layer** I built on top of it:

- Marketing **landing page** and overall layout/navigation  
- **Login and registration** flow (NextAuth credentials)  
- **Protected dashboard**: uploads list, received files, profile  
- **Upload and share** flow: recipient vs public link, validation, success and share-link UX  
- **Public download page** for tokenized links  
- **Profile / account** screens (name and password updates)  
- Wiring to the API, environment configuration, and README documentation  

The backend was extended where needed for public links and stricter validation; the scope above reflects what I own as the primary author of the user-facing application.

---

## How it works

1. User **registers or logs in**.  
2. On registration, the backend creates an **RSA key pair** for that user.  
3. User **uploads** a file, sets a **password** and **expiration**, and chooses:  
   - **Registered user** - recipient is selected by email (must exist in the system).  
   - **Public link** - no recipient; the API returns a **share token** and anyone with the link plus password can download until expiry.  
4. The backend **encrypts** the file payload, stores ciphertext and related fields, and creates a **share record**.  
5. The recipient opens **Inbox** (registered) or the **public share URL**, enters the **file password**, and downloads if the link is still valid.  
6. A **scheduled job** on the backend removes expired files and links.

---

## Technical overview

| Layer | Stack | Role |
|--------|--------|------|
| **Frontend** | Next.js 14 (App Router), TypeScript, NextAuth, Tailwind, shadcn/ui | UI, auth session, protected routes (middleware), forms, tables, public share page |
| **Backend** | Rust, Axum, SQLx, PostgreSQL, JWT, Argon2, Tokio cron | Auth, multipart upload, encryption, list/send/receive APIs, public share endpoints, expiry cleanup |

**Request flow (simplified):**

- Frontend collects file, password, expiry, and share mode; sends multipart to the API (authenticated upload).  
- Backend validates type/size and dates, encrypts, persists **encrypted file + metadata** in the database.  
- Download paths (registered or public) check **password** and **expiry**, then stream decrypted bytes to the client.  
- Cron task deletes rows and files that are past expiration.

---

## Security and limitations

This project **does not** implement strict **client-side end-to-end encryption** in the sense that only the users' devices ever see keys or plaintext. **Private keys are generated and stored on the server** (`file-share-backend/assets/private_keys`), and **decryption runs on the server** before a download response is sent.

What you do get, accurately:

- **Encrypted at rest** in the database (ciphertext, wrapped keys, IV).  
- **Password-required** downloads for both registered and public flows.  
- **Time-bounded** access via expiration.  
- **JWT-protected** APIs for authenticated operations; public routes limited to share info + download by token.

Treat this as a **portfolio / learning-grade** security posture: useful for demonstrating full-stack patterns, not a substitute for a audited product security review.

---

## Project structure

```
file-share-frontend/   Next.js app (UI, auth, dashboard, share page)
file-share-backend/    Rust API, migrations, encryption, scheduler
```

---

## Run locally

### Prerequisites

- **PostgreSQL** running and a database created for the app  
- **Rust** and **Cargo** ([rustup](https://rustup.rs/))  
- **Node.js 18+** and **npm**

### Order

1. **Backend** - from `file-share-backend/`: run migrations, then start the server.  
2. **Frontend** - from `file-share-frontend/`: install dependencies, then start the dev server.

Default API URL in examples: **http://localhost:8000** (API routes under `/api`).

### Backend

```bash
cd file-share-backend
sqlx migrate run    # first clone or after new migrations
cargo run
```

```env
DATABASE_URL=postgresql://postgres@localhost:5433/file_share_tutorial
JWT_SECRET_KEY=my_ultra_secure_jwt_secret_key
JWT_MAXAGE=60
```

### Frontend

```bash
cd file-share-frontend
npm install
npm run dev
```

```env
API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXTAUTH_SECRET=your_nextauth_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

`NEXT_PUBLIC_API_URL` must include the **`/api`** prefix so browser calls hit `/api/file/...` and `/api/share/...` correctly.

Open **http://localhost:3000** after both processes are running.

---

## Summary

**Secure File Sharing Platform** is a concise full-stack demo: authenticated users share password-protected, expiring files via inbox or public links, backed by a Rust API and PostgreSQL. The README stays honest about **server-managed keys and decryption** while highlighting a **production-style frontend** and clear **non-technical** expectations alongside the technical path.
