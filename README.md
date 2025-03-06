# 🤖 ChatGPT Next.js Application

A modern chat application built with Next.js, integrating Anthropic's AI capabilities and Supabase for data storage.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Anthropic](https://img.shields.io/badge/Anthropic-6B46C1?style=for-the-badge&logo=anthropic&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

![](public/screenshot.png)

## 📖 Table of Contents

- [✨ Prerequisites](#-prerequisites)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [📍 API Endpoints](#-api-endpoints)
- [➕ Adding New Routes](#-adding-new-routes)
- [✈️ Deploying to Vercel](#-deploying-to-vercel)
- [🌀 Deploying to a custom domain](#-deploying-to-a-custom-domain)
- [📝 License](#-license)

## ✨ Prerequisites

This workshop assumes that you are somewhat familiar with git, React, JavaScript, HTML, CSS, and using terminal commands.

You will also need to get:

1. **Supabase Account & Project** (free)

   - Sign up at [Supabase](https://supabase.com)
   - Create a new project

2. **Anthropic API Key** (optional - requires credit card information)

   - Sign up at [Anthropic Console](https://console.anthropic.com)

3. **Vercel Account** (free)

   - Sign up at [Vercel](https://vercel.com)

4. **Docker Desktop** (free)

   - Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
   - Make sure it also installed [Docker Compose](https://docs.docker.com/compose/install/)

## 🚀 Getting Started

1. Clone (or fork) this repository
2. Copy the `.env.example` file to a new file called `.env` and fill in your environment variables from Supabase and (optionally) Anthropic.
3. Go to **Supabase > SQL Editor** and paste the contents of `setup.sql` into the query editor. Run the query. Verify that it says "Success. No rows returned".
4. **Disable email verification** by going to **Supabase > Authentication > Sign In / Up > Email >** and disable the **"Confirm email"** toggle, and click Save.
5. In your terminal, run `docker-compose up` and wait for the containers to start. If you get an error that says `Is the docker daemon running?`, open the Docker Desktop app manually and try again.
6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The Docker setup includes hot reload, so any changes you make to the files will be reflected immediately in the browser.

![](public/supabase-keys.png)

## 📁 Project Structure

The project uses Next.js 14 App Router with client-side and server-side authentication.

```bash
chatgptnextjs/
├── app/
│   ├── api/           # API route handlers
│   │   ├── chat/      # AI chat endpoints
│   │   └── conversations/ # Conversation management
│   ├── auth/          # Authentication pages
│   ├── settings/      # Settings page
│   ├── layout.tsx     # Root layout with auth and theme
│   └── page.tsx       # Main chat interface
├── components/
│   ├── auth/         # Authentication page components
│   ├── ui/           # Reusable UI components
│   ├── chat-area.tsx # Main chat interface
│   └── chat-sidebar.tsx # Conversation sidebar
├── lib/              # Shared utilities
│   └── supabase.ts   # Supabase client and types
├── public/           # Static assets like images
└── types/            # TypeScript type definitions
```

### 📍 API Endpoints

All endpoints require Supabase authentication and return appropriate HTTP status codes (401, 404, 500) on errors.

- `POST /api/chat`

  - Streams AI responses using Claude-3-Sonnet
  - Body: `{ messages: Message[] }`

- `GET /api/conversations`

  - Lists user's conversations with nested messages
  - Sorted by newest first

- `POST /api/conversations`

  - Creates new conversation
  - Optional body: `{ messages: Message[] }`

- `DELETE /api/conversations/[id]`

  - Deletes conversation and its messages
  - Returns `{ success: true }`

- `GET /api/conversations/[id]/messages`

  - Lists messages in conversation
  - Sorted chronologically

- `POST /api/conversations/[id]/messages`
  - Adds message to conversation
  - Body: `{ role: string, content: string }`

### ➕ Adding New Routes

To add new functionality:

1. Create route handler in `app/api/`:

   - Create a `route.ts` file for HTTP methods
   - Follow the existing patterns for server-side authentication and error handling

2. Add pages and UI components in `components/`:

   - Create new page `page.tsx` or component `my-component.tsx`
   - Follow existing patterns for client-side auth hooks and data fetching if needed

## ✈️ Deploying to Vercel

**Option 1: Terminal** (if you have `pnpm` and `Node.js` installed locally)

1. Install [Vercel CLI](https://vercel.com/docs/cli):
   ```bash
   pnpm install -g vercel
   ```
2. Run `vercel` and follow the instructions to deploy the application
3. (If not automatic) Go to Vercel Dashboard, paste your `.env` in the Project Settings, then re-deploy

**Option 2: Vercel Dashboard**

1. Go to Vercel Dashboard and create a new project from your forked repository
2. Go to Project Settings and paste your `.env` in the Environment Variables section

## 🌀 Deploying to a custom domain

You can get a free `.me` domain through **Namecheap** with the [GitHub Student Developer Pack](https://education.github.com/pack). Once you have "purchased" the domain:

1. Go to Vercel Dashboard (see previous section)
2. Click on your project > Domains > Add Domain > Add
3. Follow the instructions on the Vercel page to configure your `A` record and `CNAME` record on Namecheap

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
