# Hostinger Node.js Production Deployment Guide

This document catalogs the configuration, architecture, and step-by-step instructions to deploy **Forever Frames India** on Hostinger Premium Node.js Web Hosting.

---

## 💻 1. Hostinger Environment Architecture

- **Runtime Environment:** Node.js v18+ or v20+
- **Frontend Framework:** React with Vite (statically compiled assets)
- **Backend Service:** Express under Passenger / Node Cluster
- **Database Engine:** Secure JSON Database (`data/db.json`)
- **Image Upload System:** Local directory storage (`uploads/`)

---

## ⚙️ 2. Environment Variables Configuration

Create a `.env` file in the root of the Node.js application container on your Hostinger panel:

```env
# Application Core Modes
NODE_ENV=production
PORT=3000

# Canonical domain configuration for sitemap, canonical links, and absolute paths
APP_URL=https://foreverframesindia.com

# JWT Secret Key for authenticating administrative actions (e.g. creating blogs, stories, testimonials)
JWT_SECRET=production_long_cryptographically_secure_random_key_here

# Central administration panel passwords
ADMIN_PASSWORD=ForeverFrames2026
```

---

## 📦 3. Fast Setup & Installation

Follow these key steps inside the Hostinger Node.js Application control section:

### Step A: Code Packaging
1. Pull standard source materials or upload the project ZIP folder.
2. Build the optimized production bundle locally or via the deployment pipeline:
   ```bash
   npm install
   npm run build
   ```
3. The build script automatically performs:
   - Compiles client React code into optimized chunks under `dist/`
   - Bundles the backend server from `server.ts` into standard self-referential Node.js ESM/CJS source at `dist/server.cjs`

### Step B: Hostinger Dashboard Configuration
1. Go to **Hostinger Panel > Websites > Manage > Node.js**.
2. Select your Preferred **Node.js Version** (e.g., `Node.js 18` or `Node.js 20`).
3. Set **Application Entry File:** `dist/server.cjs`
4. Set **Application Document Root:** the standard workspace path containing your `package.json`.
5. Set environment variables on the Hostinger interface matching your `.env` settings.
6. Click **Run npm Install** from the control panel.
7. Click **Start Applet / Restart Application**.

---

## 🗄️ 4. Local Database Storage & Backup Operations

The application utilizes a hardened, corruption-safe synchronous JSON writer with automatic lock file checks and daily backup generations:
- All active database storage persists inside: `/data/db.json`
- Daily auto-generated backup checkpoints are stored inside: `/data/backups/db-YYYY-MM-DD.json`

### 📥 Creating Manual Checkpoint / Backups
To perform a manual backup at any time:
- Copy the file `/data/db.json` to `/data/backups/db-manual-YYYY-MM-DD.json`.
- Or compress the whole `data` directory using Hostinger's file manager.

### 📤 Restoration Protocol
If database rolls back, gets corrupted, or needs restore:
1. Locate the backup file you wish to restore (e.g., `data/backups/db-2026-05-30.json`).
2. Stop the Node.js application in Hostinger dashboard.
3. Replace the contents of `data/db.json` with the backup file's contents.
4. Restart the Node.js application.

---

## 🖼️ 5. Image Uploads and Asset Preservation

All custom images uploaded by the administration dashboard are preserved locally:
- Upload files reside inside: `/uploads/`
- Standard formats allowed: `.jpg`, `.jpeg`, `.png`, `.webp`
- File limit: Max **10MB**

> ⚠️ **CRITICAL CAPABILITY WARNING:**
> When updating code or performing subsequent git pushes/re-deployments, ensure you **DO NOT** delete, wipe, or overwrite the local `/uploads/` directory on Hostinger, as this directory stores user images uploaded directly during live production. Include `/uploads/` and `/data/` in your deployment exclude filters.

---

## 🔄 6. Production Application Update Process

When releasing features or modifying copy on the website:
1. Re-build the client: `npm run build`
2. Stop the server process in the Hostinger panel.
3. Upload new files (excluding `data/` and `uploads/` to prevent real customer lead/image losses).
4. Run `npm install` on Hostinger if any dependencies have changed.
5. Click **Restart Node.js process / Start app**.
