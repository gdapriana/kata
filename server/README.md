# Kata API Server

This is the Express-based backend API service for the Kata Blog Platform, written in TypeScript and optimized for execution with the **Bun** runtime.

---

## 🛠️ Tech Stack

- **Runtime**: Bun
- **Framework**: Express.js
- **Database**: PostgreSQL (via Prisma ORM)
- **Validation**: Zod (type-safe validation middleware)
- **Authentication**: Better-Auth integration
- **Media Hosting**: Cloudinary SDK (for upload/sync handling)

---

## 📂 Project Structure

```text
├── app/
│   ├── controller/      # Route controllers (processes requests & routes responses)
│   ├── database/        # Database clients (prismaClient initializer)
│   ├── helpers/         # Utility functions (response formatting, pagination helpers)
│   ├── middleware/      # Middleware filters (auth checks, file uploads)
│   ├── routes/          # API endpoint router mappings
│   ├── services/        # Database operations & business logic
│   └── validation/      # Zod input schemas (Blog, User validations)
├── prisma/              # Prisma schema configuration & migrations
└── index.ts             # Server entry point
```

---

## 🔑 REST API Routes

### 1. Blogs (`/api/blogs`)
- `POST /create` - Create a new article (requires auth).
- `PATCH /:id` - Update an existing article (requires author/admin auth).
- `DELETE /:id` - Delete an article and clear attachments (requires author/admin auth).
- `GET /get` - Retrieve details of a single article (via slug or ID).
- `GET /query` - Paginate, search, and filter list queries.

### 2. Users (`/api/users`)
- `PATCH /edit` - Update active user name/avatar (requires auth).
- `GET /get` - Retrieve details of a single user profile.
- `GET /query` - List users with paging.

### 3. Images (`/api/images`)
- `POST /upload` - Upload image to Cloudinary and database.
- `DELETE /:id` - Delete image from database and trigger immediate destruction of asset on Cloudinary.

---

## 🚀 Setting Up & Running

1. **Install Dependencies**:
   ```bash
   bun install
   ```

2. **Configure Environment**:
   Create a `.env` file matching this structure:
   ```env
   PORT=8000
   DATABASE_URL="postgresql://user:pass@host:port/dbname"
   CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   BETTER_AUTH_SECRET="your_auth_secret"
   ```

3. **Deploy Database Schema**:
   ```bash
   bun prisma db push
   ```

4. **Start Development Server**:
   ```bash
   bun run dev
   ```

5. **Typecheck & Lint Verification**:
   ```bash
   bun x tsc --noEmit
   ```
