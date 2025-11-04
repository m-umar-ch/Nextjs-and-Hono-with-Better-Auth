# ⚡ Next.js + Hono Full-Stack Starter with Better Auth

A production-ready full-stack starter combining **Next.js 16 + React 19** frontend with a **Hono + Bun** backend, featuring seamless **Better Auth** integration, **Google OAuth**, **Email OTP authentication**, and **Role-Based Access Control (RBAC)**.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Environment Setup](#-environment-setup)
- [Running the Application](#-running-the-application)
- [Development Workflow](#-development-workflow)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [API Documentation](#-api-documentation)
- [Database Management](#-database-management)
- [Authentication](#-authentication)
- [Error Monitoring](#-error-monitoring)
- [Detailed Documentation](#-detailed-documentation)

---

## 🎯 Overview

This is a **monorepo-style** full-stack application featuring:

- **Frontend**: Next.js 16 with React 19, TanStack Query, and OpenAPI Fetch for type-safe API calls
- **Backend**: Hono framework with Bun runtime, Drizzle ORM, and Better Auth for authentication
- **Authentication**: Complete Better Auth integration with Google OAuth and Email OTP
- **Authorization**: Pre-configured RBAC system for secure, scalable access control
- **Type Safety**: End-to-end type safety from database to frontend via OpenAPI

---

## 🏗️ Architecture

```
Nextjs-and-Hono-with-Better-Auth/
├── frontend/          # Next.js 16 + React 19 frontend
│   ├── src/
│   │   ├── app/       # App Router pages and layouts
│   │   ├── auth/      # Better Auth client configuration
│   │   ├── DAL/       # Data Access Layer (OpenAPI Fetch)
│   │   └── components/
│   └── package.json
│
└── backend/           # Hono + Bun backend
    ├── src/
    │   ├── modules/   # Feature modules (auth, user, mailer)
    │   ├── db/        # Drizzle ORM schema and migrations
    │   └── lib/       # Core utilities and middleware
    └── package.json
```

Both frontend and backend share:

- **Better Auth** for unified authentication
- **OpenAPI** for type-safe API contracts
- **Sentry** for error monitoring (optional)

---

## 🚀 Features

### Frontend Features

- ⚛️ **Next.js 16 (App Router)** with **React 19**
- 🔐 **Better Auth client integration**
  - Login via **Google OAuth**
  - Login via **Email OTP**
- 🧠 **RBAC**-ready authentication (matches backend setup)
- 🔗 **OpenAPI Fetch** for fully typed API requests
- ⚙️ **TanStack Query** for API state management
- 🧱 Built-in support for **server and client components**
- 💨 Optimized Next.js config with React Compiler and component caching
- 🪲 **Sentry** integration for error monitoring (optional)

### Backend Features

- ⚡ **Blazing-fast** Hono + Bun setup
- 🧩 **Type-safe** Drizzle ORM with PostgreSQL
- 🔐 **Better Auth Integration**
  - Google OAuth login
  - Email OTP authentication via Resend
  - Pre-configured **RBAC (Role-Based Access Control)**
- 📧 **Resend** for transactional emails
- 🪲 **Sentry** for error tracking (optional)
- 🧱 Built-in **OpenAPI** documentation
- 🧪 Ready for production and scalable apps

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **[Bun](https://bun.sh/)** (latest version) - JavaScript runtime and package manager
- **PostgreSQL** database (local or remote)
- **Node.js 18+** (if not using Bun exclusively)
- **Git** for version control

### Optional Services

- **Resend** account (for email delivery)
- **Google Cloud Console** project (for OAuth)
- **Sentry** account (for error monitoring)

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/m-umar-ch/Nextjs-and-Hono-with-Better-Auth.git
cd Nextjs-and-Hono-with-Better-Auth
```

### 2. Install Dependencies

Install dependencies for both frontend and backend:

```bash
# Install backend dependencies
cd backend
bun install

# Install frontend dependencies
cd ../frontend
bun install
```

### 3. Set Up Environment Variables

Configure environment variables for both applications (see [Environment Setup](#-environment-setup) below).

### 4. Set Up Database

```bash
cd backend
bun run db:generate
bun run db:migrate
```

### 5. Start Development Servers

In separate terminal windows:

```bash
# Terminal 1: Start backend (port 9999)
cd backend
bun run dev

# Terminal 2: Start frontend (port 3000)
cd frontend
bun run dev
```

Visit:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:9999/api
- **API Documentation**: http://localhost:9999/api/reference

---

## 🧩 Environment Setup

### Backend Environment Variables

Create `backend/.env`:

```bash
NODE_ENV="development"
PORT=9999
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Email via Resend
RESEND_API_KEY="your-resend-api-key"

# Sentry (optional)
SENTRY_ENABLED=false
SENTRY_DSN=""

# Better Auth configuration
BETTER_AUTH_SECRET="your-secret-key-here"  # Generate a secure random string
BACKEND_BASE_URL="http://localhost:9999"
FRONTEND_BASE_URL="http://localhost:3000"

# Google OAuth credentials
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Frontend Environment Variables

Create `frontend/.env`:

```bash
NODE_ENV="development"

NEXT_PUBLIC_FRONTEND_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_BACKEND_BASE_URL="http://localhost:9999"

BETTER_AUTH_SECRET="same-secret-as-backend"  # Must match backend secret

# Optional - Sentry setup
SENTRY_ORG=""
SENTRY_PROJECT=""
SENTRY_DNS=""
SENTRY_AUTH_TOKEN=""
```

### 🔑 Generating BETTER_AUTH_SECRET

Generate a secure secret for Better Auth:

```bash
# Using openssl
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Important**: Use the **same** `BETTER_AUTH_SECRET` value in both frontend and backend `.env` files.

---

## 🧭 Running the Application

### Development Mode

Run both servers in development mode with hot reload:

```bash
# Backend (Terminal 1)
cd backend
bun run dev

# Frontend (Terminal 2)
cd frontend
bun run dev
```

### Production Build

Build and run for production:

```bash
# Backend
cd backend
bun run build
bun run start

# Frontend
cd frontend
bun run build
bun run start
```

---

## 🔄 Development Workflow

### 1. Creating a New Backend Module

Follow the module creation guide in `backend/README.md`:

1. Add module tag in `backend/src/modules/module.tags.ts`
2. Create module folder structure
3. Define routes, controllers, and services
4. Register controller in `backend/src/main.ts`
5. Run database migrations if needed

### 2. Generating OpenAPI Types

After updating backend routes, regenerate frontend types:

```bash
cd frontend
bun run openapi
```

This fetches the OpenAPI schema from the running backend and generates type-safe API clients.

### 3. Using Type-Safe API Calls

#### In Server Components (Frontend)

```ts
import { api } from "@/DAL/utils/server";
import { tryCatch } from "@/lib/utils";

const { data: response, error } = await tryCatch(api.GET("/api/user/profile"));
```

#### In Client Components (Frontend)

```ts
import { api } from "@/DAL/utils/client";
import { useQuery } from "@tanstack/react-query";

const { data, error, isLoading } = useQuery({
  queryKey: ["user-profile"],
  queryFn: () => api.GET("/api/user/profile"),
});
```

---

## 📁 Project Structure

```
Nextjs-and-Hono-with-Better-Auth/
│
├── frontend/                          # Next.js frontend application
│   ├── src/
│   │   ├── app/                      # App Router
│   │   │   ├── (auth)/               # Auth routes group
│   │   │   │   ├── login/            # Login page
│   │   │   │   └── _components/      # Auth components
│   │   │   └── (root)/               # Root routes group
│   │   ├── auth/                     # Better Auth client
│   │   ├── DAL/                      # Data Access Layer
│   │   │   ├── api-types.d.ts        # Auto-generated OpenAPI types
│   │   │   └── utils/                # API client utilities
│   │   ├── components/               # React components
│   │   └── lib/                      # Utilities and configs
│   └── package.json
│
└── backend/                          # Hono backend application
    ├── src/
    │   ├── modules/                  # Feature modules
    │   │   ├── auth/                 # Authentication module
    │   │   ├── user/                 # User management
    │   │   └── mailer/               # Email service
    │   ├── db/                       # Database
    │   │   ├── schema/               # Drizzle schema definitions
    │   │   └── migrations/           # Database migrations
    │   ├── lib/                      # Core libraries
    │   │   ├── core/                 # Router, logger, OpenAPI config
    │   │   ├── middlewares/          # Hono middlewares
    │   │   └── utils/                # Utility functions
    │   └── main.ts                   # Application entry point
    └── package.json
```

---

## 🧰 Tech Stack

### Frontend

| Tool                        | Purpose                            |
| --------------------------- | ---------------------------------- |
| **Next.js 16 (App Router)** | Full-stack React framework         |
| **React 19**                | Latest React runtime               |
| **Better Auth**             | Authentication + RBAC              |
| **TanStack Query**          | Data fetching and caching          |
| **OpenAPI Fetch**           | Type-safe API client               |
| **Bun**                     | Modern runtime and package manager |
| **Sentry**                  | Error tracking (optional)          |

### Backend

| Tool            | Purpose                                 |
| --------------- | --------------------------------------- |
| **Hono**        | Lightning-fast web framework            |
| **Bun**         | Modern JavaScript runtime               |
| **Drizzle ORM** | Type-safe ORM for SQL databases         |
| **Better Auth** | Authentication + RBAC                   |
| **Resend**      | Email delivery for OTPs                 |
| **PostgreSQL**  | Production-ready relational database    |
| **Sentry**      | Error tracking & performance monitoring |

---

## 📚 API Documentation

Once the backend is running, access the interactive API documentation:

- **API Base URL**: `http://localhost:9999/api`
- **OpenAPI Reference**: `http://localhost:9999/api/reference`

The API documentation is automatically generated from your route definitions and includes:

- Request/response schemas
- Authentication requirements
- Example requests
- Response codes

---

## 🗄️ Database Management

### Generate Migrations

After modifying database schema:

```bash
cd backend
bun run db:generate
```

### Run Migrations

Apply migrations to your database:

```bash
cd backend
bun run db:migrate
```

### Push Schema (Development)

Directly push schema changes without migrations:

```bash
cd backend
bun run db:push
```

### Open Drizzle Studio

Visual database browser:

```bash
cd backend
bun run db:studio
```

This opens a web interface at `http://localhost:4983` to browse and edit your database.

---

## 🔐 Authentication

This project supports two authentication methods:

### 1. Google OAuth Login

1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - Your production URL (production)
5. Add credentials to `.env` files

### 2. Email OTP Login

1. Sign up for [Resend](https://resend.com/)
2. Get your API key
3. Add `RESEND_API_KEY` to `backend/.env`
4. Configure your sending domain in Resend dashboard

### Using Authentication in Code

#### Server Components (Frontend)

Always use the provided utilities from `@/DAL/auth`:

```ts
import { getUser } from "@/DAL/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return <div>Welcome {user.email}</div>;
}
```

For full session data:

```ts
import { getSession } from "@/DAL/auth";

const session = await getSession();
const user = session?.user;
const sessionData = session?.session;
```

These utilities:

- ✅ Use `tryCatch` internally for error handling
- ✅ Return `null` if not authenticated or on error
- ✅ Automatically handle headers for server-side requests

#### Client Components (Frontend)

For client components, access session via `authClient`:

```ts
"use client";
import { authClient } from "@/auth/auth-client";
import { useEffect, useState } from "react";

export function ClientComponent() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      setUser(data?.user);
    });
  }, []);

  return <div>{user?.email}</div>;
}
```

**Note**: Prefer server components for authentication checks when possible.

### RBAC (Role-Based Access Control)

The authentication system includes pre-configured RBAC:

- User roles are managed in the database
- Permissions are checked server-side
- Frontend can access user role via session data

---

## 🪲 Error Monitoring with Sentry

### Backend Setup

1. Set `SENTRY_ENABLED=true` in `backend/.env`
2. Add your `SENTRY_DSN` from your Sentry project
3. (Optional) Configure additional options in `backend/src/lib/core/SENTRY_SETUP.md`

### Frontend Setup

1. Add Sentry credentials to `frontend/.env`:
   ```bash
   SENTRY_ORG="your-org"
   SENTRY_PROJECT="your-project"
   SENTRY_DNS="your-dsn"
   SENTRY_AUTH_TOKEN="your-auth-token"
   ```
2. Run Sentry setup:
   ```bash
   cd frontend
   bunx @sentry/wizard@latest -i nextjs
   ```

Sentry will automatically track errors and performance metrics in both frontend and backend.

---

## 📖 Detailed Documentation

For more detailed information about each part of the application:

- **[Backend README](./backend/README.md)** - Complete backend documentation including:

  - Module creation guide
  - Database commands
  - API structure
  - Middleware configuration

- **[Frontend README](./frontend/README.md)** - Complete frontend documentation including:
  - OpenAPI Fetch integration
  - Component structure
  - Authentication usage
  - TanStack Query setup

---

## 🧑‍💻 Author

**Muhammad Umar Chaudhry**

🔗 [GitHub Profile](https://github.com/m-umar-ch)

⭐ If you find this starter useful, don't forget to **star the repo**!

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/m-umar-ch/Nextjs-and-Hono-with-Better-Auth/issues).

---

## 🙏 Acknowledgments

- [Hono](https://hono.dev/) - Lightning-fast web framework
- [Better Auth](https://www.better-auth.com/) - Modern authentication library
- [Next.js](https://nextjs.org/) - React framework
- [Drizzle ORM](https://orm.drizzle.team/) - Type-safe ORM
- [TanStack Query](https://tanstack.com/query) - Data fetching library
