# Kata: Modern Blogging & Storytelling Platform

Kata is a robust, premium monorepo blogging platform built for seamless content creation, discovery, and social interaction. It features a modern, responsive web client, a high-performance Express API gateway, and fully integrated media/database synchronization.

---

## 🌟 Project Architecture

The workspace is organized as a monorepo containing three main components:

```text
├── client/          # Next.js 16 Web Client (Turbopack, Tailwind CSS, TanStack Query)
├── server/          # Express.js REST API Server (Bun, Prisma ORM, PostgreSQL)
└── mobile/          # Mobile Application workspace
```

---

## 🚀 Key Features

### 1. Rich Content Creation
- **Tiptap Rich-Text Editor**: Supports headers, formatting (bold, italic, underline, highlight), lists, alignment, hyperlinks, blockquotes, inline/block code, and undo/redo states.
- **Dynamic Tag Resolution**: Seamless tag entry using comma-separated strings with automatic database slugification and attachment.
- **Searchable Category Selector**: Allows quick category search, filtering layouts to at most 5 results to keep interfaces pristine.

### 2. Media & Storage Sync
- **Cloudinary Integration**: Supports drag-and-drop cover and gallery image uploads.
- **Lifecycle Syncing**: Automatically deletes image assets from Cloudinary when records are deleted from the database.

### 3. Infinite Exploration
- **Debounced Exploration Search**: Filters stories responsively without overloading the database.
- **Load More Pagination**: Asynchronously appends consecutive pages using TanStack Query.

### 4. Personalization & Interaction
- **Edit Profiles**: Dynamic uploader for user avatars and name modification.
- **Social Engagement**: Seamless post liking, bookmarking, and nested comments.

---

## ⚙️ Tech Stack

- **Frontend**: Next.js 16 (App Router), Tailwind CSS, Framer Motion, TanStack Query, Lucide Icons, Shadcn/ui.
- **Backend**: Express.js, TypeScript, Bun Runtime, Zod validation, Better-Auth.
- **Database & Storage**: PostgreSQL (via Prisma ORM), Cloudinary SDK.

---

## 🛠️ Getting Started

### Prerequisites
- [Bun Runtime](https://bun.sh) (recommended) or Node.js.
- A running PostgreSQL database instance.
- A Cloudinary account for media assets.

### 1. Server Setup
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   bun install
   ```
3. Configure the `.env` file (Database URL, Port, Cloudinary credentials, and Auth secrets).
4. Run Prisma database migrations:
   ```bash
   bun prisma db push
   ```
5. Start the development server:
   ```bash
   bun run dev
   ```

### 2. Client Setup
1. Navigate to the client folder:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   bun install
   ```
3. Configure the `.env` file (pointing `NEXT_PUBLIC_SERVER_URL` to your API server).
4. Start the Next.js development server:
   ```bash
   bun run dev
   ```

---

## 🔒 Security & Authorization

- Session authentication is managed securely via **Better-Auth**.
- Router updates and resource deletions are locked down on the database level: only the original post author or an authorized administrator (`ADMIN`) can modify or delete stories.
