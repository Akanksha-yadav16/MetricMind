# MetricMind Frontend

This directory contains the Next.js frontend for MetricMind.

## Stack

- Next.js 16.3.0
- React 19.2.8
- Tailwind CSS 4
- Recharts
- Lucide React

## Setup

From this directory:

```bat
npm install
```

Create `.env.local`:

```text
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Start the development server:

```bat
npm run dev
```

Open:

```text
http://localhost:3000
```

## Pages

- `/` — Dashboard
- `/reports` — Reports
- `/analytics` — Analytics
- `/chat` — AI Chat
- `/settings` — Settings and local appearance preferences

## Backend

The frontend expects the MetricMind FastAPI backend to be running at the URL configured by:

```text
NEXT_PUBLIC_API_URL
```

Default:

```text
http://127.0.0.1:8000
```

## Production build

```bat
npm run build
npm start
```

## Lint

```bat
npm run lint
```
