# TeamTask Manager

### High-Performance Distributed Task Orchestration

A minimalist, high-throughput task management system built with a focus on low-latency interactions and strict Role-Based Access Control (RBAC). Designed for teams that prioritize speed and a sophisticated "New Luxury" interface.

---

## 🏗 High-Level Architecture

This project utilizes a modern distributed architecture designed for scalability and developer experience.

- **Frontend:** React 18 with **TypeScript**, powered by **Vite** for near-instant HMR.
- **State Management:** **RTK Query** for automated cache invalidation and seamless data synchronization.
- **UI System:** **shadcn/ui** with **Tailwind CSS**, adhering to a warm minimalist design language.
- **Backend:** **Node.js/Express** MVC architecture with a focus on systems engineering.
- **Database:** **PostgreSQL** orchestrated via **Prisma ORM** for type-safe relational mapping.
- **Security:** Stateless **JWT Authentication** with granular RBAC (Admin/Member).

---

## 🚀 Key Features

- **Role-Based Dashboards:** Distinct perspectives for Admins (Project/Task creation) and Members (Task execution).
- **Automated Cache Management:** Real-time UI updates via RTK Query tag invalidation—no manual state syncing required.
- **Persistence Layer:** Secure session management with local storage hydration and base-query interceptors.
- **Distributed Logging:** Integration ready for high-frequency event architectures like Telescope.

---

## 🛠 Installation & Local Development

### Prerequisites

- Node.js (v18+)
- PostgreSQL instance (or Docker)

### 1. Clone & Install Dependencies

From the root directory, install all dependencies across the monorepo:

```bash
npm run install:all
```

### 2. Environment Configuration

Create a `.env` file in the `backend` folder:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskdb"
JWT_SECRET="your_secure_secret"
NODE_ENV="development"
```

### 3. Database Migration

```bash
cd backend
npx prisma db push
```

### 4. Fire it up

Run both the frontend and backend concurrently:

```bash
npm run dev
```

---

## 🌐 Deployment

This project is configured for **Railway**. The production build uses a unified pipeline where the Express server serves the static Vite build, minimizing CORS overhead and infrastructure costs.

**Production Stack:**

- **Host:** Railway
- **CI/CD:** Automated GitHub Actions
- **Environment:** Production-grade PostgreSQL

---

## 👤 Author

**Abhinav Verma**  
_Software Engineer & Full-Stack Developer_  
LeetCode Guardian (2200+) | Codeforces Expert  
Specializing in distributed systems and high-end motion design.
