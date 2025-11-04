# ⚡ Next.js Frontend with Better Auth + TanStack Query + OpenAPI Fetch

A production-ready **Next.js 16 + React 19** frontend built to seamlessly integrate with the **Hono Backend Starter**.
It includes a complete **Better Auth client**, **Google OAuth + Email OTP login**, and **OpenAPI Fetch** setup for type-safe API calls.

---

## 🚀 Features

- ⚛️ **Next.js 16 (App Router)** with **React 19**
- 🔐 **Better Auth client integration**

  - Login via **Google OAuth**
  - Login via **Email OTP**

- 🧠 **RBAC**-ready authentication (matches backend setup)
- 🔗 **OpenAPI Fetch** for fully typed API requests
- ⚙️ **TanStack Query** for API state management
- 🧱 Built-in support for **server and client components**
- 💨 Optimized Next.js config with:

  1. `reactCompiler: true`
  2. `cacheComponents: true`

- 🪲 **Sentry** integration for error monitoring (optional)

---

## 🧩 Environment Setup

Copy the example `.env` file and update it with your values:

```bash
cp .env.example .env
```

### 🧾 Updated Environment Variables

```bash
NODE_ENV="development"

NEXT_PUBLIC_FRONTEND_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_BACKEND_BASE_URL="http://localhost:9999"

BETTER_AUTH_SECRET="some-random-secret"

# Optional - Sentry setup
SENTRY_ORG=""
SENTRY_PROJECT=""
SENTRY_DNS=""
SENTRY_AUTH_TOKEN=""
```

---

## 🔐 Authentication

This project supports:

- **Google OAuth Login**
- **Email OTP Login**

Both methods are fully powered by **Better Auth** and synchronized with your backend RBAC setup.

You’ll find:

- `/login` — Email & Google sign-in page
- Persistent session handling via `authClient`
- Secure logout functionality

---

## 🌐 OpenAPI Fetch Integration

For **type-safe API access**, this project uses **openapi-fetch** and **auto-generates** types from your backend OpenAPI schema `(make sure backend is running)`.

### Generate OpenAPI client

```bash
bun run openapi
```

### Usage

#### In **Server Components**:

```ts
import { api } from "@/DAL/utils/server";
import { tryCatch } from "@/lib/utils";

const { data: response, error } = await tryCatch(api.GET("/api/user/profile"));
```

#### In **Client Components**:

```ts
import { api } from "@/DAL/utils/client";

const { data, error, isLoading } = useQuery({
  queryKey: ["user-profile"],
  queryFn: () => api.GET("/api/user/profile"),
});
```

---

## 🔐 Using Better Auth

You can easily access the authenticated user or session anywhere in your app using the **Better Auth client**.

```ts
import { authClient } from "@/auth/auth-client";
import { headers } from "next/headers";

const { data } = await authClient.getSession({
  fetchOptions: { headers: await headers() },
});

const user = data?.user;
```

This ensures your session is securely fetched with server-side headers and works seamlessly in both **server** and **client components**.

---

## ⚙️ Installation

```bash
bun install
```

---

## 🧭 Running the Application

### Development mode

```bash
bun run dev
```

### Build for production

```bash
bun run build
```

### Run production build

```bash
bun run start
```

---

## 🧰 Tech Stack

| Tool                        | Purpose                            |
| --------------------------- | ---------------------------------- |
| **Next.js 16 (App Router)** | Full-stack React framework         |
| **React 19**                | Latest React runtime               |
| **Better Auth**             | Authentication + RBAC              |
| **TanStack Query**          | Data fetching and caching          |
| **OpenAPI Fetch**           | Type-safe API client               |
| **Bun**                     | Modern runtime and package manager |
| **Sentry**                  | Error tracking (optional)          |

---

## 🧑‍💻 Author

**Muhammad Umar Chaudhry**
🔗 [GitHub Profile](https://github.com/m-umar-ch)

⭐ If you find this starter useful, don’t forget to **star the repo**!

---

## 🧠 Backend Link

👉 Get the matching backend here:
[**Hono Backend Starter with Better Auth**](https://github.com/m-umar-ch/Hono-Backend-Starter)
