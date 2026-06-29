# Next.js Web Client for Kata

This is the Next.js frontend application for the Kata Blog Platform. It utilizes a type-safe API client layer, reactive query mutations, and clean, responsive UI layouts.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS, Shadcn/ui elements, Framer Motion (micro-animations)
- **Data Fetching**: TanStack Query (React Query)
- **Authentication**: Better-Auth browser client
- **Text Editor**: Tiptap Rich Text Editor

---

## 📂 Directories & Pages

```text
├── app/
│   ├── (auth)/          # Authentication layouts (/sign-in, /sign-up)
│   ├── (root)/
│   │   ├── create/      # Creation dashboard (featured cover, Tiptap, category combobox)
│   │   ├── blogs/
│   │   │   └── [slug]/  # Article display and social interactions (likes, bookmarks, comments)
│   │   │       └── edit/# Article editing page (syncs states and locks access for non-authors)
│   │   ├── profile/     # Public dashboard with tabbed user posts, likes, and bookmarks
│   │   │   └── edit/    # Profile configuration (avatar camera uploads, name editor)
│   │   └── stories/     # Infinite exploration page (load-more, debounced filters)
├── components/
│   └── custom/          # Custom components (Tiptap editor, searchable category dropdowns)
├── hooks/queries/       # TanStack Query custom hooks (useBlogs, useUsers, useImages)
└── lib/                 # Core utilities (API fetch client wrappers, Better-Auth client)
```

---

## 💻 Running the Project

1. **Install Dependencies**:
   ```bash
   bun install
   ```

2. **Configure Environment**:
   Create a `.env` file containing:
   ```env
   NEXT_PUBLIC_SERVER_URL="http://localhost:8000"
   ```

3. **Start Development Build**:
   ```bash
   bun run dev
   ```

4. **Verify TypeScript & Production Compilation**:
   ```bash
   bun run typecheck
   bun run build
   ```
