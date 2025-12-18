# Datacakra Feeds

A modern, dynamic article sharing platform built with **Next.js 16**, **TypeScript**, and **Strapi**.

[**Explore Live Demo**](https://datacakra-feeds.vercel.app/)

![Datacakra Feeds Banner](https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop)

## 🚀 Overview

Datacakra Feeds is a full-featured blog application that allows users to read, create, and interact with articles. Designed with a focus on performance and user experience, it features a responsive dashboard, robust content management, and real-time interactive elements.

## ✨ Key Features

### 🌐 Public Interface
- **Hero Carousel**: Engaging, animated carousel showcasing featured travel destinations or top stories.
- **Recommended Articles**: Smart suggestions for related content on article details pages.
- **Interactive Comments**: Real-time comment system with auto-updates enabling immediate user feedback.

### 🔐 Authentication & Dashboard
- **Secure Auth**: Powered by **NextAuth.js v5** (Beta) with Strapi provider integration.
- **User Dashboard**: Dedicated area for managing personal articles and categories.
- **CRUD Operations**: Complete Create, Read, Update, and Delete capabilities for articles and categories.
- **Search & Filter**: Real-time search and category filtering for managing content efficiently.

### 🛠️ Technical Highlights
- **Modern Framework**: Built on the bleeding edge with **Next.js 16 (App Router)** and **React 19**.
- **State Management**: Scalable API state management using **Redux Toolkit (RTK Query)**.
- **Styling**: Sleek, accessible UI components built with **Shadcn/UI**, **Tailwind CSS v4**, and **Framer Motion**.
- **Performance**: Optimistic updates and server-side rendering for lightning-fast page loads.

## 🛠️ Tech Stack & Versions

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | `16.0.10` | App Router Framework |
| **React** | `19.0.0` | UI Library (Server Components) |
| **TypeScript** | `5.9.3` | Type Safety |
| **Redux Toolkit** | `2.11.2` | State Management (API Cache) |
| **Tailwind CSS** | `4.0.0` | Styling Engine |
| **Shadcn/UI** | Latest | Accessible Components |
| **NextAuth.js** | `5.0.0-beta`| Authentication |
| **Strapi** | v5 | Headless CMS Backend |

## 📁 Project Structure & Naming Conventions

The project follows a modular App Router structure.

### Directory Structure

```plaintext
src/
├── actions/            # Server Actions for mutations (e.g., comments.ts)
├── app/                # Next.js App Router Pages
│   ├── (auth)/         # Grouped Layout: Authentication routes (login, register)
│   ├── (public)/       # Grouped Layout: Public pages (Landing, Article Detail)
│   └── (protected)/    # Grouped Layout: Protected dashboard routes (middleware guarded)
├── components/         # React Components
│   ├── ui/             # Reusable accessible primitives (Button, Card, Input)
│   └── (features)/     # Feature-specific components (ArticleCard, Hero, CommentList)
├── lib/                # Libraries and Utilities
│   ├── api/            # API fetch wrappers (articles.ts, categories.ts)
│   └── utils.ts        # Helper functions (cn, formatter)
├── redux/              # State Management
│   ├── api/            # RTK Query Endpoints
│   └── store.ts        # Redux Store configuration
└── types/              # TypeScript Interfaces (index.ts)
```

### Naming Conventions

- **Files**: `kebab-case` (e.g., `article-card.tsx`, `page.tsx`, `layout.tsx`).
- **Components**: `PascalCase` (e.g., `function ArticleCard()`).
- **Directories**: `kebab-case`. Grouped routes use parenthesis `(group-name)`.
- **Functions**: `camelCase` (e.g., `fetchArticles`, `handleDelete`).

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js 20+
- npm or pnpm

### Installation Steps

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/datacakra-feeds.git
    cd datacakraarticle
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and configure your variables:

    ```env
    # App
    NEXT_PUBLIC_API_URL=http://localhost:1337   # Strapi Backend Public URL
    NEXT_PUBLIC_STRAPI_URL=http://localhost:1337

    # Auth
    AUTH_SECRET=your_auth_secret_here           # Generate: openssl rand -base64 32
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the application.

## � Deployment

The application is deployed on **Vercel**.

1.  Connect your GitHub repository to Vercel.
2.  Configure the build settings (Framework Preset: Next.js).
3.  Add the Environment Variables in the Vercel dashboard.
4.  Deploy!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
